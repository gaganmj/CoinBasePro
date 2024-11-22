import { render, screen } from '@testing-library/react';
import MatchView from './MatchView';

describe('MatchView Component', () => {
  const sampleMatches = [
    {
      time: '2024-11-22T14:00:00Z',
      product: 'BTC-USD',
      size: '1.5',
      price: '50000',
      side: 'buy',
    },
    {
      time: '2024-11-22T14:01:00Z',
      product: 'ETH-USD',
      size: '2.0',
      price: '3000',
      side: 'sell',
    },
    {
      time: '2024-11-22T14:02:00Z',
      product: 'XRP-USD',
      size: '500',
      price: '1.2',
      side: 'buy',
    },
  ];

  it('renders the MatchView component with heading', () => {
    render(<MatchView matches={sampleMatches} />);
    
    // Check if the MatchView heading is present
    const headingElement = screen.getByTestId('match-view-heading');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('Match View');
  });

  it('renders the correct number of rows in the table', () => {
    render(<MatchView matches={sampleMatches} />);
    
    // Check that the table has 3 rows (one for each match)
    const rows = screen.getAllByTestId(/^match-row-/);
    expect(rows).toHaveLength(3);
  });


  it('renders the MatchView table structure correctly', () => {
    render(<MatchView matches={sampleMatches} />);
    
    // Check if the table headers are rendered correctly
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(5); // 5 headers: Timestamp, Product, Size, Price, Side
    expect(headers[0]).toHaveTextContent('Timestamp');
    expect(headers[1]).toHaveTextContent('Product');
    expect(headers[2]).toHaveTextContent('Size');
    expect(headers[3]).toHaveTextContent('Price');
    expect(headers[4]).toHaveTextContent('Side');
  });
});
