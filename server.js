// Local server: runs the app with NO Vercel account. Data is saved in ./data
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, 'data');
const tmpDir = path.join(root, '.local');
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

// Local replacement for @vercel/blob (same functions, files on disk)
fs.writeFileSync(path.join(tmpDir, 'blob.mjs'), `
import fs from 'node:fs';import path from 'node:path';
const D=${JSON.stringify(dataDir)};
const f=p=>path.join(D,p);
export async function put(n,body){fs.mkdirSync(path.dirname(f(n)),{recursive:true});fs.writeFileSync(f(n),body);return{pathname:n}}
export async function list({prefix}){const dir=path.join(D,path.dirname(prefix));if(!fs.existsSync(dir))return{blobs:[]};
 return{blobs:fs.readdirSync(dir).map(x=>path.posix.join(path.dirname(prefix),x)).filter(p=>p.startsWith(prefix)).map(pathname=>({pathname}))}}
export async function get(n){if(!fs.existsSync(f(n)))return null;return{statusCode:200,stream:new Response(fs.readFileSync(f(n))).body}}
export async function del(a){a.forEach(x=>{try{fs.unlinkSync(f(x))}catch(e){}})}
`);
const src = fs.readFileSync(path.join(root, 'api', 'app.js'), 'utf8')
  .replace("from '@vercel/blob'", "from './blob.mjs'");
fs.writeFileSync(path.join(tmpDir, 'app.mjs'), src);
const handler = (await import(pathToFileURL(path.join(tmpDir, 'app.mjs')).href)).default;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/app') {
    let raw = '';
    req.on('data', c => (raw += c));
    req.on('end', async () => {
      try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
      res.status = c => { res.statusCode = c; return res; };
      res.json = j => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(j)); };
      await handler(req, res);
    });
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(path.join(root, 'index.html')));
});
const port = process.env.PORT || 3000;
server.listen(port, () => console.log('TURBOMINDS running at http://localhost:' + port));
