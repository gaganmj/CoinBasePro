import React from 'react';

interface Props {
  channels: string[];
}

const SystemStatus: React.FC<Props> = ({ channels }) => {
  return (
    <div data-testid="system-status"> {/* Added data-testid here */}
      <h2>System Status</h2>
      <ul>
        {channels.map((channel, index) => (
          <li key={index} data-testid={`channel-${index}`}>{channel}</li>
        ))}
      </ul>
    </div>
  );
};

export default SystemStatus;
