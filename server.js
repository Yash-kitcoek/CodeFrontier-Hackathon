import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const isVercel = !!(process.env.VERCEL || process.env.NOW_REGION);

if (!isVercel) {
  // Local replacement for @vercel/blob (saves to ./data)
  const dataDir = path.join(root, 'data');
  const f = p => path.join(dataDir, p);
  fs.mkdirSync(dataDir, { recursive: true });

  globalThis.__localBlob = {
    put: async (n, body) => {
      fs.mkdirSync(path.dirname(f(n)), { recursive: true });
      fs.writeFileSync(f(n), body);
      return { pathname: n };
    },
    list: async ({ prefix }) => {
      const dir = path.join(dataDir, path.dirname(prefix));
      if (!fs.existsSync(dir)) return { blobs: [] };
      return {
        blobs: fs.readdirSync(dir)
          .map(x => path.posix.join(path.dirname(prefix), x))
          .filter(p => p.startsWith(prefix))
          .map(pathname => ({ pathname }))
      };
    },
    get: async (n) => {
      if (!fs.existsSync(f(n))) return null;
      return { statusCode: 200, stream: new Response(fs.readFileSync(f(n))).body };
    },
    del: async (a) => {
      a.forEach(x => { try { fs.unlinkSync(f(x)); } catch (e) {} });
    }
  };
}

// Directly import the API handler
const { default: apiHandler } = await import('./api/app.js');

const serverHandler = (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/app') {
    let raw = '';
    req.on('data', c => (raw += c));
    req.on('end', async () => {
      try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
      res.status = c => { res.statusCode = c; return res; };
      res.json = j => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(j)); };
      await apiHandler(req, res);
    });
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(path.join(root, 'index.html')));
};

const server = http.createServer(serverHandler);

if (!isVercel) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log('TURBOMINDS running at http://localhost:' + port));
}

export default server;
