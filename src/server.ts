import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import WebSocket from 'ws';
import cors from 'cors';

// Create Express app
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Replace '*' with your frontend URL in production
  },
});

// Coinbase WebSocket URL
const COINBASE_WS_URL = 'wss://ws-feed.exchange.coinbase.com';

// Active WebSocket connection to Coinbase
const coinbaseWs = new WebSocket(COINBASE_WS_URL);

// Maintain subscriptions for each user
const subscriptions: Record<string, string[]> = {};

// Maintain active channels
const activeChannels: string[] = [];

// Handle WebSocket connection to Coinbase
coinbaseWs.on('open', () => {
  console.log('Connected to Coinbase WebSocket');
});

coinbaseWs.on('message', (message: string) => {
    const data = JSON.parse(message);
  
    // console.log('Message from Coinbase:', data); // Debug Coinbase messages
  
    // Broadcast updates to users for both 'l2update' and 'match'
    if (data.type === 'l2update' || data.type === 'match') {
        console.log('Level2 Update:', data);    
      Object.keys(subscriptions).forEach((userId) => {
        const userProducts = subscriptions[userId];
        if (userProducts.includes(data.product_id || '')) {
        //   console.log(`Sending update to user ${userId}:`, data); // Debug broadcast
          io.to(userId).emit('update', data); // Send update to the user
        }
      });
    }
  });
  
  
coinbaseWs.on('close', () => {
  console.log('Coinbase WebSocket closed. Reconnecting...');
});

coinbaseWs.on('error', (error) => {
  console.error('Coinbase WebSocket error:', error);
});

// Handle client connections
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Initialize user subscription
  subscriptions[socket.id] = [];

  // Handle subscribe event
  socket.on('subscribe', ({ productId }: { productId: string }) => {
    console.log(`User ${socket.id} subscribed to ${productId}`); // Debug subscription

    if (!subscriptions[socket.id].includes(productId)) {
      subscriptions[socket.id].push(productId);

      // Subscribe to product on Coinbase if not already subscribed
      if (!activeChannels.includes(productId)) {
        coinbaseWs.send(
          JSON.stringify({
            type: 'subscribe',
            product_ids: [productId],
            channels: ['level2', 'matches'],
          })
        );
        console.log(`Subscribed to ${productId} on Coinbase`); // Debug Coinbase subscription
        activeChannels.push(productId);
      }

      // Notify user of their subscriptions
      io.to(socket.id).emit('subscribed', subscriptions[socket.id]);
      // Emit system status update
      io.emit('systemStatus', Object.keys(subscriptions).map((id) => subscriptions[id]).flat());
    }
  });

  // Handle unsubscribe event
  socket.on('unsubscribe', ({ productId }: { productId: string }) => {
    console.log(`User ${socket.id} unsubscribed from ${productId}`); // Debug unsubscription

    // Remove from user subscriptions
    subscriptions[socket.id] = subscriptions[socket.id].filter(
      (p) => p !== productId
    );

    // If no one is subscribed to the product, unsubscribe from Coinbase WebSocket
    if (!Object.values(subscriptions).some((subs) => subs.includes(productId))) {
      coinbaseWs.send(
        JSON.stringify({
          type: 'unsubscribe',
          product_ids: [productId],
          channels: ['level2', 'matches'],
        })
      );
      console.log(`Unsubscribed from ${productId} on Coinbase`); // Debug Coinbase unsubscription
      activeChannels.splice(activeChannels.indexOf(productId), 1);
    }

    // Notify user of their updated subscriptions
    io.to(socket.id).emit('subscribed', subscriptions[socket.id]);
    // Emit system status update
    io.emit('systemStatus', Object.keys(subscriptions).map((id) => subscriptions[id]).flat());
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete subscriptions[socket.id];

    // Check if there are no remaining users subscribed to any active channels
    activeChannels.forEach((productId) => {
      if (!Object.values(subscriptions).some((subs) => subs.includes(productId))) {
        coinbaseWs.send(
          JSON.stringify({
            type: 'unsubscribe',
            product_ids: [productId],
            channels: ['level2', 'matches'],
          })
        );
        activeChannels.splice(activeChannels.indexOf(productId), 1);
        console.log(`Unsubscribed from ${productId} on Coinbase due to no active users`);
      }
    });

    // Emit system status update after disconnection
    io.emit('systemStatus', Object.keys(subscriptions).map((id) => subscriptions[id]).flat());
  });
});

// Basic HTTP route to handle GET requests
app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
