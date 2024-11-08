//const canvas = document.getElementById('canvas');
//const context = canvas.getContext('2d');

const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
  console.log('Connected to server');
  const code = window.location.pathname;
  console
  ws.send(code);
};

ws.onmessage = (event) => {
  console.log(`Message from server: ${event.data}`);
};

ws.onclose = () => {
  console.log('Disconnected from server');
};

context.rect(0, 0, 100, 100);
context.fill();