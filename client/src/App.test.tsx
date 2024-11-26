import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the Coinbase App heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Coinbase App/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the Subscribe component', () => {
    render(<App />);
    const productElement = screen.getByText(/Subscribe to Products/i); // Example product from available list
    expect(productElement).toBeInTheDocument();
  });

  it('renders the PriceView component', () => {
    render(<App />);
    const priceViewHeading = screen.getByText(/Price View/i);  // Adjust based on the text rendered in the PriceView component
    expect(priceViewHeading).toBeInTheDocument();
  });

  it('renders the MatchView component', () => {
    render(<App />);
    const matchViewHeading = screen.getByText(/Match View/i); // Example text in MatchView component
    expect(matchViewHeading).toBeInTheDocument();
  });

  it('renders the SystemStatus component', () => {
    render(<App />);
    const systemStatusHeading = screen.getByText(/System Status/i); // This is the text or heading you'd expect in the SystemStatus component
    expect(systemStatusHeading).toBeInTheDocument();
  });
});
