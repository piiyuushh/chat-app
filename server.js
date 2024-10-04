const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Serve the index.html file
app.use(express.static('public'));

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    const userId = uuidv4();  // Generate a unique ID for each client
    console.log(`New client connected with ID: ${userId}`);

    // Send a message back to the client with its unique ID
    ws.send(JSON.stringify({ type: 'id', id: userId }));

    // Broadcast message to all clients
    ws.on('message', (message) => {
        try {
            const messageObj = JSON.parse(message);  // Parse incoming message
            console.log(`Received message: ${messageObj.text}`);

            // Broadcast the message to all clients with sender's ID
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'message', senderId: userId, text: messageObj.text }));
                }
            });
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Client with ID: ${userId} disconnected`);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});