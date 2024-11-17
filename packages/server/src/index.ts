import type { ServerWebSocket } from 'bun';
import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';

type Room = {
  id: string,
  name: string,
  capacity: number,
  players: any[],
};

const rooms: Room[] = [
  { id: '123', name: 'room', capacity: 10, players: [] }
];

const clients: any[] = [];

function broadCastRooms() {
  clients.forEach(ws => ws.send(JSON.stringify({ type: 'room_list', rooms })));
}


const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

app.get('/', c => c.text('test'));

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage: (event, ws) => {
        console.log(`Message from client: ${event.data}`);
        const payload = JSON.parse(event.data.toString());
        if (payload.type === "create_room") {
          rooms.push({
            id: rooms[rooms.length - 1].id + 1,
            name: "room",
            capacity: 5,
            players: [],
          });

          broadCastRooms();
        }
      },
      onOpen: (event, ws) => {
        clients.push(ws);
        console.log('Connection opened');
        ws.send(JSON.stringify({ type: 'room_list', rooms }));
      },
      onClose: () => {
        console.log('Connection closed');
      },
      onError: () => {
        console.log('Error');
      }
    }
  })
);

export default {
  fetch: app.fetch,
  websocket
};
