const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
  console.log('Connected to server');
  ws.send('Hello, server!');
};

ws.onmessage = (event) => {
  console.log(`Message from server: ${event.data}`);
  displayWord(event.data);
};

ws.onclose = () => {
  console.log('Disconnected from server');
};

function displayWord(word) {
  const wordContainer = document.getElementById('word-container');
  wordContainer.textContent = word;
}

context.rect(0, 0, 100, 100);
context.fill();