import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = resolve(root, process.argv[2] || '.');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function resolveRequest(url) {
  const cleanPath = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const safePath = normalize(cleanPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let target = resolve(publicDir, `.${safePath}`);
  if (!target.startsWith(publicDir + sep) && target !== publicDir) return null;
  return target;
}

createServer(async (req, res) => {
  try {
    let target = resolveRequest(req.url || '/');
    if (!target) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (!existsSync(target) || (await stat(target)).isDirectory()) {
      target = join(publicDir, 'index.html');
    }

    res.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream' });
    createReadStream(target).pipe(res);
  } catch (error) {
    res.writeHead(500);
    res.end(error instanceof Error ? error.message : 'Server error');
  }
}).listen(port, host, () => {
  console.log(`Servidor local em http://${host}:${port}`);
});
