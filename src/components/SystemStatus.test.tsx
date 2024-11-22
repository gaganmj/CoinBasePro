import { render, screen } from '@testing-library/react';
import SystemStatus from './SystemStatus';

describe('SystemStatus Component', () => {
  it('renders the component correctly', () => {
    // Render the component with an empty channels array
    render(<SystemStatus channels={[]} />);

    // Check if the "System Status" heading is in the document
    expect(screen.getByText('System Status')).toBeInTheDocument();

    // Check if the channel list exists
    expect(screen.getByTestId('system-status')).toBeInTheDocument();

    // Ensure the list is empty when no channels are provided
    expect(screen.queryByRole('list')).toBeEmptyDOMElement();
  });

  it('displays a list of channels correctly', () => {
    // Example channels array
    const channels = ['Channel 1', 'Channel 2', 'Channel 3'];

    // Render the component with the provided channels
    render(<SystemStatus channels={channels} />);

    // Check if the "System Status" heading is in the document
    expect(screen.getByText('System Status')).toBeInTheDocument();

    // Verify that each channel is listed
    channels.forEach((channel, index) => {
      expect(screen.getByTestId(`channel-${index}`)).toHaveTextContent(channel);
    });
  });

  it('renders no channels when the channels array is empty', () => {
    // Render the component with an empty channels array
    render(<SystemStatus channels={[]} />);

    // Check if there are no channels displayed
    const channelList = screen.queryAllByTestId(/channel-/);
    expect(channelList).toHaveLength(0); // No channel list items
  });

  it('renders the correct number of channels', () => {
    const channels = ['Channel A', 'Channel B', 'Channel C', 'Channel D'];

    // Render the component with the provided channels
    render(<SystemStatus channels={channels} />);

    // Verify that the number of list items matches the number of channels
    const channelListItems = screen.queryAllByTestId(/^channel-/);
    expect(channelListItems).toHaveLength(channels.length); // Should match the number of channels
  });
});
