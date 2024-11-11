import { ERROR, ROOM_LIST } from "./symbols.js";
import { broadcast, sendMessage } from "./websocket.js";

export const rooms = [
  { name: 'test', players: [] }
];

export function broadcastRooms(socket) {
  const list = rooms.map(x => ({ name: x.name, capacity: x.capacity, players: x.players }));

  const message = JSON.stringify({ type: ROOM_LIST, rooms: list });

  console.log(message);

  broadcast(message, socket);
}

export function joinRoom(roomId, socket) {
  let room = rooms.find(r => r.id === roomId);

  if (!room) {
    // Create the room if it doesn't exist
    room = { id: roomId, clients: [] };
    rooms.push(room);
  }

  room.clients.push(socket);
  console.log(`Client joined room: ${roomId}`);
  broadcastToRoom(roomId, `A new user has joined the room ${roomId}`, socket);
}

export function leaveRoom(roomId, socket) {
  const room = rooms.find(r => r.id === roomId);

  if (room) {
    room.clients = room.clients.filter(client => client !== socket);

    // Remove the room from the list if empty
    if (room.clients.length === 0) {
      const roomIndex = rooms.findIndex(r => r.id === roomId);
      rooms.splice(roomIndex, 1);
    }

    console.log(`Client left room: ${roomId}`);
  }
}

export function broadcastToRoom(roomId, message, senderSocket) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  room.clients.forEach(client => {
    if (client !== senderSocket) {
      sendMessage(message, client);
    }
  });
}

export function getRoomByClient(socket) {
  return rooms.find(room => room.clients.includes(socket));
}

export function removeClientFromRooms(socket) {
  rooms.forEach(room => leaveRoom(room.id, socket));
}