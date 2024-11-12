import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { randomUUID } from "crypto";

import { handleStaticFiles } from "./static.js";

const PORT = 3000;

const server = http.createServer(handleStaticFiles);

const wss = new WebSocketServer({ server });

const rooms = [{ id: randomUUID(), name: "room-1234", players: [], capacity: 5 }];

function broadcast(message, sender = null) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastRooms() {
  const message = JSON.stringify({ type: "room_list", rooms });
  broadcast(message);
}

function createRoom() {
  const id = randomUUID();
  const name = `room-${id.substring(id.length - 4)}`
  rooms.push({ id, name, capacity: 5, players: [] });

  broadcastRooms();
}


wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.send(JSON.stringify({ type: "message", message: "Welcome to the server!" }));

  ws.send(JSON.stringify({ type: "room_list", rooms }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === "create_room") {
      createRoom();
    }

    console.log(`Received message from client: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));