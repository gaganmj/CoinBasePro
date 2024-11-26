import React, { useEffect, useState } from 'react';

interface PriceData {
  [productId: string]: [string, string, string][]; // Each productId has an array of [side, price, size]
}

interface Props {
  priceData: PriceData;
}

const PriceView: React.FC<Props> = ({ priceData }) => {
  const [displayData, setDisplayData] = useState<PriceData>(priceData);

  useEffect(() => {
    const interval = setInterval(() => {
      if (JSON.stringify(priceData) !== JSON.stringify(displayData)) {
        setDisplayData({ ...priceData });
      }
    }, 50);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [priceData, displayData]);

  const sortOrderBook = (orderBook: [string, string, string][]) => {
    return orderBook.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])); // Sort by price descending (for bids) or ascending (for asks)
  };

  return (
    <div data-testid="price-view-container">
      <h2>Price View</h2>
      {Object.keys(displayData).map((productId) => {
        const orderBook = displayData[productId];
        const sortedOrderBook = sortOrderBook(orderBook);

        return (
          <div key={productId} data-testid={`product-${productId}`}>
            <h3>{productId}</h3>

            {/* Bids Section */}
            <div data-testid={`bids-${productId}`}>
              <h4>Bids</h4>
              {sortedOrderBook.filter(([side]) => side === 'buy').length > 0 ? (
                <ul>
                  {sortedOrderBook
                    .filter(([side]) => side === 'buy')
                    .map(([side, price, size], idx) => (
                      <li key={idx} data-testid={`bid-${productId}-${idx}`}>
                        {side} - Price: {price}, Size: {size}
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No bids available</p>
              )}
            </div>

            {/* Asks Section */}
            <div data-testid={`asks-${productId}`}>
              <h4>Asks</h4>
              {sortedOrderBook.filter(([side]) => side === 'sell').length > 0 ? (
                <ul>
                  {sortedOrderBook
                    .filter(([side]) => side === 'sell')
                    .map(([side, price, size], idx) => (
                      <li key={idx} data-testid={`ask-${productId}-${idx}`}>
                        {side} - Price: {price}, Size: {size}
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No asks available</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceView;
