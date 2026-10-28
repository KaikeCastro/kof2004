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

export const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
export function createCombatant(index, x, facing) {
  return { data:fighters[index], index, x, y:0, vx:0, vy:0, facing, hp:100, energy:0, action:'idle', actionTime:0, cooldown:0, stun:0, attackId:0, hitTargets:new Set(), wins:0, combo:0, comboTimer:0, walk:0, blocking:false };
}
export function attack(f, kind) {
  if (f.hp <= 0 || f.stun>0 || f.cooldown>0 || f.blocking || (f.actionTime>0 && f.action!=='idle')) return false;
  if(kind==='special' && f.energy<50) return false;
  if(kind==='special') f.energy-=50;
  f.action=kind; f.actionTime=kind==='special'?.65:kind==='kick'?.4:.28;
  f.cooldown=kind==='special'?.85:kind==='kick'?.49:.33;
  f.attackId++; f.hitTargets.clear(); return true;
}
export function attackInfo(f) {
  const t=f.actionTime;
  if(f.action==='punch' && t>.08 && t<.23) return {reach:122,damage:5+f.data.power*.45,knock:13,height:150};
  if(f.action==='kick' && t>.1 && t<.32) return {reach:163,damage:8+f.data.power*.6,knock:25,height:f.y< -30?110:120};
  if(f.action==='special' && t>.16 && t<.51) return {reach:270,damage:16+f.data.power*.9,knock:65,height:130};
  return null;
}
export function resolveHit(a,b) {
  const hit=attackInfo(a);
  if(!hit || b.hp<=0 || a.hitTargets.has(b) || (b.x-a.x)*a.facing<0 || Math.abs(a.x-b.x)>hit.reach || Math.abs(a.y-b.y)>120) return null;
  a.hitTargets.add(b);
  const blocked=b.blocking && b.y===0 && b.facing!==a.facing;
  const damage=blocked?hit.damage*.14:hit.damage*(1-(b.data.defense-5)*.025);
  b.hp=clamp(b.hp-damage,0,100); b.stun=blocked?.1:.21; b.vx=a.facing*hit.knock*10;
  if(!blocked){b.action='hurt';b.actionTime=.24;a.combo++;a.comboTimer=1.2;}
  a.energy=clamp(a.energy+(blocked?5:11),0,100); b.energy=clamp(b.energy+6,0,100);
  return {damage,blocked,x:(a.x+b.x)/2,y:550+b.y-hit.height,kind:a.action};
}

function shape(c,points,fill,stroke='#17221f',width=2) {
  c.beginPath(); points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p)); c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.lineJoin='round';c.stroke();}
}
function ellipse(c,x,y,rx,ry,fill,stroke='#17221f',width=2){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function limb(c,a,b,width,color,outline=true){c.lineCap='round';if(outline){c.strokeStyle='#18201a';c.lineWidth=width+4;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();c.strokeStyle='#ffffff19';c.lineWidth=width*.2;c.beginPath();c.moveTo(a[0]-3,a[1]);c.lineTo(b[0]-3,b[1]);c.stroke();}
export function drawFighter(c,f,{portrait=false,time=0}={}) {
  const d=f.data, kick=f.action==='kick', punch=f.action==='punch', special=f.action==='special', hurt=f.action==='hurt', dead=f.hp<=0;
  const phase= Math.sin(time*5+f.index), walking=Math.abs(f.vx)>40 && f.y===0 && !punch && !kick && !special;
  const bob=portrait?0:walking?Math.sin(f.walk*2)*2:phase*2;
  c.save();c.translate(f.x,f.y+bob);c.scale(f.facing,1);
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
