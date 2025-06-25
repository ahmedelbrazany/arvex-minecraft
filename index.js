const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Mock secret key for JWT
const JWT_SECRET = 'your-secret-key';

// Mock user database
const mockUsers = {
  'test@example.com': {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  }
};

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Token generation endpoint
app.post('/api/token', (req, res) => {
  const { email } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const googleToken = authHeader.split(' ')[1];

  // In a real app, you would verify the Google token here
  // For testing, we'll just check if the email exists in our mock database
  if (!mockUsers[email]) {
    return res.status(401).json({ error: 'Invalid user' });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { 
      userId: mockUsers[email].id,
      email: email,
      name: mockUsers[email].name
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Token validation middleware
const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route example
app.get('/api/protected', validateToken, (req, res) => {
  res.json({ 
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

// WebSocket handling
wss.on('connection', (ws, req) => {
  console.log('New client connected');

  // Extract token from URL query parameters
  const url = new URL(req.url, 'http://localhost');
  const token = url.searchParams.get('token');

  if (!token) {
    ws.close(1008, 'No token provided');
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Authenticated user:', decoded.email);

    // Send ready message
    setTimeout(() => {
      ws.send(JSON.stringify({ isReady: true, notGotLogs: false }));
    }, 1000);

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.event === "logs") {
          ws.send(JSON.stringify({
            event: "logs",
            data: [
              { text: "New log entry", date: Date.now() }
            ]
          }));
        } else if (data.event === "code") {
          ws.send(JSON.stringify({
            data: {
              text: `> ${data.data}`,
              date: Date.now()
            }
          }));
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Send periodic updates
    const interval = setInterval(() => {
      ws.send(JSON.stringify({
        data: {
          text: "Server tick...",
          date: Date.now()
        }
      }));
    }, 5000);

    ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(interval);
    });

  } catch (error) {
    console.error('Invalid token:', error);
    ws.close(1008, 'Invalid token');
  }
});

// Serve static files for testing
app.use(express.static(path.join(__dirname, '../public')));

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});