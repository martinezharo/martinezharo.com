import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const root = new URL('../../dist/', import.meta.url);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function extension(pathname) {
  const dot = pathname.lastIndexOf('.');
  return dot === -1 ? '' : pathname.slice(dot);
}

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const targetPath = pathname === '/' ? '/index.html' : pathname;
  const file = new URL(`.${targetPath}`, root);

  if (!file.href.startsWith(root.href)) {
    response.writeHead(403).end();
    return;
  }

  try {
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': types[extension(targetPath)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});

server.listen(4399, '127.0.0.1');

process.once('SIGTERM', () => server.close());
process.once('SIGINT', () => server.close());
