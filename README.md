[[WebSocket Server with Coinbase Integration and JWT Authentication]]
This project is a WebSocket server built with Node.js, Express, and WebSocket. It connects to the Coinbase WebSocket API for real-time cryptocurrency updates and integrates JWT (JSON Web Tokens) authentication for secure access. It allows clients to subscribe to cryptocurrency channels (such as BTC-USD, ETH-USD) to receive live updates for order books and market matches.

Features
Real-time WebSocket Communication: Streams live data from Coinbase (e.g., level2 order book updates and matches for cryptocurrency trades).
JWT Authentication: Protects WebSocket connections and REST API endpoints.
Subscription Management: Allows clients to subscribe and unsubscribe from specific product channels.
System Status: Tracks and broadcasts the subscription status for all active clients.
Technologies Used
Node.js: JavaScript runtime for building the server.
Express.js: Web framework to handle RESTful API routes.
Socket.io: Real-time communication between server and clients via WebSockets.
WebSocket (ws): For connecting to the Coinbase WebSocket API.
JWT (JSON Web Tokens): Secure token-based authentication for users.
bcryptjs: Password hashing and verification for user authentication.
dotenv: Loads environment variables from a .env file.
cors: Handles Cross-Origin Resource Sharing (CORS) for frontend integration.
Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v14 or higher)
npm (Node package manager)
Setup Instructions
1. Clone the repository
Clone the repository to your local machine:
git clone https://github.com/gaganmj/CoinBasePro.git
cd CoinBasePro


The folder structure should be as below:

**coinBasePro
│
├──server                 
│   ├── (link)server.ts 
│   ├── env
│   ├── package.json  
│   └── tsconfig.json    
│
├── client/                         
│   ├── src/                          
│   │   ├── components/    
│   │   ├── Login.tsx 
│   │   │   ├── MatchView.tsx         
│   │   │   ├── PriceView.tsx         
│   │   │   ├── Subscribe.tsx         
│   │   │   ├── SystemStatus.tsx      
│   │   │   └── index.tsx             
│   │   ├── App.tsx                   
│   │   ├── index.tsx                                          
│   │   └── styles.css                
│   ├── public/                       
│   │   ├── index.html                
│   │   └── favicon.ico               
│   ├── package.json                  
│   ├── tsconfig.json                 
│
└──  README.md**                                                      


2. Install dependencies in Server directory(backend)
Run the following command to install the required dependencies:
**npm install typescript @types/node @types/express @types/socket.io @types/ws @types/cors @types/jsonwebtoken @types/bcryptjs --save-dev**
**npm install typescript --save-dev**
**npm install ts-node --save-dev**
**npx tsc**
**node dist/server.js // to start server**

4. Install dependencies in client directory(frontend)
Run the following command to install the required dependencies:
**npm install**
**npm install --save-dev @testing-library/jest-dom@^6.6.3 @testing-library/react@^16.0.1 @testing-library/user-event@^14.5.2 jest@^27.5.1 jest-mock@^29.7.0 react-test-renderer@^18.3.1**
**npm start**

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


