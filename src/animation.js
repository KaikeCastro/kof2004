// Visual choreography only: combat timing and hitboxes remain authoritative.
export const choreography = [
  {lean:-.09,lunge:25,spin:.06,lift:12,pattern:'flame'},
  {lean:.08,lunge:15,spin:.32,lift:8,pattern:'ribbon'},
  {lean:-.17,lunge:32,spin:.12,lift:5,pattern:'graffiti'},
  {lean:.06,lunge:12,spin:.1,lift:10,pattern:'wave'},
  {lean:-.14,lunge:30,spin:.08,lift:6,pattern:'electric'},
  {lean:.09,lunge:17,spin:.22,lift:4,pattern:'hat'},
  {lean:-.2,lunge:19,spin:.04,lift:3,pattern:'impact'},
  {lean:-.12,lunge:24,spin:.08,lift:5,pattern:'seal'},
];
const secondaryPatterns=['impact','wave','electric','ribbon','flame','shadow','rocks','receipt'];
const clamp01=n=>Math.max(0,Math.min(1,n));
export function animationPose(f){
  const profile=choreography[f.index]||choreography[0];
  const duration=f.actionDuration||0, progress=duration?clamp01(1-f.actionTime/duration):0;
  const pulse=Math.sin(Math.PI*progress), special=['special','special2','super'].includes(f.action);
  const kick=['kick','strongKick','sweep'].includes(f.action), punch=['punch','strongPunch','uppercut','grab'].includes(f.action);
  const attack=kick||punch||special;
  const power=f.action==='strongKick'||f.action==='strongPunch'?1.25:special?1.5:1;
  return {progress,pattern:f.action==='special2'?secondaryPatterns[f.index]:profile.pattern,second:f.action==='special2',
    shift:attack?profile.lunge*pulse*power:0,
    lift:attack?profile.lift*pulse*(f.y<0?.3:1):0,
    rotation:attack?(profile.lean+(kick?profile.spin:0))*pulse:0,
    squash:attack?1+(.035+profile.lunge/1100)*pulse:1};
}
// Restrained motion trails sit behind the fighter; they never determine damage.
export function drawPowerEffect(c,f,time){
  if(!['special','special2','super'].includes(f.action)||f.actionTime<=.08)return;
  const pose=animationPose(f),p=pose.progress,second=pose.second;
  const pulse=Math.sin(Math.PI*p);if(pulse<=0)return;
  const spec=f.data.specials[second?1:0],reach=Math.min(180,spec.reach||100);
  const low=spec.level==='low',originY=low?-60:-130;
  const shape=[-.8,.55,-.25,.25,-.5,.35,-.08,-.35][f.index];
  c.save();c.translate(f.x,550+f.y);c.scale(f.facing,1);
  c.globalAlpha=pulse*.48;c.strokeStyle=f.data.effect;c.shadowColor=f.data.effect;c.shadowBlur=8;c.lineCap='round';
  for(let layer=0;layer<3;layer++){
    const offset=(layer-1)*14,tip=40+reach*(.3+p*.55);
    c.lineWidth=layer===1?6:3;c.beginPath();
    c.moveTo(15-layer*8,originY+offset+35);
    c.quadraticCurveTo(tip*.55,originY+offset+shape*55,tip,originY+offset-35*shape);
    c.stroke();
  }
  if(p>.18&&p<.78){
    c.globalAlpha=pulse*.6;c.fillStyle='#fff5d5';
    for(let i=0;i<4;i++){
      const x=35+reach*(.25+p*.45)+i*8;
      const y=originY+(i-2)*13+Math.sin(time*13+i+f.index)*5;
      c.fillRect(Math.round(x),Math.round(y),3,3);
    }
  }
  c.restore();
}
