
import fs from 'node:fs';import path from 'node:path';
const D="D:\\Hackthone\\CodeFrontier Hackathon\\data";
const f=p=>path.join(D,p);
export async function put(n,body){fs.mkdirSync(path.dirname(f(n)),{recursive:true});fs.writeFileSync(f(n),body);return{pathname:n}}
export async function list({prefix}){const dir=path.join(D,path.dirname(prefix));if(!fs.existsSync(dir))return{blobs:[]};
 return{blobs:fs.readdirSync(dir).map(x=>path.posix.join(path.dirname(prefix),x)).filter(p=>p.startsWith(prefix)).map(pathname=>({pathname}))}}
export async function get(n){if(!fs.existsSync(f(n)))return null;return{statusCode:200,stream:new Response(fs.readFileSync(f(n))).body}}
export async function del(a){a.forEach(x=>{try{fs.unlinkSync(f(x))}catch(e){}})}
