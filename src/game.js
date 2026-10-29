import {loadPixelArt, drawPixelPortrait, pixelPortraitURL, drawPixelFighter, drawPixelStage} from './pixel-art.js';
import { fighters, clamp, createCombatant, attack, resolveHit, drawFighter, portraitImage } from './fighters.js';

const $=id=>document.getElementById(id);
const canvas=$('game'), ctx=canvas.getContext('2d');
const portrait=$('portrait'), pc=portrait.getContext('2d');
let opponentChoice=null,pickingOpponent=false;
let selected=0,mode='cpu',screen='selection',muted=true,audio,paused=false,last=0,time=0,round=1,remaining=60,roundStage='intro',stageTime=0,players=[],particles=[],texts=[],shake=0,hitstop=0,aiTimer=0,aiIntent={};
let arena='rio',difficulty='normal',matchCount=0;
const keys=new Set(),pressed=new Set(),portraits=[];
let lanRoom=null,lanInput={},lanPrevious={},lanConnected=false,lanPollBusy=false,lanFrameBusy=false;
const settingsKey='brasil-fighters-settings-v1';
try{const s=JSON.parse(localStorage.getItem(settingsKey)||'{}');selected=clamp(Number(s.selected)||0,0,7);if(['easy','normal','hard'].includes(s.difficulty))$('difficulty').value=s.difficulty;if(['rio','brasilia','salvador','saopaulo'].includes(s.arena))$('arena-select').value=s.arena;}catch{}
opponentChoice=(selected+3)%fighters.length;
function persist(){try{localStorage.setItem(settingsKey,JSON.stringify({selected,difficulty:$('difficulty').value,arena:$('arena-select').value}));}catch{}}

function sound(freq=180,duration=.08,type='square',volume=.04,slide=0){if(muted)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,freq+slide),audio.currentTime+duration);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}catch{}}
function toggleSound(){muted=!muted;$('sound-button').innerHTML=muted?'♫<span class="sound-off">×</span>':'♫';$('sound-button').setAttribute('aria-label',muted?'Ativar som':'Desativar som');$('sound-button').title=muted?'Ativar som':'Desativar som';if(!muted){sound(440,.12,'triangle');setTimeout(()=>sound(660,.15,'triangle'),100);}}
function choose(index){if(pickingOpponent){opponentChoice=(index+8)%8;renderRival();sound(440,.06,'triangle');}else select(index);}
function select(index,play=true){selected=(index+fighters.length)%fighters.length;const d=fighters[selected];
  document.querySelectorAll('.fighter-card').forEach((el,i)=>{el.classList.toggle('selected',i===selected);el.setAttribute('aria-pressed',String(i===selected));});
  $('fighter-name').textContent=d.name.toUpperCase();$('fighter-style').textContent=d.style.toUpperCase();$('fighter-tag').textContent=d.tag.toUpperCase();$('fighter-origin').textContent=d.origin.toUpperCase();$('fighter-quote').textContent=`“${d.quote}”`;$('fighter-special').innerHTML=`${d.special.toUpperCase()} <b>↗</b>`;$('portrait-number').textContent=String(selected+1).padStart(2,'0');
  $('fighter-stats').innerHTML=[['FORÇA',d.power],['AGILIDADE',d.speed],['DEFESA',d.defense]].map(([label,n])=>`<div class="stat"><span>${label}</span><div class="stat-bar">${Array.from({length:10},(_,i)=>`<i class="${i<n?'filled':''}"></i>`).join('')}</div><b>${n}</b></div>`).join('');
  $('fighter-detail').style.setProperty('--fighter-color',d.effect);document.querySelector('.portrait-bg').style.background=`linear-gradient(125deg,${d.bg},#8d9960)`;
  renderPortrait();renderRival();persist();if(play)sound(300+selected*30,.045,'triangle',.03);
}
function renderPortrait(){pc.clearRect(0,0,600,630);if(drawPixelPortrait(pc,selected,600,630))return;pc.save();pc.translate(290,785);pc.scale(3.05,3.05);drawFighter(pc,createCombatant(selected,0,1),{portrait:true});pc.restore();}

function renderRival(){const i=opponentChoice??(selected+3)%8;const c=$('rival-portrait').getContext('2d');c.clearRect(0,0,600,630);drawPixelPortrait(c,i,600,630);$('rival-name').textContent=fighters[i].name.toUpperCase();document.querySelectorAll('.fighter-card').forEach((el,n)=>el.classList.toggle('cpu-selected',n===i));}
async function load(){
  try{await loadPixelArt();}catch(e){$('load-status').textContent='Modo de arte local';console.error(e);}
  for(let i=0;i<fighters.length;i++){const d=fighters[i];portraits[i]=pixelPortraitURL(i);const b=document.createElement('button');b.className='fighter-card';b.setAttribute('aria-label',`${d.name}, ${d.style}`);b.innerHTML=`<img src="${portraits[i]}" alt="${d.name}" draggable="false"><span class="card-number">${String(i+1).padStart(2,'0')}</span><span class="selected-marker">1P</span><span class="opponent-marker">2P</span><span class="card-copy"><b>${d.name.toUpperCase()}</b><small>${d.style.toUpperCase()}</small></span>`;b.addEventListener('click',()=>choose(i));$('roster').append(b);$('load-progress').style.width=`${(i+1)/8*100}%`;$('load-status').textContent=`${d.name} na arena · ${i+1}/8`;await new Promise(r=>setTimeout(r,45));}
  select(selected,false);$('load-status').textContent='Tudo pronto. O Brasil entrou na arena.';await new Promise(r=>setTimeout(r,180));$('loading').classList.add('done');setTimeout(()=>$('loading').hidden=true,450);
}

function startMatch(){
  if(mode==='lan'&&!lanConnected){$('lan-status').textContent='Aguardando o segundo jogador entrar pelo endereço acima.';return;}
  arena=$('arena-select').value;difficulty=$('difficulty').value;persist();matchCount++;
  const opponent=opponentChoice??(selected+3)%8;
  players=[createCombatant(selected,350,1),createCombatant(opponent,930,-1)];
  round=1;screen='battle';paused=false;$('pause-button').textContent='Ⅱ PAUSAR';$('selection').hidden=true;$('battle').hidden=false;$('pause-overlay').hidden=true;$('result-overlay').hidden=true;$('help-overlay').hidden=true;
  document.querySelectorAll('.hud-face').forEach(el=>el.remove());players.forEach((f,i)=>{const img=document.createElement('img');img.className='hud-face';img.alt=f.data.name;img.src=portraits[f.index];$(`p${i+1}-name`).parentElement.prepend(img);});$('p1-name').textContent=players[0].data.name.toUpperCase();$('p2-name').textContent=players[1].data.name.toUpperCase();$('opponent-label').textContent=mode==='cpu'?'CPU':'2P';$('arena-title').textContent=({rio:'RIO DE JANEIRO · FIM DE TARDE',brasilia:'BRASÍLIA · EIXO MONUMENTAL',salvador:'SALVADOR · PELOURINHO',saopaulo:'SÃO PAULO · AVENIDA PAULISTA'})[arena];
  $('battle').scrollIntoView({behavior:'smooth',block:'start'});resetRound();
}
function resetRound(){
  const old=players;players=old.map((f,i)=>Object.assign(createCombatant(f.index,i===0?350:930,i===0?1:-1),{wins:f.wins,energy:Math.min(f.energy,50)}));
  remaining=60;roundStage='intro';stageTime=0;particles=[];texts=[];keys.clear();pressed.clear();aiTimer=0;shake=0;hitstop=0;announce(`ROUND ${round}`,mode==='cpu'?`${difficulty==='hard'?'CASCA-GROSSA':difficulty==='easy'?'TRANQUILO':'NA RAÇA'} · MELHOR DE TRÊS`:'DOIS JOGADORES · MELHOR DE TRÊS');updateHUD();sound(220,.2,'sawtooth',.025,220);
}
function announce(big,small=''){ $('announcement').classList.remove('invisible');$('announce-big').textContent=big;$('announce-small').textContent=small; }
function updateHUD(){
  players.forEach((f,i)=>{const n=i+1;$(`p${n}-health`).style.width=`${f.hp}%`;$(`p${n}-health`).style.background=f.hp<25?'linear-gradient(#f58f60,#d24a38)':'';$(`p${n}-power`).style.width=`${f.energy}%`;$(`p${n}-power`).parentElement.classList.toggle('ready',f.energy>=50);Array.from($(`p${n}-rounds`).children).forEach((dot,j)=>dot.classList.toggle('won',j<f.wins));});$('timer').textContent=String(Math.ceil(remaining)).padStart(2,'0');$('round-label').textContent=`ROUND ${round}`;
}
function finishRound(){
  if(roundStage!=='fight')return;roundStage='outro';stageTime=0;keys.clear();pressed.clear();
  const [a,b]=players;let winner=a.hp===b.hp?-1:a.hp>b.hp?0:1;if(winner>=0)players[winner].wins++;
  announce(remaining<=0?'TEMPO ESGOTADO!':winner<0?'EMPATE!':'K.O.',winner<0?'MAIS UM ROUND PARA DECIDIR':`${players[winner].data.name.toUpperCase()} VENCE O ROUND`);updateHUD();sound(110,.5,'sawtooth',.05,-70);
}
function finishMatch(){
  roundStage='finished';$('announcement').classList.add('invisible');const winner=players[0].wins>=2?0:1;
  $('result-title').textContent=winner===0?'VITÓRIA!':mode==='cpu'?'NÃO FOI DESSA VEZ.':'2P VENCEU!';
  $('result-copy').textContent=`${players[winner].data.name} levou o combate por ${players[winner].wins} a ${players[1-winner].wins}. “${players[winner].data.quote}”`;$('result-overlay').hidden=false;sound(winner===0?660:165,.3,'triangle',.05, winner===0?220:-50);
}
function backToSelection(){screen='selection';paused=false;keys.clear();pressed.clear();$('battle').hidden=true;$('selection').hidden=false;$('pause-overlay').hidden=true;$('result-overlay').hidden=true;window.scrollTo({top:0,behavior:'smooth'});}
function setPaused(value){if(screen!=='battle'||roundStage==='finished')return;paused=value;keys.clear();pressed.clear();$('pause-overlay').hidden=!value;$('pause-button').textContent=value?'▶ CONTINUAR':'Ⅱ PAUSAR';}
function help(){if(screen==='battle')setPaused(true);$('help-overlay').hidden=false;}
function closeHelp(){$('help-overlay').hidden=true;}

const controlCodes={KeyA:'a',KeyD:'d',KeyW:'w',KeyS:'s',KeyJ:'j',KeyK:'k',KeyL:'l',Digit1:'1',Digit2:'2',Digit3:'3',Numpad1:'1',Numpad2:'2',Numpad3:'3',Numpad4:'4',Numpad5:'5',KeyU:'u',KeyI:'i',ArrowLeft:'arrowleft',ArrowRight:'arrowright',ArrowUp:'arrowup',ArrowDown:'arrowdown'};
window.addEventListener('keydown',e=>{
  const k=controlCodes[e.code]||e.key.toLowerCase();
  if(e.target.matches('select,input,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;
  if(k==='m'&&!e.repeat){toggleSound();return;}
  if(k==='escape'&&!e.repeat){if(!$('help-overlay').hidden)closeHelp();else setPaused(!paused);return;}
  if(!$('help-overlay').hidden)return;
  if(screen==='selection'){
    if(['a','d','w','s'].includes(k)){e.preventDefault();$('pick-p1').click();select(selected+({a:-1,d:1,w:-4,s:4}[k]));}
    if(['arrowleft','arrowright','arrowup','arrowdown'].includes(k)){e.preventDefault();$('pick-p2').click();choose((opponentChoice??(selected+3)%8)+({arrowleft:-1,arrowright:1,arrowup:-4,arrowdown:4}[k]));}
    if(k==='enter'&&!e.repeat&&!e.target.matches('button,a')){e.preventDefault();startMatch();}return;
  }
  if(controlCodes[e.code]){e.preventDefault();if(!keys.has(k))pressed.add(k);keys.add(k);}
});
window.addEventListener('keyup',e=>{const k=controlCodes[e.code]||e.key.toLowerCase();keys.delete(k);});
window.addEventListener('blur',()=>{keys.clear();pressed.clear();if(screen==='battle'&&!paused)setPaused(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&screen==='battle')setPaused(true);});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!keys.has(k))pressed.add(k);keys.add(k);b.classList.add('pressed');});const release=()=>{keys.delete(k);b.classList.remove('pressed');};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);});
$('pick-p1').onclick=()=>{document.querySelector('.panel-heading h3').textContent='ESCOLHA O JOGADOR 1';pickingOpponent=false;$('pick-p1').classList.add('active');$('pick-p2').classList.remove('active');};$('pick-p2').onclick=()=>{document.querySelector('.panel-heading h3').textContent='ESCOLHA O ADVERSÁRIO';pickingOpponent=true;$('pick-p2').classList.add('active');$('pick-p1').classList.remove('active');};$('fight-button').onclick=startMatch;$('sound-button').onclick=toggleSound;$('help-button').onclick=help;$('close-help').onclick=closeHelp;$('help-ok').onclick=closeHelp;$('help-overlay').addEventListener('click',e=>{if(e.target===$('help-overlay'))closeHelp();});$('pause-button').onclick=()=>setPaused(!paused);$('resume-button').onclick=()=>setPaused(false);$('quit-button').onclick=backToSelection;$('back-button').onclick=backToSelection;$('select-button').onclick=backToSelection;$('rematch-button').onclick=()=>{players.forEach(f=>{f.wins=0;f.energy=0;});round=1;$('result-overlay').hidden=true;paused=false;resetRound();};
$('mode-button').onclick=()=>{lanRoom=null;lanConnected=false;$('lan-status').textContent='';mode=mode==='cpu'?'local':'cpu';$('mode-button').innerHTML=`1P <span>VS</span> ${mode==='cpu'?'CPU':'2P'}`;$('difficulty').disabled=mode==='local';sound(440,.08,'triangle');};$('difficulty').onchange=persist;$('arena-select').onchange=persist;

function remoteIntent(){const result={...lanInput};for(const k of ['jump','punch','kick','special','uppercut','sweep']){result[k]=!!lanInput[k]&&!lanPrevious[k];lanPrevious[k]=!!lanInput[k];}return result;}
function playerIntent(i){const map=i===0?{left:'a',right:'d',jump:'w',block:'s',punch:'j',kick:'k',special:'l',uppercut:'u',sweep:'i'}:{left:'arrowleft',right:'arrowright',jump:'arrowup',block:'arrowdown',punch:'1',kick:'2',special:'3',uppercut:'4',sweep:'5'};return Object.fromEntries(Object.entries(map).map(([action,key])=>[action,['left','right','block'].includes(action)?keys.has(key):pressed.has(key)]));}
function cpuIntent(dt){
  aiTimer-=dt;const f=players[1],p=players[0],dist=Math.abs(f.x-p.x);const hard=difficulty==='hard',easy=difficulty==='easy';
  if(aiTimer<=0){aiTimer=(hard?.13:easy?.48:.27)+Math.random()*.2;const roll=Math.random();aiIntent={left:dist>100&&f.x>p.x,right:dist>100&&f.x<p.x,block:dist<190&&p.actionTime>0&&roll<(hard?.8:easy?.14:.4),jump:Math.random()<(hard?.14:.06),punch:dist<125&&roll<.65,kick:dist<175&&roll>=.3,special:f.energy>=50&&dist<270&&roll>(easy?.7:.35)};}
  const intent={...aiIntent};aiIntent.jump=false;aiIntent.punch=false;aiIntent.kick=false;aiIntent.special=false;return intent;
}
function updateFighter(f,intent,dt){
  f.cooldown=Math.max(0,f.cooldown-dt);f.stun=Math.max(0,f.stun-dt);f.actionTime=Math.max(0,f.actionTime-dt);f.comboTimer-=dt;if(f.comboTimer<=0)f.combo=0;
  if(f.actionTime===0)f.action='idle';f.blocking=!!intent.block&&f.y===0&&f.action==='idle'&&f.stun===0;
  if(f.hp>0&&f.stun===0){
    if(f.action==='idle'&&!f.blocking){const move=Number(intent.right)-Number(intent.left);f.vx=move*(250+f.data.speed*12);if(intent.jump&&f.y===0){f.vy=-610;f.y=-1;sound(240,.09,'sine',.02,160);}}
    else f.vx*=Math.max(0,1-dt*10);
    if(intent.special&&attack(f,'special')){sound(160,.35,'sawtooth',.04,600);texts.push({text:f.data.special.toUpperCase(),x:f.x,y:270,life:1,max:1,color:f.data.effect,size:22});}
    else if(intent.uppercut&&attack(f,'uppercut'))sound(260,.12,'sawtooth',.025,100);
    else if(intent.sweep&&attack(f,'sweep'))sound(140,.13,'triangle',.025,-60);
    else if(intent.kick&&attack(f,'kick'))sound(160,.1,'triangle',.02,-80);
    else if(intent.punch&&attack(f,'punch'))sound(210,.07,'triangle',.02,-100);
  }else f.vx*=Math.max(0,1-dt*8);
  f.x=clamp(f.x+f.vx*dt,70,1210);if(f.y<0||f.vy!==0){f.vy+=1480*dt;f.y+=f.vy*dt;if(f.y>=0){f.y=0;f.vy=0;spawnDust(f.x,550,8);}}
  f.walk+=Math.abs(f.vx)*dt*.065;
}
function spawnDust(x,y,n){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*150,vy:-Math.random()*100,life:.35,max:.35,color:'#c5b98e',size:3+Math.random()*6});}
function impact(hit,a,b){
  for(let i=0;i<(hit.blocked?10:hit.kind==='special'?32:18);i++){const angle=Math.random()*Math.PI*2,speed=70+Math.random()*250;particles.push({x:hit.x,y:hit.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.18+Math.random()*.22,max:.4,color:hit.blocked?'#b4f0ff':i%3===0?'#fff9de':a.data.effect,size:2+Math.random()*5});}
  shake=hit.blocked?3:hit.kind==='special'?13:6;hitstop=hit.blocked?.025:.055;
  sound(hit.blocked?360:90,hit.blocked?.08:.12,hit.blocked?'triangle':'sawtooth',.07,-40);
  if(hit.blocked)texts.push({text:'DEFESA',x:b.x,y:310,life:.6,max:.6,color:'#b2e8e8',size:19});
  else if(a.combo>=2)texts.push({text:`${a.combo} HITS`,x:a.x,y:300,life:.7,max:.7,color:'#f5e34b',size:25});
}
function update(dt){
  time+=dt;if(screen!=='battle'||paused)return;
  stageTime+=dt;
  if(roundStage==='intro'){if(stageTime>1.15&&stageTime<1.8)announce('NA RAÇA!','');if(stageTime>=1.8){roundStage='fight';stageTime=0;$('announcement').classList.add('invisible');keys.clear();pressed.clear();sound(440,.15,'sawtooth',.03,440);}}
  else if(roundStage==='fight'){
    if(hitstop>0){hitstop-=dt;return;}
    remaining=Math.max(0,remaining-dt);
    players.forEach((f,i)=>{f.facing=players[1-i].x>=f.x?1:-1;updateFighter(f,i===1&&mode==='cpu'?cpuIntent(dt):i===1&&mode==='lan'?remoteIntent():playerIntent(i),dt);});
    const [a,b]=players,dx=b.x-a.x;if(Math.abs(dx)<72&&Math.abs(a.y-b.y)<100){const push=(72-Math.abs(dx))/2,dir=dx>=0?1:-1;a.x=clamp(a.x-dir*push,70,1210);b.x=clamp(b.x+dir*push,70,1210);}
    for(let i=0;i<2;i++){const hit=resolveHit(players[i],players[1-i]);if(hit)impact(hit,players[i],players[1-i]);}
    if(remaining<=0||players.some(f=>f.hp<=0))finishRound();updateHUD();pressed.clear();
  }else if(roundStage==='outro'&&stageTime>2.5){if(players.some(f=>f.wins>=2))finishMatch();else{round++;resetRound();}}
  for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=450*dt;}particles=particles.filter(p=>p.life>0);
  texts.forEach(t=>{t.life-=dt;t.y-=dt*30;});texts=texts.filter(t=>t.life>0);shake=Math.max(0,shake-dt*25);
}

// Hand-drawn arena layers, kept on a separate canvas so each frame only redraws moving details.
const scenery=document.createElement('canvas');scenery.width=1280;scenery.height=720;let sceneryArena='';
function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function seeded(n){let s=n;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function buildScenery(){
  sceneryArena=arena;const c=scenery.getContext('2d'),rand=seeded(2004);const sky=c.createLinearGradient(0,0,0,550);sky.addColorStop(0,'#3e555c');sky.addColorStop(.4,'#c69368');sky.addColorStop(.8,'#efbc72');sky.addColorStop(1,'#d9c493');c.fillStyle=sky;c.fillRect(0,0,1280,720);
  const sun=c.createRadialGradient(880,205,0,880,205,200);sun.addColorStop(0,'#fff5bcb0');sun.addColorStop(.25,'#ffe89b60');sun.addColorStop(1,'#f6d68c00');c.fillStyle=sun;c.fillRect(650,0,500,450);c.fillStyle='#ffebac';c.beginPath();c.arc(880,205,41,0,Math.PI*2);c.fill();
  // Soft horizontal cloud streaks.
  for(let i=0;i<24;i++){c.fillStyle=i%2?'#f8c99525':'#394f5225';c.beginPath();c.ellipse(rand()*1280,40+rand()*240,50+rand()*160,2+rand()*9,0,0,Math.PI*2);c.fill();}
  if(arena==='rio'){
    poly(c,[[0,330],[0,275],[80,230],[140,258],[218,160],[272,140],[301,168],[349,260],[420,295],[530,325],[1280,340],[1280,490],[0,490]],'#536c69');
    poly(c,[[600,360],[650,330],[720,315],[760,280],[800,293],[830,242],[855,220],[874,236],[902,299],[950,336],[1040,360]],'#6d8075');
    // Christ the Redeemer silhouette on Corcovado.
    c.fillStyle='#52675e';c.fillRect(266,117,5,23);c.fillRect(249,119,39,4);c.beginPath();c.arc(269,112,3.5,0,Math.PI*2);c.fill();poly(c,[[264,124],[272,124],[277,144],[259,144]],'#52675e');
    c.fillStyle='#6c9b96';c.fillRect(0,356,1280,112);for(let i=0;i<65;i++){c.fillStyle=i%3?'#d5c69732':'#f6deb64a';c.fillRect(rand()*1280,360+rand()*90,10+rand()*90,1);}
    poly(c,[[0,403],[150,379],[275,393],[350,430],[466,457],[1280,449],[1280,510],[0,510]],'#b8b493');
    // Colorful hillside neighborhood.
    for(let row=0;row<6;row++){for(let col=0;col<12;col++){const x=col*47-80+row*8,y=230+row*35+Math.sin(col*.6)*27,w=37+rand()*12,h=25+rand()*28;const colors=['#a67b57','#bb956b','#93876c','#6e8c83','#b07c65','#b6ad83'];c.fillStyle=colors[Math.floor(rand()*colors.length)];c.fillRect(x,y,w,h);c.fillStyle='#475853';c.fillRect(x-2,y,w+4,3);c.fillStyle='#263e3a';for(let k=0;k<3;k++){c.fillRect(x+6+k*11,y+9,5,8);if(rand()>.6){c.fillStyle='#e8c780';c.fillRect(x+6+k*11,y+9,4,6);c.fillStyle='#263e3a';}}}}
    // Distant beachfront buildings.
    for(let i=0;i<20;i++){const x=595+i*36,h=20+rand()*60;c.fillStyle=i%2?'#a4ac99':'#c2bea0';c.fillRect(x,430-h,27,h);c.fillStyle='#667c72';for(let yy=435-h;yy<423;yy+=8)for(let xx=x+4;xx<x+25;xx+=8)c.fillRect(xx,yy,3,3);}
    palm(c,1035,435,185,-1);palm(c,1190,444,236,1);palm(c,535,450,120,-1);
    // Elevated street and railing.
    c.fillStyle='#6d8070';c.fillRect(0,454,1280,5);c.fillStyle='#3e574c';c.fillRect(0,472,1280,7);for(let x=12;x<1280;x+=65)c.fillRect(x,452,5,65);
  }else{
    c.fillStyle='#8e9b89';c.fillRect(0,358,1280,125);c.fillStyle='#a8ab90';c.fillRect(0,421,1280,70);
    // Congress towers and bowls.
    c.fillStyle='#d8d3ae';c.fillRect(680,206,29,205);c.fillRect(719,206,29,205);c.fillStyle='#778c80';for(let y=215;y<400;y+=9){c.fillRect(685,y,18,2);c.fillRect(724,y,18,2);}c.fillStyle='#d9d6b7';c.fillRect(560,408,360,16);c.beginPath();c.ellipse(615,391,67,26,0,0,Math.PI);c.fill();c.beginPath();c.ellipse(824,413,66,39,0,Math.PI,Math.PI*2);c.fill();
    // Cathedral crown and reflecting pool.
    for(let i=0;i<9;i++){c.strokeStyle='#c5cfbc';c.lineWidth=6;c.beginPath();c.moveTo(240+i*16,430);c.quadraticCurveTo(306,380,290+i*4,314);c.stroke();}c.fillStyle='#719c93';c.fillRect(172,445,320,30);c.fillStyle='#c1bda0';c.fillRect(0,480,1280,20);palm(c,1100,440,170,1);
    for(let i=0;i<14;i++){c.fillStyle='#5b795b';c.beginPath();c.ellipse(i*100,453,40,17,0,0,Math.PI*2);c.fill();}
  }
  // Foreground paving perspective.
  const ground=c.createLinearGradient(0,491,0,720);ground.addColorStop(0,'#8f8c72');ground.addColorStop(.25,'#b7aa83');ground.addColorStop(1,'#605f4d');c.fillStyle=ground;c.fillRect(0,492,1280,228);c.fillStyle='#d4bf8f';c.fillRect(0,492,1280,7);c.fillStyle='#4c5546';c.fillRect(0,499,1280,8);
  c.strokeStyle='#3f493d33';c.lineWidth=2;for(let x=-700;x<2000;x+=140){c.beginPath();c.moveTo(640+(x-640)*.6,508);c.lineTo(x,720);c.stroke();}for(const y of [531,566,615,683]){c.beginPath();c.moveTo(0,y);c.lineTo(1280,y);c.stroke();}
  // Wave mosaic of the calçadão.
  c.save();c.beginPath();c.rect(0,634,1280,35);c.clip();c.fillStyle='#bdb49b';c.fillRect(0,634,1280,35);for(let i=-1;i<10;i++){c.strokeStyle='#35463e';c.lineWidth=12;c.beginPath();c.moveTo(i*155,660);c.bezierCurveTo(i*155+35,600,i*155+95,700,i*155+155,643);c.stroke();}c.restore();
  // Street-side speaker stack and Brazil flag pole.
  c.fillStyle='#283b32';c.fillRect(33,412,61,98);c.strokeStyle='#14281f';c.lineWidth=3;c.strokeRect(33,412,61,98);for(const y of [440,483]){c.fillStyle='#14281f';c.beginPath();c.arc(63,y,18,0,Math.PI*2);c.fill();c.strokeStyle='#5a6a50';c.stroke();c.fillStyle='#293c32';c.beginPath();c.arc(63,y,7,0,Math.PI*2);c.fill();}c.fillStyle='#b2ba95';c.fillRect(1135,290,4,219);
  // Little spectators.
  for(const [x,col] of [[162,'#dfc64e'],[196,'#3c755a'],[446,'#d2ae78'],[483,'#495c80'],[999,'#cf936b']]){c.fillStyle='#9b7756';c.beginPath();c.arc(x,448,7,0,Math.PI*2);c.fill();c.fillStyle=col;c.fillRect(x-8,455,16,26);c.fillStyle='#34483b';c.fillRect(x-7,481,5,17);c.fillRect(x+3,481,5,17);}
  c.fillStyle='#0c191b20';c.fillRect(0,0,1280,720);
}
function palm(c,x,y,height,dir){
  c.strokeStyle='#4b5941';c.lineWidth=9;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+dir*25,y-height*.5,x+dir*13,y-height);c.stroke();
  const tx=x+dir*13,ty=y-height;for(let i=0;i<9;i++){const angle=-Math.PI+.39*i;c.strokeStyle=i%2?'#355b42':'#486a46';c.lineWidth=6;c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(angle)*45,ty+Math.sin(angle)*32-15,tx+Math.cos(angle)*85,ty+Math.sin(angle)*25+20);c.stroke();}
}
function drawFlag(){ctx.save();ctx.translate(1139,294);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(30,-7,52,8+Math.sin(time*3)*7,90,2);ctx.lineTo(90,52);ctx.bezierCurveTo(50,61+Math.sin(time*3)*7,25,46,0,53);ctx.closePath();ctx.fillStyle='#257b43';ctx.fill();poly(ctx,[[12,26],[45,7],[79,28],[45,46]],'#e2cb48');ctx.fillStyle='#2e567a';ctx.beginPath();ctx.arc(45,27,12,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d8d7af';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(35,23);ctx.quadraticCurveTo(45,20,56,30);ctx.stroke();ctx.restore();}
function render(){
  if(screen!=='battle')return;if(sceneryArena!==arena)buildScenery();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,768,576);ctx.save();ctx.scale(.6,.8);ctx.imageSmoothingEnabled=false;if(shake>0&&!paused)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake*.5);if(!drawPixelStage(ctx,arena)){ctx.drawImage(scenery,0,0);drawFlag();}
  // Ground contact shadows.
  players.forEach(f=>{ctx.fillStyle='#142a2490';ctx.beginPath();ctx.ellipse(f.x,553,70*(1+f.y/1000),12,0,0,Math.PI*2);ctx.fill();});
  const ordered=[...players].sort((a,b)=>a.y-b.y);for(const f of ordered){
    // A special trails a bright curved energy wave that clearly matches its reach.
    if(f.action==='special'&&f.actionTime>.14){ctx.save();ctx.translate(f.x,550+f.y);ctx.scale(f.facing,1);const p=(.65-f.actionTime)/.65;ctx.globalAlpha=Math.sin(p*Math.PI)*.75;ctx.strokeStyle=f.data.effect;ctx.lineWidth=18;ctx.shadowColor=f.data.effect;ctx.shadowBlur=25;ctx.beginPath();ctx.ellipse(90+p*90,-130,55+p*25,70,-.2,-1.5,1.4);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle='#fff8cd';ctx.stroke();ctx.restore();}
    ctx.save();ctx.translate(0,550);if(!drawPixelFighter(ctx,f,time))drawFighter(ctx,f,{time});ctx.restore();
    if(f.blocking){ctx.save();ctx.strokeStyle='#b3e9de90';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(f.x+f.facing*37,550+f.y-136,27,63,0,-Math.PI/2,Math.PI/2);ctx.stroke();ctx.restore();}
    // Player marker.
    if(roundStage==='intro'){ctx.fillStyle=f===players[0]?'#f4df38':'#eae6cc';ctx.font='bold 13px Arial';ctx.textAlign='center';ctx.fillText(f===players[0]?'1P ▼':mode==='cpu'?'CPU ▼':'2P ▼',f.x,550+f.y-263);}
  }
  for(const p of particles){ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);}ctx.globalAlpha=1;
  for(const t of texts){ctx.save();ctx.globalAlpha=Math.min(1,t.life*3);ctx.textAlign='center';ctx.font=`${Math.round(t.size*.65)}px Pixel, monospace`;ctx.strokeStyle='#142219';ctx.lineWidth=5;ctx.strokeText(t.text,clamp(t.x,170,1110),t.y);ctx.fillStyle=t.color;ctx.fillText(t.text,clamp(t.x,170,1110),t.y);ctx.restore();}
  const vignette=ctx.createRadialGradient(640,360,220,640,360,760);vignette.addColorStop(0,'#06130d00');vignette.addColorStop(1,'#06130d80');ctx.fillStyle=vignette;ctx.fillRect(0,0,1280,720);
  ctx.fillStyle='#e4e5bd70';ctx.font='8px Pixel, monospace';ctx.textAlign='left';ctx.fillText(arena==='rio'?'RIO DE JANEIRO / BRASIL':'BRASÍLIA / BRASIL',30,697);ctx.textAlign='right';ctx.fillText('BRASIL FIGHTERS ’04',1250,697);ctx.restore();
}
if(window.AndroidApp){$('android-join').hidden=false;$('android-join').onclick=()=>window.AndroidApp.connectWifi();$('lan-button').hidden=true;}
$('lan-button').onclick=async()=>{try{const [created,info]=await Promise.all([fetch('/lan/create',{method:'POST'}).then(r=>r.json()),fetch('/lan/info').then(r=>r.json())]);lanRoom=created;lanConnected=false;mode='lan';$('mode-button').innerHTML='1P <span>VS</span> WI-FI';const host=info.ips[0]||location.hostname;const link=`${location.protocol}//${host}:${location.port||3000}/controle.html?room=${created.code}`;$('lan-status').textContent=`No outro aparelho conectado ao mesmo Wi-Fi, abra: ${link} — depois inicie a luta aqui.`;}catch{$('lan-status').textContent='Não foi possível criar a sala. Inicie o jogo pelo servidor Node.';}};
setInterval(async()=>{if(!lanRoom||lanPollBusy)return;lanPollBusy=true;try{const r=await fetch(`/lan/${lanRoom.code}/input`,{headers:{'X-Host-Token':lanRoom.host}});if(!r.ok)throw Error();const data=await r.json();lanInput=data.input;lanConnected=data.guest;}catch{lanConnected=false;}finally{lanPollBusy=false;}},75);
setInterval(async()=>{if(!lanRoom||mode!=='lan'||screen!=='battle'||lanFrameBusy)return;lanFrameBusy=true;try{await fetch(`/lan/${lanRoom.code}/frame`,{method:'POST',headers:{'Content-Type':'application/json','X-Host-Token':lanRoom.host},body:JSON.stringify({image:canvas.toDataURL('image/jpeg',.55),p1:players[0].hp,p2:players[1].hp,timer:Math.ceil(remaining),stage:roundStage})});}catch{}finally{lanFrameBusy=false;}},200);
function loop(now){const dt=Math.min(.034,(now-last)/1000||0);last=now;update(dt);render();requestAnimationFrame(loop);}
load();requestAnimationFrame(loop);
