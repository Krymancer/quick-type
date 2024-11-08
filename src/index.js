import http from "http";
import crypto from "crypto";

import { decode, encode, generateAcceptValue } from './websocket.js';
import { handleStaticFiles } from "./static.js";

const PORT = 3000;
const clients = [];
const words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew"];
const rooms = [];

const server = http.createServer((request, response) => {
  let filePath = path.join(process.cwd(), 'public', request.url === '/' ? 'index.html' : request.url);
  let contentType = 'text/html';

  const extname = path.extname(filePath);

  if (!path.extname(filePath)) {
    filePath = path.join(process.cwd(), 'public', 'room.html');
  }

  switch (extname) {
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      response.writeHead(404);
      response.end('404 Not Found');
    } else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content);
    }
  });
});

server.on('upgrade', (request, socket, head) => {
  if (request.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request\r\n');
    return;
  }

  const acceptKey = request.headers['sec-websocket-key'];
  const acceptValue = generateAcceptValue(acceptKey);
  const responseHeaders = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptValue}`,
  ];
  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

  clients.push(socket);

  socket.on('data', (buffer) => {
    const message = decode(buffer);
    if (message) {
      console.log(`Received message: ${message}`);
      broadcast(message, socket);
    }
  });

  socket.on('end', () => console.log('Client disconnected'));
});


function broadcast(message, senderSocket) {
  clients.forEach((client) => {
    if (client !== senderSocket && client.readyState === client.OPEN) {
      client.send(encode(message));
    }
  });
}

function sendRandomWord() {
  const word = words[Math.floor(Math.random() * words.length)];
  clients.forEach((client) => {
    client.write(encode(word));
  });
}

setInterval(sendRandomWord, 3000);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));