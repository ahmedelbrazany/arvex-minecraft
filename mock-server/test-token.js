const axios = require('axios');

async function testTokenFlow() {
  try {
    // Step 1: Get a token using Google auth
    console.log('Step 1: Getting token...');
    const tokenResponse = await axios.post('http://localhost:4000/api/token', 
      { email: 'test@example.com' },
      {
        headers: {
          'Authorization': 'Bearer google-token-123', // This is a mock Google token
          'Content-Type': 'application/json'
        }
      }
    );
    
    const { token } = tokenResponse.data;
    console.log('Token received:', token);

    // Step 2: Test protected route with token
    console.log('\nStep 2: Testing protected route...');
    const protectedResponse = await axios.get('http://localhost:4000/api/protected', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Protected route response:', protectedResponse.data);

    // Step 3: Test WebSocket connection with token
    console.log('\nStep 3: Testing WebSocket connection...');
    const WebSocket = require('ws');
    const ws = new WebSocket(`ws://localhost:4000?token=${token}`);

    ws.on('open', () => {
      console.log('WebSocket connected');
      // Request logs
      ws.send(JSON.stringify({ event: 'logs', data: {} }));
    });

    ws.on('message', (data) => {
      console.log('WebSocket message:', data.toString());
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
      console.log('WebSocket closed');
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testTokenFlow(); 