// LAN rooms: one host and one controller. Room data stays in this Node process.
import { randomBytes } from 'node:crypto';
import { networkInterfaces } from 'node:os';
const rooms = new Map();
const id = () => randomBytes(16).toString('hex');
const reply=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
export async function lan(req,res,url){
  if(!url.pathname.startsWith('/lan/'))return false;
  for(const [key,room] of rooms)if(Date.now()-room.updated>120000)rooms.delete(key);
  if(req.method==='GET'&&url.pathname==='/lan/info'){const ips=Object.values(networkInterfaces()).flat().filter(x=>x&&x.family==='IPv4'&&!x.internal).map(x=>x.address);reply(res,200,{ips});return true;}
  if(req.method==='POST'&&url.pathname==='/lan/create'){
    const code=id(),host=id();rooms.set(code,{host,updated:Date.now(),input:{},frame:null,guest:false});reply(res,200,{code,host});return true;
  }
  const parts=url.pathname.split('/'), room=rooms.get(parts[2]);
  if(!room){reply(res,404,{error:'Sala não encontrada ou expirada.'});return true;}
  if(req.method==='GET'&&parts[3]==='state'){room.updated=Date.now();reply(res,200,{frame:room.frame});return true;}
  if(req.method==='GET'&&parts[3]==='input'){
    if(req.headers['x-host-token']!==room.host){reply(res,403,{error:'Acesso negado'});return true;}
    room.updated=Date.now();const connected=room.guest&&Date.now()-(room.lastInput||0)<1500;reply(res,200,{input:connected?room.input:{},guest:connected});return true;
  }
  if(req.method==='POST'&&['input','frame'].includes(parts[3])){
    if(parts[3]==='frame'&&req.headers['x-host-token']!==room.host){reply(res,403,{error:'Acesso negado'});return true;}
    let body='';try{for await(const chunk of req){body+=chunk;if(body.length>400000)throw new Error('too large');}const data=JSON.parse(body);room.updated=Date.now();
      if(parts[3]==='input'){room.guest=true;room.lastInput=Date.now();room.input=Object.fromEntries(['left','right','jump','block','punch','kick','special','uppercut','sweep','cast'].map(k=>[k,data[k]===true]));}
      else if(typeof data.image==='string'&&data.image.startsWith('data:image/jpeg;base64,')&&data.image.length<350000)room.frame=data;
      else throw new Error('invalid');reply(res,200,{ok:true});
    }catch{reply(res,400,{error:'Dados inválidos'});}return true;
  }
  reply(res,404,{error:'Rota desconhecida'});return true;
}
