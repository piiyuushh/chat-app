const socket = io();
let username = '';

// Handle username submission
document.getElementById('username-submit').addEventListener('click', () => {
    username = document.getElementById('username-input').value;
    if (username) {
        document.getElementById('username-modal').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        socket.emit('user-joined', username);
    }
});

const chat = document.getElementById('chat');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Handle sending messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('chat-message', { username, message });
        appendMessage({ username, message }, 'sender'); // Add message to sender side
        messageInput.value = '';
    }
});

// Append message to chat
function appendMessage(data, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);

    messageElement.innerHTML = `
        <div class="content">
            <div class="username">${data.username}</div>
            <div class="text">${data.message}</div>
        </div>
    `;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

// Display chat messages from other users
socket.on('chat-message', (data) => {
    appendMessage(data, 'receiver'); // Add message to receiver side
});

// Notify when a user joins
socket.on('user-joined', (username) => {
    const joinMessage = document.createElement('div');
    joinMessage.classList.add('text-gray-500', 'text-sm', 'mb-4');
    joinMessage.textContent = `${username} joined the chat`;
    chat.appendChild(joinMessage);
});