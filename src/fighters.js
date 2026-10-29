export const fighters = [
  { id:'caio', name:'Caio Silva', style:'Muay Thai', tag:'O disciplinado', origin:'São Paulo, SP', quote:'Disciplina é liberdade.', special:'Joelhada térmica', color:'#f1d83b', pants:'#194a94', skin:'#bd8254', hair:'#191c19', accent:'#2965c2', bg:'#485b3c', power:7, speed:8, defense:7, kind:'tank', effect:'#f9d34c' },
  { id:'livia', name:'Lívia Costa', style:'Capoeira', tag:'A ginga da Bahia', origin:'Salvador, BA', quote:'Arte, luta, liberdade.', special:'Giro de capoeira', color:'#18854f', pants:'#eee9d2', skin:'#9b5e35', hair:'#261c19', accent:'#f6ce36', bg:'#526040', power:6, speed:10, defense:6, kind:'crop', effect:'#9fec63' },
  { id:'teimoso', name:'Zé Teimoso', style:'Capoeira urbana', tag:'Cria do asfalto', origin:'Rio de Janeiro, RJ', quote:'Se é na rua, é na raça!', special:'Movimento de rua', color:'#263c2b', pants:'#202c28', skin:'#ac7447', hair:'#151b18', accent:'#f2d33e', bg:'#415b50', power:7, speed:9, defense:6, kind:'jacket', effect:'#e6ee69' },
  { id:'iara', name:'Iara do Axé', style:'Dança e luta livre', tag:'A força do axé', origin:'Salvador, BA', quote:'Meu corpo dança, minha luta é o som.', special:'Ondas de fúria', color:'#eee7cc', pants:'#178f87', skin:'#a5673e', hair:'#26221c', accent:'#e7bb35', bg:'#24585a', power:8, speed:8, defense:5, kind:'iara', effect:'#4ce5e1' },
  { id:'thiago', name:'Thiago “Zé”', style:'Street fight', tag:'O corre é forte', origin:'Fortaleza, CE', quote:'Aqui o corre é mais forte!', special:'Choque técnico', color:'#e9e8db', pants:'#252b2c', skin:'#c59160', hair:'#e3c559', accent:'#edce3a', bg:'#585b46', power:8, speed:7, defense:7, kind:'shirt', effect:'#f4d741' },
  { id:'pilintra', name:'Zé Pilantra', style:'Malandragem', tag:'O rei da ginga', origin:'Lapa, Rio de Janeiro', quote:'No jogo da vida, quem pensa leva vantagem.', special:'Cartola giratória', color:'#e7e5dc', pants:'#d6d6ce', skin:'#966847', hair:'#c2bfb2', accent:'#d63f3e', bg:'#434d55', power:7, speed:7, defense:9, kind:'suit', effect:'#ff6664' },
  { id:'bruno', name:'Bruno Santos', style:'Força bruta', tag:'A muralha', origin:'Manaus, AM', quote:'Respeito se ganha com atitude.', special:'Só força', color:'#252e29', pants:'#52643c', skin:'#bb8659', hair:'#25251e', accent:'#478e51', bg:'#354d3e', power:10, speed:4, defense:10, kind:'brute', effect:'#8ee681' },
  { id:'taxad', name:'Taxad', style:'Combate fiscal', tag:'O herói da fiscalização', origin:'Brasília, DF', quote:'Se tem que ser justo, vai ter imposto.', special:'Golpe do imposto', color:'#c52d32', pants:'#a6242c', skin:'#c18b69', hair:'#343733', accent:'#f3cc46', bg:'#663f3b', power:9, speed:5, defense:8, kind:'hero', effect:'#ff6550' },
];

// Original move sets. Both techniques are available through shortcuts and motions.
const firstSpecials = [
  {name:'Joelhada térmica',type:'rising',reach:165,damage:27,advance:280,duration:.65,lift:-280},
  {name:'Giro de capoeira',type:'spin',reach:240,damage:23,advance:110,duration:.72},
  {name:'Movimento de rua',type:'rush',reach:195,damage:25,advance:260,duration:.62},
  {name:'Ondas de fúria',type:'wave',reach:310,damage:22,advance:50,duration:.76},
  {name:'Choque técnico',type:'electric',reach:220,damage:26,advance:230,duration:.64},
  {name:'Cartola giratória',type:'hat',reach:285,damage:24,advance:80,duration:.74},
  {name:'Só força',type:'armor',reach:150,damage:34,advance:150,duration:.8,armor:true},
  {name:'Golpe do imposto',type:'charge',reach:260,damage:28,advance:190,duration:.7},
];
const secondSpecials = [
  {name:'Cotovelada solar',type:'rising',reach:125,damage:24,advance:80,duration:.72,lift:-520,vertical:250},
  {name:'Rasteira do berimbau',type:'slide',reach:195,damage:22,advance:380,duration:.7,level:'low'},
  {name:'Rajada do asfalto',type:'projectile',reach:0,damage:20,advance:0,duration:.64,speed:620,size:22},
  {name:'Maré de axé',type:'projectile',reach:0,damage:23,advance:0,duration:.78,speed:370,size:38},
  {name:'Curto-circuito',type:'rush',reach:175,damage:25,advance:590,duration:.62},
  {name:'Passo da malandragem',type:'throw',reach:100,damage:29,advance:250,duration:.7},
  {name:'Abalo amazônico',type:'groundWave',reach:0,damage:29,advance:0,duration:.92,speed:330,size:34,level:'low'},
  {name:'Malha fina',type:'projectile',reach:0,damage:13,advance:0,duration:.86,speed:510,size:23,shots:2},
];
export const specialStyles = firstSpecials;
export const normalActions = ['punch','kick','strongPunch','strongKick','uppercut','sweep'];
export const specialActions = ['special','special2'];
export const actionButtons = [...normalActions,...specialActions,'cast','grab','dodge','max'];
export const normalStyles = {
  punch:{duration:.28,startup:.06,recovery:.08,reach:122,damage:5,knock:13,height:150,stun:.25,rank:1},
  kick:{duration:.34,startup:.09,recovery:.1,reach:151,damage:6,knock:20,height:115,stun:.26,rank:1},
  strongPunch:{duration:.46,startup:.13,recovery:.17,reach:140,damage:10,knock:30,height:155,stun:.36,rank:2},
  strongKick:{duration:.53,startup:.17,recovery:.18,reach:185,damage:13,knock:42,height:140,stun:.38,rank:2},
  uppercut:{duration:.48,startup:.1,recovery:.12,reach:110,damage:12,knock:35,height:165,stun:.34,rank:2,vertical:210},
  sweep:{duration:.44,startup:.09,recovery:.1,reach:155,damage:9,knock:30,height:65,stun:.3,rank:2,level:'low',down:true},
};
fighters.forEach((fighter,i)=>{
  fighter.specials=[firstSpecials[i],secondSpecials[i]];
  fighter.special=firstSpecials[i].name;
  fighter.special2=secondSpecials[i].name;
});
export function specialFor(f,kind=f.action){return f.data.specials[kind==='special2'?1:0];}
export function createTeam(indices) {
  if(indices.length!==3 || new Set(indices).size!==3 || indices.some(i=>!Number.isInteger(i)||!fighters[i])) throw new Error('Selecione três lutadores diferentes.');
  return {roster:[...indices],active:0};
}
export function advanceTeam(team) {team.active++;return team.active<team.roster.length;}
export function teamDefeated(team) {return team.active>=team.roster.length;}
export function canEvade(f) {return (f.action==='dodge' && f.actionTime>.12) || (f.action==='backdash' && f.actionTime>.18);}
export const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
export function createCombatant(index,x,facing) {
  return {data:fighters[index],index,x,y:0,vx:0,vy:0,facing,hp:100,energy:0,action:'idle',actionTime:0,actionDuration:0,cooldown:0,stun:0,blockStun:0,
    attackId:0,hitTargets:new Set(),wins:0,combo:0,comboTimer:0,walk:0,blocking:false,guardLow:false,guard:100,crouching:false,
    confirmed:false,knockedDown:false,dodgeCooldown:0,maxTime:0,stance:'stand',running:false,inputTime:0,motion:[],lastDirection:5,
    lastForward:-10,lastBack:-10,lastDown:-10,jumpAge:0,jumpType:'normal',jumpHeld:false,pendingShots:[],armor:0,hitConnected:false};
}
export function normalFor(f,kind=f.action,stance=f.stance){
  const spec=normalStyles[kind];if(!spec)return null;
  const speedOffset=(8-f.data.speed)*.003;
  const result={...spec,duration:spec.duration+speedOffset,damage:spec.damage+f.data.power*(spec.rank===1?.45:.6),level:spec.level||'mid'};
  if(stance==='crouch'){
    result.height=kind.includes('Kick')||kind==='kick'||kind==='sweep'?55:90;
    result.reach*=.92;
    if(['kick','strongKick','sweep'].includes(kind))result.level='low';
    if(kind==='strongKick')result.down=true;
  }else if(stance==='air'){
    result.level='high';result.height=100;result.reach*=.9;result.damage*=1.05;result.recovery=.06;
  }
  return result;
}
export function activateMax(f){
  if(f.hp<=0||f.energy<50||f.maxTime>0||f.stun>0||f.knockedDown||f.y!==0||f.blocking)return false;
  if(f.actionTime>0 && !f.confirmed)return false;
  f.energy-=50;f.maxTime=8;return true;
}
export function attack(f,kind) {
  if(kind==='cast')kind='special2';
  if(kind==='max')return activateMax(f);
  const special=specialActions.includes(kind),normal=normalActions.includes(kind);
  const guardCancel=f.blockStun>0&&['dodge','guardCounter'].includes(kind)&&f.energy>=50;
  const normalCancel=normal&&f.confirmed&&normalActions.includes(f.action)&&normalStyles[kind].rank>normalStyles[f.action].rank;
  const specialCancel=special&&f.confirmed&&(normalActions.includes(f.action)||(f.maxTime>0&&specialActions.includes(f.action)&&f.action!==kind));
  const cancel=normalCancel||specialCancel||guardCancel;
  if(!normal&&!special&&!['grab','dodge','guardCounter'].includes(kind))return false;
  if(f.hp<=0||f.knockedDown||(!guardCancel&&(f.stun>0||f.blocking))||(!cancel&&(f.cooldown>0||f.actionTime>0)))return false;
  if((['grab','dodge','guardCounter','uppercut','sweep'].includes(kind)||(special&&!(specialCancel&&f.maxTime>0)))&&f.y!==0)return false;
  if(kind==='dodge'&&f.dodgeCooldown>0&&!guardCancel)return false;
  if(kind==='guardCounter'&&!guardCancel)return false;
  const cost=guardCancel?50:special?(f.maxTime>0?25:50):0;
  if(f.energy<cost)return false;
  f.energy-=cost;f.cancelled=cancel;f.confirmed=false;f.hitConnected=false;f.stun=0;f.blockStun=0;f.blocking=false;
  f.stance=kind==='uppercut'?'stand':f.y<0?'air':f.crouching?'crouch':'stand';
  const spec=special?specialFor(f,kind):normalFor(f,kind,f.stance);
  f.action=kind;f.actionDuration=spec?.duration||({grab:.5,dodge:.42,guardCounter:.5}[kind]);f.actionTime=f.actionDuration;
  f.cooldown=f.actionDuration+.05;f.attackId++;f.hitTargets.clear();f.armor=special&&spec.armor?1:0;
  f.attackFacing=f.facing;f.powered=f.maxTime>0;f.pendingShots=[];
  if(kind==='uppercut'){f.vy=-340;f.y=-1;f.jumpHeld=false;}
  if(kind==='dodge'){f.dodgeCooldown=1;f.dodgeFacing=f.facing;f.guardCancel=guardCancel;}
  if(special){
    if(spec.lift){f.vy=spec.lift;f.y=-1;}
    if(['projectile','groundWave'].includes(spec.type))f.pendingShots=Array.from({length:spec.shots||1},(_,i)=>({at:.2+i*.16,spec,attackId:f.attackId}));
  }
  return true;
}
export function attackInfo(f) {
  const t=f.actionTime;
  if(normalActions.includes(f.action)){
    const info=normalFor(f);
    if(t<=info.recovery||t>=info.duration-info.startup)return null;
    return info;
  }
  if(f.action==='grab'&&t>.16&&t<.38)return {reach:90,damage:15+f.data.power*.5,knock:85,height:125,throw:true,down:true,stun:.85};
  if(f.action==='guardCounter'&&t>.1&&t<.35)return {reach:195,damage:8,knock:80,height:140,down:true,stun:.85};
  if(specialActions.includes(f.action)){
    const spec=specialFor(f);
    if(['projectile','groundWave'].includes(spec.type)||t<=.16||t>=spec.duration-.14)return null;
    return {...spec,damage:spec.damage*(f.powered?1.12:1),knock:85,height:spec.level==='low'?60:135,level:spec.level||'mid',throw:spec.type==='throw',down:!f.powered,stun:.4};
  }
  return null;
}
export function guardBlocks(target,level='mid'){
  return target.blocking&&target.y===0&&(level==='mid'||(level==='low'?target.guardLow:!target.guardLow));
}
function takeHit(a,b,hit,kind,direction,canConfirm=true){
  const blocked=!hit.throw&&b.facing!==direction&&guardBlocks(b,hit.level);
  const scaling=clamp(1-(a?.combo||0)*.1,.45,1);
  const damage=hit.damage*(blocked?.14:scaling*(1-(b.data.defense-5)*.025));
  b.hp=clamp(b.hp-damage,0,100);b.vx=direction*(hit.knock||25)*10;
  let guardBreak=false,armored=false;
  if(blocked){
    b.guard=clamp(b.guard-(hit.guardDamage||hit.damage*1.3),0,100);
    guardBreak=b.guard===0;b.stun=guardBreak?.85:.16;b.blockStun=guardBreak?0:.16;
    if(guardBreak){b.blocking=false;b.action='guardBreak';b.actionTime=.85;}
  }else{
    armored=b.armor>0&&!hit.throw;
    if(armored){b.armor--;b.vx*=.15;}
    else{
      b.knockedDown=!!hit.down;b.stun=b.knockedDown?.85:(hit.stun||.25);b.blockStun=0;b.blocking=false;
      b.action=b.knockedDown?'down':'hurt';b.actionTime=b.stun;b.pendingShots=[];
    }
    if(a){if(canConfirm){a.confirmed=true;a.hitConnected=true;}a.combo++;a.comboTimer=.7;}
  }
  if(a)a.energy=clamp(a.energy+(blocked?5:11),0,100);
  b.energy=clamp(b.energy+6,0,100);
  return {damage,blocked,guardBreak,armored,x:b.x,y:550+b.y-(hit.height||130),kind};
}
export function resolveProjectile(projectile,target){
  if(target.hp<=0||canEvade(target)||target.knockedDown||Math.abs(projectile.x-target.x)>40+(projectile.size||22)||Math.abs(projectile.y-(target.y-(target.crouching?80:130)))>(projectile.size||22)+65)return null;
  const hit={damage:projectile.damage??(6+projectile.power*.4),level:projectile.level||'mid',height:130,knock:24,stun:.3,down:projectile.down};
  return takeHit(projectile.owner,target,hit,projectile.kind||'cast',projectile.facing,projectile.attackId===projectile.owner?.attackId);
}
export function resolveHit(a,b){
  const hit=attackInfo(a);
  if(!hit||a.hp<=0||b.hp<=0||b.knockedDown||(!hit.throw&&canEvade(b))||(hit.throw&&(a.y!==0||b.y!==0))||a.hitTargets.has(b)||(b.x-a.x)*a.facing<0||Math.abs(a.x-b.x)>hit.reach)return null;
  if(Math.abs(a.y-b.y)>(hit.vertical||120))return null;
  // Body and attack boxes use the feet as their common origin.
  const strikeY=a.y-(hit.height||130),bodyTop=b.y-(b.crouching?125:235),bodyBottom=b.y-15;
  if(!hit.throw&&(strikeY+55<bodyTop||strikeY-55>bodyBottom))return null;
  a.hitTargets.add(b);return takeHit(a,b,hit,a.action,a.facing);
}

function shape(c,points,fill,stroke='#17221f',width=2) {
  c.beginPath(); points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p)); c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.lineJoin='round';c.stroke();}
}
function ellipse(c,x,y,rx,ry,fill,stroke='#17221f',width=2){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function limb(c,a,b,width,color,outline=true){c.lineCap='round';if(outline){c.strokeStyle='#18201a';c.lineWidth=width+4;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();c.strokeStyle='#ffffff19';c.lineWidth=width*.2;c.beginPath();c.moveTo(a[0]-3,a[1]);c.lineTo(b[0]-3,b[1]);c.stroke();}
export function drawFighter(c,f,{portrait=false,time=0}={}) {
  const d=f.data, kick=['kick','strongKick','sweep'].includes(f.action), punch=['punch','strongPunch','uppercut','grab'].includes(f.action), special=specialActions.includes(f.action), hurt=f.action==='hurt', dead=f.hp<=0;
  const phase= Math.sin(time*5+f.index), walking=Math.abs(f.vx)>40 && f.y===0 && !punch && !kick && !special;
  const bob=portrait?0:walking?Math.sin(f.walk*2)*2:phase*2;
  c.save();c.translate(f.x,f.y+bob);c.scale(f.facing,1);if(f.crouching&&f.y===0)c.scale(1,.67);
  if(dead){c.translate(0,-10);c.rotate(-1.45);}
  if(hurt) c.rotate(-.1);
  const bulk=d.kind==='brute'?1.22:d.kind==='hero'?1.13:1;
  c.scale(bulk,1);
  const female=d.kind==='crop'||d.kind==='iara';
  const step=walking?Math.sin(f.walk)*18:0;
  const rearHip=[-14,-91],frontHip=[13,-90];
  let rearKnee=[-28-step,-48],rearFoot=[-39-step,-6],frontKnee=[30+step,-46],frontFoot=[45+step,-5];
  if(kick){frontKnee=[61,-112];frontFoot=[116,-123];rearFoot=[-27,-4];}
  if(special){frontKnee=[47,-128];frontFoot=[76,-94];rearFoot=[-39,-4];}
  if(f.y<0 && !kick && !special){frontKnee=[44,-95];frontFoot=[66,-65];rearKnee=[-28,-56];rearFoot=[-43,-32];}
  // Cape and hair move behind the silhouette.
  if(d.kind==='hero') shape(c,[[-22,-165],[-52,-144],[-83+phase*5,-48],[-31,-69],[4,-142]],'#8d1c2b');
  if(d.kind==='iara')for(let i=0;i<10;i++){const xx=-21-i*3;limb(c,[xx,-191],[xx-20+Math.sin(i+time)*4,-115-i%3*12],5,d.hair);ellipse(c,xx-15,-132-i%3*10,3,5,d.accent,null);}
  if(d.kind==='crop'){for(let i=0;i<18;i++){const a=i*Math.PI*2/18;ellipse(c,-9+Math.cos(a)*27,-195+Math.sin(a)*26,12,13,d.hair,'#211c17',1);}}
  limb(c,rearHip,rearKnee,female?22:27,d.pants);limb(c,rearKnee,rearFoot,female?18:22,d.pants);
  limb(c,frontHip,frontKnee,female?23:28,d.pants);limb(c,frontKnee,frontFoot,female?19:23,d.pants);
  // Trouser seams, wraps, and shoes.
  if(['caio','thiago','teimoso'].includes(d.id)){limb(c,[frontHip[0]+5,frontHip[1]+3],[frontKnee[0]+6,frontKnee[1]],3,d.accent,false);}
  for(const foot of [rearFoot,frontFoot]){ellipse(c,foot[0]+4,foot[1]+1,17,7,d.kind==='crop'||d.kind==='iara'?d.skin:'#222c29');if(d.kind==='caio')limb(c,[foot[0],foot[1]-17],[foot[0],foot[1]-3],16,'#d4dcba');}
  // Back arm.
  const rearShoulder=[-24,-155],rearElbow=portrait?[-48,-125]:[-47,-119],rearHand=portrait?[-34,-163]:[-58,-142];
  const sleeve=['shirt','jacket','suit','hero'].includes(d.kind);
  limb(c,rearShoulder,rearElbow,female?17:23,sleeve?d.color:d.skin);limb(c,rearElbow,rearHand,female?15:20,d.skin);
  ellipse(c,rearHand[0],rearHand[1],11,12,['caio','bruno','taxad'].includes(d.id)?d.accent:d.skin);
  // Torso, separate outlined muscle planes.
  shape(c,[[-25,-165],[17,-167],[31,-140],[20,-99],[21,-85],[-21,-85],[-23,-112],[-34,-146]],female?d.skin:d.color);
  if(female){shape(c,[[-28,-158],[-8,-149],[22,-160],[29,-139],[7,-131],[-23,-138]],d.color);limb(c,[-22,-159],[-14,-167],4,d.accent,false);shape(c,[[-23,-94],[21,-94],[24,-82],[-22,-82]],d.accent);}
  else {shape(c,[[-28,-151],[-5,-155],[-3,-131],[-20,-126]],'#ffffff10',null);shape(c,[[1,-154],[23,-151],[21,-128],[1,-132]],'#ffffff10',null);c.strokeStyle='#111c2138';c.lineWidth=1.5;c.beginPath();c.moveTo(-2,-150);c.lineTo(-2,-100);c.moveTo(-15,-119);c.lineTo(16,-119);c.moveTo(-13,-108);c.lineTo(15,-108);c.stroke();}
  if(d.kind==='jacket'){shape(c,[[-27,-165],[-8,-168],[-12,-97],[-25,-88],[-31,-135]],'#28362f');shape(c,[[10,-167],[24,-160],[26,-88],[11,-95]],'#28362f');limb(c,[-23,-155],[-19,-103],5,d.accent,false);}
  if(d.kind==='suit'){shape(c,[[-15,-166],[-1,-126],[15,-165]],'#faf8e9');shape(c,[[-3,-161],[2,-161],[6,-128],[0,-119],[-5,-131]],d.accent);shape(c,[[-21,-163],[-10,-145],[-14,-137],[-4,-123]],'#babfb6');shape(c,[[19,-164],[10,-145],[14,-138],[5,-122]],'#babfb6');ellipse(c,17,-149,3,3,d.accent,null);}
  if(d.kind==='tank'||d.kind==='shirt'){shape(c,[[-11,-150],[9,-150],[15,-139],[-2,-133],[-15,-141]],'#258c55',null);ellipse(c,0,-142,4,4,'#255799',null);}
  if(d.kind==='hero'){shape(c,[[-18,-150],[17,-150],[16,-126],[0,-118],[-18,-128]],'#ece1cb');c.save();c.fillStyle='#a82b2e';c.font='bold 9px Arial';c.textAlign='center';c.fillText('TAXAD',0,-134);c.restore();}
  shape(c,[[-22,-91],[23,-91],[23,-82],[-22,-82]],d.kind==='hero'?'#67563b':'#253328');ellipse(c,2,-86,5,4,d.accent,'#1d2721',1);
  if(d.id==='iara'){shape(c,[[-23,-87],[25,-85],[40,-38],[4,-50],[-22,-41]],'#d2ae3a');for(let i=0;i<5;i++)limb(c,[-15+i*9,-79],[-4+i*8,-46],3,'#2c8d75',false);}
  if(d.id==='livia'||d.id==='teimoso'){limb(c,[8,-84],[20,-47],3,d.accent,false);limb(c,[10,-84],[31,-55],3,d.accent,false);}
  // Neck and face.
  limb(c,[-2,-165],[-2,-182],19,d.skin);
  shape(c,[[-18,-209],[6,-215],[20,-202],[20,-179],[9,-168],[-5,-169],[-19,-180],[-23,-194]],d.skin);
  shape(c,[[11,-204],[20,-197],[19,-181],[9,-172],[3,-174],[8,-191]],'#00000018',null);
  ellipse(c,-20,-189,4,7,d.skin,'#2b2a20',1);
  // Nose, brow, and eyes.
  c.strokeStyle='#382d22';c.lineWidth=2;c.beginPath();c.moveTo(12,-194);c.lineTo(17,-187);c.lineTo(11,-185);c.moveTo(3,-179);c.lineTo(13,-179);c.stroke();
  shape(c,[[1,-198],[14,-198],[13,-194],[3,-193]],'#eee8d5',null);ellipse(c,10,-196,1.7,2.3,'#1c241c',null);limb(c,[0,-201],[14,-201],3,d.hair,false);
  if(d.kind==='suit'||d.kind==='brute'){shape(c,[[-15,-183],[-1,-177],[9,-174],[19,-183],[16,-172],[4,-164],[-12,-171]],d.hair);}
  if(d.kind==='suit'){ellipse(c,0,-213,43,8,'#ecece2');shape(c,[[-25,-215],[-20,-246],[18,-245],[25,-215]],'#e5e6dc');shape(c,[[-24,-221],[24,-221],[24,-214],[-25,-214]],d.accent);}
  else if(d.kind==='jacket'){shape(c,[[-25,-206],[-21,-227],[9,-230],[24,-218],[17,-206]],'#e9e6d2');shape(c,[[16,-212],[40,-207],[17,-204]],'#cecdbf');}
  else if(d.kind!=='crop'&&d.kind!=='iara'){shape(c,[[-21,-189],[-28,-205],[-22,-218],[-12,-215],[-15,-229],[-1,-219],[8,-231],[15,-217],[26,-218],[19,-207],[7,-210],[-10,-201],[-13,-185]],d.hair);}
  if(d.id==='caio'||d.id==='livia'){limb(c,[-22,-206],[17,-207],5,d.id==='caio'?'#69aa49':d.accent,false);shape(c,[[-20,-205],[-36,-187],[-32,-209]],d.accent);}
  if(female){ellipse(c,-19,-180,5,7,d.accent,'#e4c65b',1.5);limb(c,[2,-179],[12,-180],2,'#8e3630',false);}
  // Foreground arm and guard.
  const shoulder=[23,-154];
  let elbow=portrait?[44,-121]:[40,-125],hand=portrait?[48,-169]:[57,-159];
  if(punch){elbow=[68,-157];hand=[112,-159];}if(kick){elbow=[11,-122];hand=[-6,-146];}if(special){elbow=[62,-171];hand=[103,-191];}if(f.blocking){elbow=[42,-154];hand=[29,-198];}
  limb(c,shoulder,elbow,female?18:25,sleeve?d.color:d.skin);limb(c,elbow,hand,female?15:21,sleeve?d.color:d.skin);
  if(['caio','bruno','taxad','teimoso'].includes(d.id))limb(c,[hand[0]-(hand[0]-elbow[0])*.2,hand[1]-(hand[1]-elbow[1])*.2],hand,20,d.accent);
  ellipse(c,hand[0],hand[1],female?9:12,female?10:13,['caio','bruno','taxad'].includes(d.id)?d.accent:d.skin);
  for(let i=0;i<3;i++)limb(c,[hand[0]-5+i*4,hand[1]-4],[hand[0]-5+i*4,hand[1]+2],.8,'#17201b70',false);
  if(special){c.globalAlpha=.3;ellipse(c,hand[0]+7,hand[1],22+Math.sin(time*40)*5,23,d.effect,null);c.globalAlpha=1;}
  c.restore();
}

export function portraitImage(index){
  const canvas=document.createElement('canvas');canvas.width=400;canvas.height=510;const c=canvas.getContext('2d');const d=fighters[index];
  const g=c.createLinearGradient(0,0,400,510);g.addColorStop(0,d.bg);g.addColorStop(1,'#101b18');c.fillStyle=g;c.fillRect(0,0,400,510);
  c.save();c.globalAlpha=.09;c.fillStyle='#f8e6a5';for(let i=0;i<9;i++){c.beginPath();c.moveTo(200,230);c.lineTo(i*120-380,0);c.lineTo(i*120-330,0);c.fill();}c.restore();
  // Distant hillside houses behind each portrait.
  for(let i=0;i<22;i++){c.fillStyle=i%2?'#b0b99518':'#ced0a014';c.fillRect(i*24-30,270+Math.sin(i)*35,21,200);}
  c.save();c.translate(173,615);c.scale(2.3,2.3);drawFighter(c,createCombatant(index,0,1),{portrait:true});c.restore();
  return canvas.toDataURL();
}
