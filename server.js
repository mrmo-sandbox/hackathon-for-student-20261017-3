import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const routes = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/deadlines.js', ['deadlines.js', 'text/javascript; charset=utf-8']],
]);

export function createAppServer() {
  return createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const route = routes.get(pathname);
    if (!route) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    try {
      const content = await readFile(new URL(`./public/${route[0]}`, import.meta.url));
      response.writeHead(200, {
        'Content-Type': route[1],
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      response.writeHead(500);
      response.end('Unable to load file');
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createAppServer();
  server.on('error', (error) => {
    console.error(`起動できません: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(3000, '0.0.0.0', () => {
    console.log('課題の締切: http://localhost:3000');
  });
}