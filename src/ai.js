// CPU decisions are made at fixed intervals; one-shot actions are never held.
export function decideAI(f,opponent,projectiles,difficulty,random=Math.random){
  const distance=Math.abs(f.x-opponent.x), roll=random(), hard=difficulty==='hard',easy=difficulty==='easy';
  const reflex=hard?.8:easy?.2:.5;
  const projectile=projectiles.some(p=>p.owner===opponent&&(f.x-p.x)*p.facing>0&&Math.abs(p.x-f.x)<250);
  const threat=projectile||(opponent.actionTime>0&&distance<200&&opponent.action!=='idle');
  if(f.blockStun>0&&f.energy>=50&&hard&&roll<.2)return {dodge:true};
  if(f.confirmed&&f.energy>=50&&f.cpuCancelAttackId!==f.attackId){
    f.cpuCancelAttackId=f.attackId;if(roll<(hard?.65:easy?.08:.3))return {special:true};
  }
  if(threat&&roll<reflex)return {block:true,down:opponent.stance==='crouch'||opponent.action==='sweep'};
  if(f.action!=='idle'||f.cooldown>0||f.stun>0)return {};
  if(distance>150){
    if(f.energy>=50&&roll<(hard?.36:easy?.08:.18))return {special2:true};
    return {left:f.x>opponent.x,right:f.x<opponent.x,jump:roll>.93,jumpHeld:roll>.93};
  }
  if(f.energy>=75&&!f.maxTime&&hard&&roll>.92)return {max:true};
  if(distance<90&&roll>.86)return {grab:true};
  if(f.energy>=50&&roll<.18)return {special:true};
  if(distance<125&&roll<.5)return {punch:true};
  if(roll<.7)return {kick:true};
  if(roll<.85)return {strongPunch:true};
  return {strongKick:true};
}
