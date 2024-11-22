import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Typography, Paper, Button } from '@mui/material';
import Subscribe from './components/Subscribe';
import PriceView from './components/PriceView';
import MatchView from './components/MatchView';
import SystemStatus from './components/SystemStatus';
import styled from 'styled-components';

const socket: Socket = io('http://localhost:4000');

interface PriceData {
  [productId: string]: [string, string, string][]; // Format for price data
}

const App: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [priceView, setPriceView] = useState<PriceData>({});
  const [matches, setMatches] = useState<any[]>([]); // Holds the match data
  const [systemStatus, setSystemStatus] = useState<string[]>([]);

  const availableProducts = ['BTC-USD', 'ETH-USD', 'XRP-USD', 'LTC-USD']; // Available products to subscribe

  useEffect(() => {
    socket.on('subscribed', (data) => {
      console.log('Subscribed data received:', data);
      setSubscriptions(data);
    });

    socket.on('update', (data) => {
      console.log('WebSocket update received:', data);

      // Handling level 2 updates for price view
      if (data.type === 'l2update') {
        setPriceView((prev) => ({
          ...prev,
          [data.product_id]: data.changes || [],
        }));
      }

      // Handling match data and limiting to recent 10 matches
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

  return (
    <AppContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Coinbase App
      </Typography>

      <CardStack>
        <StyledCard elevation={6}>
          <Subscribe socket={socket} subscriptions={subscriptions} availableProducts={availableProducts} />
        </StyledCard>

        <StyledCard elevation={6}>
          <PriceView priceData={priceView} />
        </StyledCard>

        <StyledCard elevation={6}>
          <MatchView matches={matches} />
        </StyledCard>

        <StyledCard elevation={6}>
          <SystemStatus channels={systemStatus} />
        </StyledCard>
      </CardStack>
    </AppContainer>
  );
};

// Styled container for the App
const AppContainer = styled.div`
  background: lightblue;
  padding: 20px;
  border-radius: 16px;
  max-width: 1280px;
  margin-top: 50px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin:0 auto;
`;

// CardStack ensures all cards are stacked vertically
const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Spacing between the cards */
  width: 100%;
  align-items: center;
`;

// Styled MUI Paper component (Card) with padding
const StyledCard = styled(Paper)`
  padding: 20px; /* Add padding inside the card */
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%; /* Make the cards take full width */
  max-width: 600px; /* Max width for cards */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default App;
