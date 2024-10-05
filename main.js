const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = {};

io.on('connection', (socket) => {
    // Handle user joining with a username
    socket.on('user-joined', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    });

    // Handle sending of messages
    socket.on('chat-message', (data) => {
        io.emit('chat-message', {
            username: users[socket.id], // Attach the username
            message: data.message
        });
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            socket.broadcast.emit('user-joined', `${username} left the chat`);
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});