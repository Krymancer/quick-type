import crypto from 'crypto';

// See: https://www.rfc-editor.org/rfc/rfc6455

export const clients = [];

/**
 * 
 * @param {*} buffer 
 * @returns 
 */
export function decode(buffer) {
  const secondByte = buffer[1];
  const length = secondByte & 127;
  let offset = 2;
  if (length === 126) {
    offset += 2;
  } else if (length === 127) {
    offset += 8;
  }
  const maskingKey = buffer.slice(offset, offset + 4);
  offset += 4;

  const decoded = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    decoded[i] = buffer[offset + i] ^ maskingKey[i % 4];
  }

  return decoded.toString();
}

export function encode(message) {
  const messageBuffer = Buffer.from(message);
  const length = messageBuffer.length;
  const frame = [0x81];

  if (length < 126) frame.push(length);
  else if (length < 65536) frame.push(126, length >> 8, length & 255);
  else frame.push(127, 0, 0, 0, 0, (length >> 24) & 255, (length >> 16) & 255, (length >> 8) & 255, length & 255);

  return Buffer.concat([Buffer.from(frame), messageBuffer]);
}

export function broadcast(message, socket) {
  console.log('broadcast', { message, socket, clients })
  clients.forEach((client) => {
    if (client !== socket && client.readyState === client.OPEN) {
      sendMessage(message, client);
    }
  });
}

export function sendMessage(message, client) {
  client.send(encode(message));
}

export function generateAcceptValue(acceptKey) {
  // Websocket GUID: https://www.rfc-editor.org/rfc/rfc6455#section-1.3
  const guid = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return crypto
    .createHash('sha1')
    .update(acceptKey + guid)
    .digest('base64');
}