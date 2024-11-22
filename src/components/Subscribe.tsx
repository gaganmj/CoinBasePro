import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { Button, Box, Typography, Paper } from '@mui/material';
import styled from 'styled-components';

interface Props {
  socket: Socket;
  subscriptions: string[];
  availableProducts: string[];
}

const Subscribe: React.FC<Props> = ({ socket, subscriptions, availableProducts }) => {
  const [subscribedProducts, setSubscribedProducts] = useState<string[]>(subscriptions);

  const handleSubscribe = (productId: string) => {
    if (!subscribedProducts.includes(productId)) {
      socket.emit('subscribe', { productId });
      setSubscribedProducts((prev) => [...prev, productId]);
    }
  };

  const handleUnsubscribe = (productId: string) => {
    if (subscribedProducts.includes(productId)) {
      socket.emit('unsubscribe', { productId });
      setSubscribedProducts((prev) => prev.filter((product) => product !== productId));
    }
  };

  return (
    <SubscribeContainer data-testid="subscribe-container">
      <Typography variant="h5" align="center" gutterBottom>
        Subscribe to Products
      </Typography>

      <PaperStyled elevation={3}>
        {availableProducts.map((product) => (
          <Box
            key={product}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            gap={2} // Adds a 20px gap between the buttons and product name
            data-testid={`product-${product}`} // Added data-testid for product
          >
            <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
              <ProductName variant="h6" data-testid={`product-name-${product}`}>{product}</ProductName> {/* Added test id for name */}
            </Box>
            <Box display="flex" gap={2}>
              <ButtonStyled
                onClick={() => handleSubscribe(product)}
                disabled={subscribedProducts.includes(product)}
                variant="contained"
                color="primary"
                data-testid={`subscribe-button-${product}`} // Added test id for subscribe button
              >
                Subscribe
              </ButtonStyled>
              <ButtonStyled
                onClick={() => handleUnsubscribe(product)}
                disabled={!subscribedProducts.includes(product)}
                variant="outlined"
                color="secondary"
                data-testid={`unsubscribe-button-${product}`} // Added test id for unsubscribe button
              >
                Unsubscribe
              </ButtonStyled>
            </Box>
          </Box>
        ))}
      </PaperStyled>
    </SubscribeContainer>
  );
};

// Styled container for the subscribe section
const SubscribeContainer = styled.div`
  padding: 30px;
  max-width: 700px;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
`;

// Paper component with styling for better appearance
const PaperStyled = styled(Paper)`
  padding: 20px;
  background-color: #ffffff;
`;

// Styled product name with margin and proper alignment
const ProductName = styled(Typography)`
  margin-right: 20px;  // Adds a right margin to the product name
  margin-left: 20px;   // Adds a left margin to the product name
`;

// Styled MUI Button with no text transformation
const ButtonStyled = styled(Button)`
  text-transform: none;
  font-size: 14px;
  padding: 8px 16px;  // Adjusts the padding for the buttons
`;

export default Subscribe;
