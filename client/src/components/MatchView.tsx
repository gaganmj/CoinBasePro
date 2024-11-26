import React from 'react';
import styled from 'styled-components';

interface Match {
  time: string;
  product: string;
  size: string;
  price: string;
  side: string;
}

interface Props {
  matches: Match[];
}

const MatchView: React.FC<Props> = ({ matches }) => {
  return (
    <MatchContainer data-testid="match-view-container">
      <h2 data-testid="match-view-heading">Match View</h2>
      <StyledTable data-testid="match-view-table">
        <thead>
          <tr>
            <TableHeader>Timestamp</TableHeader>
            <TableHeader>Product</TableHeader>
            <TableHeader>Size</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Side</TableHeader>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index} data-testid={`match-row-${index}`}>
              <TableCell>{new Date(match.time).toLocaleTimeString()}</TableCell>
              <TableCell>{match.product}</TableCell>
              <TableCell>{match.size}</TableCell>
              <TableCell>{match.price}</TableCell>
              <TableCell style={{ color: match.side === 'buy' ? 'green' : 'red' }}>
                {match.side === 'buy' ? 'Buy' : 'Sell'}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </MatchContainer>
  );
};

const MatchContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: Arial, sans-serif;

  th, td {
    padding: 12px;
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: #f1f1f1;
  }

  tr:nth-child(odd) {
    background-color: #ffffff;
  }

  tr:hover {
    background-color: #e9ecef;
  }
`;

const TableHeader = styled.th`
  background-color: #007bff;
  color: white;
  font-weight: bold;
  text-align: center;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  text-align: left;
`;

export default MatchView;
