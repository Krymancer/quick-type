const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
  console.log('Connected to the WebSocket server');
  displayMessage('Connected to the server');
};

ws.onmessage = (event) => {
  console.log(`Message from server: ${event.data}`);
  const data = JSON.parse(event.data);

  if (data.type === "message") {
    displayMessage(`Server: ${data.message}`);
  }

  if (data.type === "room_list") {
    const roomList = document.getElementById("room-list");

    roomList.textContent = "";

    data.rooms.map(room => {
      const card = makeRoomCard(room);
      roomList.appendChild(card);
    });
  }
};

ws.onclose = () => {
  console.log('Disconnected from the WebSocket server');
  displayMessage('Disconnected from the server');
};

function displayMessage(message) {
  const messagesDiv = document.getElementById('log');
  const messageElem = document.createElement('p');
  messageElem.textContent = message;
  messagesDiv.appendChild(messageElem);
}

function createRoom() {
  ws.send(JSON.stringify({ type: "create_room" }));
}

function makeRoomCard(room) {
  const { name, capacity, players } = room;
  const indicator = `${players.length}/${capacity}`;

  const card = document.createElement('div');
  card.classList = "p-2 rounded-md flex gap-2 border-1 bg-blue-400";

  const nameElement = document.createElement('div');
  nameElement.textContent = name;

  const indicatorElement = document.createElement('div');
  indicatorElement.textContent = indicator;

  card.appendChild(nameElement);
  card.appendChild(indicatorElement);

  return card;
}