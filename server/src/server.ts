import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import WebSocket from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000; // Use the PORT from the .env file

// Middleware
app.use(cors());
app.use(express.json());

// Dummy username and password for authentication
const dummyUser = {
  username: 'Gagan',
  password: 'Gaganmj@123'
};

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'Dancer';

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
interface Subscriptions {
  [key: string]: string[];
}

const subscriptions: Subscriptions = {};

// Maintain active channels
const activeChannels: string[] = [];

// JWT Authentication Middleware
const authenticateJWT = (socket: Socket, next: Function) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.data.user = user;
      next();
    });
  } catch (error) {
    console.error('Error in JWT authentication middleware:', error);
    next(new Error('Authentication error'));
  }
};

// Handle WebSocket connection to Coinbase
coinbaseWs.on('open', () => {
  console.log('Connected to Coinbase WebSocket');
});

coinbaseWs.on('message', (message: string) => {
  try {
    const data = JSON.parse(message);
    if (data.type === 'l2update' || data.type === 'match') {
      Object.keys(subscriptions).forEach((userId) => {
        const userProducts = subscriptions[userId];
        if (userProducts.includes(data.product_id || '')) {
          io.to(userId).emit('update', data);
        }
      });
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
});

coinbaseWs.on('close', () => {
  console.log('Coinbase WebSocket closed. Reconnecting...');
});

coinbaseWs.on('error', (error: Error) => {
  console.error('Coinbase WebSocket error:', error);
});

// Handle client connections
io.on('connection', (socket: Socket) => {
  try {
    console.log(`User connected: ${socket.id}`);
    subscriptions[socket.id] = [];

    socket.on('subscribe', ({ productId }: { productId: string }) => {
      try {
        if (!subscriptions[socket.id].includes(productId)) {
          subscriptions[socket.id].push(productId);
          if (!activeChannels.includes(productId)) {
            coinbaseWs.send(
              JSON.stringify({
                type: 'subscribe',
                product_ids: [productId],
                channels: ['level2', 'matches'],
              })
            );
            activeChannels.push(productId);
          }
          io.to(socket.id).emit('subscribed', subscriptions[socket.id]);
          io.emit('systemStatus', Object.keys(subscriptions).map((id) => subscriptions[id]).flat());
        }
      } catch (error) {
        console.error('Error handling subscribe event:', error);
      }
    });

    socket.on('unsubscribe', ({ productId }: { productId: string }) => {
      try {
        subscriptions[socket.id] = subscriptions[socket.id].filter(
          (p) => p !== productId
        );
        if (!Object.values(subscriptions).some((subs) => subs.includes(productId))) {
          coinbaseWs.send(
            JSON.stringify({
              type: 'unsubscribe',
              product_ids: [productId],
              channels: ['level2', 'matches'],
            })
          );
          activeChannels.splice(activeChannels.indexOf(productId), 1);
        }
        io.to(socket.id).emit('subscribed', subscriptions[socket.id]);
        io.emit('systemStatus', Object.keys(subscriptions).map((id) => subscriptions[id]).flat());
      } catch (error) {
        console.error('Error handling unsubscribe event:', error);
      }
    });

    socket.on('disconnect', () => {
      try {
        delete subscriptions[socket.id];
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
          }
        });
        io.emit('systemStatus', Object.keys(subscriptions).map((id) => subscriptions[id]).flat());
      } catch (error) {
        console.error('Error during disconnect:', error);
      }
    });
  } catch (error) {
    console.error('Error handling socket connection:', error);
  }
});

// Basic HTTP route to handle GET requests
app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Backend server is running!');
  } catch (error) {
    console.error('Error in root GET route:', error);
    res.status(500).send('Internal server error');
  }
});

// Hash the password for the dummy user (simulating a real password hash in a real database)
bcrypt.hash('Gaganmj@123', 10, (err, hashedPassword) => {
  try {
    if (err) throw err;
    console.log('Hashed password:', hashedPassword);
    dummyUser.password = hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
});

// Route to handle login and JWT token generation
interface LoginRequest {
  username: string;
  password: string;
}

app.post('/login', (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;
    if (username === dummyUser.username) {
      bcrypt.compare(password, dummyUser.password, (err: Error | null, result: boolean) => {
        try {
          if (err || !result) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }

          const token = jwt.sign({ username: dummyUser.username }, JWT_SECRET, { expiresIn: '1h' });

          return res.json({ token });
        } catch (error) {
          console.error('Error comparing password:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in login route:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
server.listen(PORT, () => {
  try {
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
});
