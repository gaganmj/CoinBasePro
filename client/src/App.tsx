import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Typography, Paper, Button, TextField, Container } from '@mui/material';
import Subscribe from './components/Subscribe';
import PriceView from './components/PriceView';
import MatchView from './components/MatchView';
import SystemStatus from './components/SystemStatus';
import './App.css';  // Import the app.css file
import axios from 'axios';

const socket: Socket = io('http://localhost:4000');

interface PriceData {
  [productId: string]: [string, string, string][]; // Format for price data
}

const App: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [priceView, setPriceView] = useState<PriceData>({});
  const [matches, setMatches] = useState<any[]>([]); // Holds the match data
  const [systemStatus, setSystemStatus] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const availableProducts = ['BTC-USD', 'ETH-USD', 'XRP-USD', 'LTC-USD']; // Available products to subscribe

  // Check if token exists in localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    socket.on('subscribed', (data) => {
      
      setSubscriptions(data);
    });

    socket.on('update', (data) => {

      if (data.type === 'l2update') {
        setPriceView((prev) => ({
          ...prev,
          [data.product_id]: data.changes || [],
        }));
      }

      if (data.type === 'match') {
        setMatches((prevMatches) => {
          const newMatches = [
            ...prevMatches,
            {
              time: data.time,
              product: data.product_id,
              size: data.size,
              price: data.price,
              side: data.side,
            },
          ];

          // Keep only the most recent 10 matches
          return newMatches.slice(-10);
        });
      }
    });

    socket.on('systemStatus', (data) => {
      console.log('System status update received:', data);
      setSystemStatus(data);
    });
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
  
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
  
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
      } else {
        setError('Invalid username or password');
      }
    } catch (err: any) {
      console.error('Error during login:', err);
      setError('Invalid username or password');
    }
  };
  


  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    // Show the login page if the user is not authenticated
    return (
      <Container maxWidth="sm" className="login-container">
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </form>
      </Container>
    );
  }

  return (
    <div className="app-container">
      <Typography variant="h4" align="center" gutterBottom>
        Coinbase App
      </Typography>
      <Button variant="outlined" color="secondary" onClick={handleLogout}>
        Logout
      </Button>

      <div className="card-stack">
        <Paper className="styled-card" elevation={6}>
          <Subscribe socket={socket} subscriptions={subscriptions} availableProducts={availableProducts} />
        </Paper>

        <Paper className="styled-card" elevation={6}>
          <PriceView priceData={priceView} />
        </Paper>

        <Paper className="styled-card" elevation={6}>
          <MatchView matches={matches} />
        </Paper>

        <Paper className="styled-card" elevation={6}>
          <SystemStatus channels={systemStatus} />
        </Paper>
      </div>
    </div>
  );
};

export default App;
