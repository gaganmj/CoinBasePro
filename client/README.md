Coinbase WebSocket Trading App
A real-time trading app that connects to Coinbase's WebSocket API, allowing users to subscribe to product feeds, view live price data, and track recent trades. This app provides an interactive user interface built with React and Material UI, alongside a WebSocket server implemented in Node.js.

Features
Subscribe/Unsubscribe to Products: Users can subscribe and unsubscribe to specific trading products (e.g., BTC-USD, ETH-USD).
Real-time Price View: Displays live price updates and order book changes for subscribed products.
Match View: Shows recent match (trade) data, including timestamp, price, size, and side (buy/sell).
System Status: Displays the active channels that the users are subscribed to.
WebSocket Communication: Bidirectional communication with Coinbase WebSocket API.
Installation
Prerequisites
Ensure you have the following installed:

Node.js (v14 or later)
npm (or yarn)
Clone the repository

Install dependencies
Install both backend and frontend dependencies:

Backend (Node.js)
Navigate to the backend directory and install dependencies:


Copy code
cd backend
npm install
Frontend (React)
Navigate to the frontend directory and install dependencies:


Copy code
cd frontend
npm install
Environment Configuration
No additional configuration is needed for this application. It will run on http://localhost:4000 for the backend and http://localhost:3000 for the frontend by default.

Running the App
Start the Backend Server
From the backend directory, run:


Copy code
npm run dev
This will start the server on http://localhost:4000 and establish a WebSocket connection to Coinbase's WebSocket API.

Start the Frontend React App
From the frontend directory, run:


Copy code
npm start
This will start the React app on http://localhost:3000. It will automatically connect to the backend WebSocket server to receive real-time updates.

How It Works
Frontend: The React app handles user interactions, including subscribing and unsubscribing to product feeds. It displays live price and match data in an intuitive interface.

Backend: The Node.js server listens for WebSocket messages from Coinbase's WebSocket API. It manages user subscriptions and broadcasts updates to connected clients in real time.

WebSocket Communication: The backend connects to Coinbase’s WebSocket and listens for two types of updates:

Level 2 Order Book Updates (l2update): Updates the price view for subscribed products.
Match Data: Displays recent trades for the subscribed products.
Subscribing to Products
The available products for subscription are:

BTC-USD
ETH-USD
XRP-USD
LTC-USD
Users can subscribe to these products, which will fetch real-time data for order book changes and trades. If a product is no longer subscribed by any user, the backend automatically unsubscribes from Coinbase's WebSocket.

Components
The app consists of the following main components:

Subscribe: Allows users to subscribe/unsubscribe to products.
PriceView: Displays real-time price updates and order book data.
MatchView: Shows recent match data (trades) for subscribed products.
SystemStatus: Displays the active products (channels) subscribed by all users.
File Structure

coinbase-websocket-app/
│
├── backend/                          # Backend folder containing Express server and WebSocket logic
│   ├── server.ts                     # Express server and WebSocket integration logic
│   └── package.json                  # Backend dependencies and scripts
│
├── frontend/                         # Frontend folder containing React app
│   ├── src/                          # Source code for the React app
│   │   ├── components/               # All reusable React components
│   │   │   ├── MatchView.tsx         # Match data display component
│   │   │   ├── PriceView.tsx         # Price view and order book display component
│   │   │   ├── Subscribe.tsx         # Product subscription and unsubscription component
│   │   │   ├── SystemStatus.tsx      # System status component showing active subscriptions
│   │   │   └── index.tsx             # Main entry file for components in the app
│   │   ├── App.tsx                   # Main App component that ties everything together
│   │   ├── index.tsx                 # React app entry point
│   │   ├── react-app-env.d.ts        # TypeScript environment definitions for React
│   │   ├── setupTests.ts             # Test setup file
│   │   ├── theme.ts                  # Theme customization for Material UI
│   │   └── styles.css                # Global CSS file for styling
│   ├── public/                       # Public folder for static assets like index.html
│   │   ├── index.html                # Main HTML template for the React app
│   │   └── favicon.ico               # Application favicon
│   ├── package.json                  # Frontend dependencies and scripts
│   ├── tsconfig.json                 # TypeScript configuration
│
├── README.md                         # Project description and instructions
├── package.json                      # Root level package.json, contains overall dependencies for both backend and frontend
└── .gitignore                        # Files and directories to ignore for git version control

Contributing
Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your changes.

Code Style
Use Prettier for code formatting
Follow ESLint guidelines for JavaScript/TypeScript
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
Coinbase WebSocket API: For providing real-time trading data.
Socket.io: For WebSocket communication between the frontend and backend.
Material UI: For the UI components.
Styled-components: For styling the React components.
This README includes installation instructions, a brief description of the project, how it works, and details about the file structure. You can modify the repository URL and other project-specific details as needed.