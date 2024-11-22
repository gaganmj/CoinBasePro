import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Socket } from 'socket.io-client';
import Subscribe from './Subscribe';

// Mocking socket.io-client's Socket and the `emit` method
jest.mock('socket.io-client', () => ({
  Socket: jest.fn().mockImplementation(() => ({
    emit: jest.fn(), // Mocking the emit method
  })),
}));

describe('Subscribe Component', () => {
  const mockSocket = {
    emit: jest.fn(),
  };  // Using a simple mock object instead of a real instance

  const availableProducts = ['BTC-USD', 'ETH-USD', 'LTC-USD'];
  const subscriptions = ['BTC-USD'];

  beforeEach(() => {
    // Reset mock function before each test
    mockSocket.emit.mockClear();
  });

  it('renders the component correctly', () => {
    render(<Subscribe socket={mockSocket as any} subscriptions={subscriptions} availableProducts={availableProducts} />);

    // Check if the subscribe container is rendered
    expect(screen.getByTestId('subscribe-container')).toBeInTheDocument();

    // Check if product names and buttons are rendered
    availableProducts.forEach((product) => {
      expect(screen.getByTestId(`product-${product}`)).toBeInTheDocument();
      expect(screen.getByTestId(`product-name-${product}`)).toHaveTextContent(product);
      expect(screen.getByTestId(`subscribe-button-${product}`)).toBeInTheDocument();
      expect(screen.getByTestId(`unsubscribe-button-${product}`)).toBeInTheDocument();
    });
  });

  it('disables the subscribe button for already subscribed products', () => {
    render(<Subscribe socket={mockSocket as any} subscriptions={subscriptions} availableProducts={availableProducts} />);

    // The "BTC-USD" product is already subscribed, so the subscribe button should be disabled
    expect(screen.getByTestId('subscribe-button-BTC-USD')).toBeDisabled();

    // Other products like "ETH-USD" should have enabled subscribe buttons
    expect(screen.getByTestId('subscribe-button-ETH-USD')).not.toBeDisabled();
  });

  it('enables the unsubscribe button for subscribed products', () => {
    render(<Subscribe socket={mockSocket as any} subscriptions={subscriptions} availableProducts={availableProducts} />);

    // The "BTC-USD" product is subscribed, so the unsubscribe button should be enabled
    expect(screen.getByTestId('unsubscribe-button-BTC-USD')).not.toBeDisabled();

    // Other products like "ETH-USD" should have disabled unsubscribe buttons
    expect(screen.getByTestId('unsubscribe-button-ETH-USD')).toBeDisabled();
  });

  it('handles subscribing to a product', async () => {
    render(<Subscribe socket={mockSocket as any} subscriptions={subscriptions} availableProducts={availableProducts} />);

    // Click the subscribe button for "ETH-USD"
    fireEvent.click(screen.getByTestId('subscribe-button-ETH-USD'));

    // Expect the socket.emit function to be called with the correct arguments
    await waitFor(() => expect(mockSocket.emit).toHaveBeenCalledWith('subscribe', { productId: 'ETH-USD' }));

    // Check if the "ETH-USD" subscribe button is disabled after subscription
    expect(screen.getByTestId('subscribe-button-ETH-USD')).toBeDisabled();

    // Check if the "ETH-USD" unsubscribe button is enabled after subscription
    expect(screen.getByTestId('unsubscribe-button-ETH-USD')).not.toBeDisabled();
  });

  it('handles unsubscribing from a product', async () => {
    render(<Subscribe socket={mockSocket as any} subscriptions={subscriptions} availableProducts={availableProducts} />);

    // Click the unsubscribe button for "BTC-USD"
    fireEvent.click(screen.getByTestId('unsubscribe-button-BTC-USD'));

    // Expect the socket.emit function to be called with the correct arguments
    await waitFor(() => expect(mockSocket.emit).toHaveBeenCalledWith('unsubscribe', { productId: 'BTC-USD' }));

    // Check if the "BTC-USD" unsubscribe button is disabled after unsubscribing
    expect(screen.getByTestId('unsubscribe-button-BTC-USD')).toBeDisabled();

    // Check if the "BTC-USD" subscribe button is enabled after unsubscribing
    expect(screen.getByTestId('subscribe-button-BTC-USD')).not.toBeDisabled();
  });
});
