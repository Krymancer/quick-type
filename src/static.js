import fs from 'fs';
import path from 'path';
import { URL } from 'url';

export function handleStaticFiles(request, response) {
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
}