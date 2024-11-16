import type { ServerWebSocket } from 'bun'
import { Hono } from 'hono'
import { serveStatic, createBunWebSocket } from 'hono/bun'

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

app.use('/*', serveStatic({ root: './static' }));

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage: (event, ws) => {
        console.log(`Message from client: ${event.data}`);
        ws.send('Hello from server!');
      },
      onOpen: () => {
        console.log('Connection opened');
      },
      onClose: () => {
        console.log('Connection closed');
      },
      onError: () => {
        console.log('Error');
      }
    }
  })
)

export default {
  fetch: app.fetch,
  websocket
};
