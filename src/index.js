import http from "http";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';

import { handleStaticFiles } from "./static.js";
import { decode, encode, generateAcceptValue, clients } from './websocket.js';
import { broadcastRooms, getRoomByClient, rooms } from "./room.js";

const PORT = 3000;
const words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew"];

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

  console.log('connection')

  clients.push(socket);

  // Send initial room list to the new client
  broadcastRooms(socket);

  socket.on('data', (buffer) => {
    const message = decode(buffer);
    if (message) {
      console.log(`Received message: ${message}`);

      // Parse the message to determine the room command
      const [command, roomId] = message.split(' ');

      if (command === 'join') {
        joinRoom(roomId, socket);
        broadcastRooms(); // Update all clients with the latest room list
      } else if (command === 'leave') {
        leaveRoom(roomId, socket);
        broadcastRooms(); // Update all clients with the latest room list
      } else {
        // Broadcast within the room only
        const clientRoom = getRoomByClient(socket);
        if (clientRoom) {
          broadcastToRoom(clientRoom.id, message, socket);
        }
      }
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    removeClientFromRooms(socket);
    broadcastRooms(); // Update all clients with the latest room list after a disconnect
  });
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));