import type { ServerWebSocket } from 'bun';
import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';

import crypto, { type UUID } from 'crypto';

type Room = {
  id: string,
  name: string,
  capacity: number,
  players: any[],
};

const rooms: Room[] = [];
const clients: any[] = [];

function broadCastRooms() {
  clients.forEach(ws => ws.send(JSON.stringify({ type: 'room_list', rooms })));
}

function playGame(room: Room) {
  const words = [
    {
      word: 'apple',
      status: false,
    },
    {
      word: 'grape',
      status: false,
    },
    {
      word: 'watermelon',
      status: false,
    }
  ];

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
          const id = crypto.randomUUID();
          const name = `Room-${id.substring(id.length - 6)}`;
          rooms.push({
            id,
            name,
            capacity: 5,
            players: [],
          });

          broadCastRooms();
        } else if (payload.type === 'join_room') {
          const [room] = rooms.filter(x => x.id === payload.roomId);

          if (room) {
            room.players.push(ws);
            ws.send(JSON.stringify({ type: 'join_room_sucess', room }))
          } else {
            ws.send(JSON.stringify({ type: 'join_room_error', message: 'Room not found' }));
          }
        } else if (payload.type === 'leave_room') {
          const roomId = payload.roomId;
          const room = rooms.find(r => r.id === roomId);
          if (room) {
            room.players = room.players.filter(player => player != ws);
            if (room.players.length === 0) {
              rooms.map(r => r.id !== roomId);
            }
            ws.send(JSON.stringify({ type: 'leave_room_success' }));
          } else {
            ws.send(JSON.stringify({ type: 'leave_room_error', message: 'Room not found' }));
          }
        }
      },
      onOpen: (event, ws) => {
        console.log('Connection opened');
        clients.push(ws);
        ws.send(JSON.stringify({ type: 'room_list', rooms }));
      },
      onClose: (event, ws) => {
        rooms.map(room => {
          room.players = room.players.filter(player => player != ws);
          return room.players.length > 0;
        });
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
