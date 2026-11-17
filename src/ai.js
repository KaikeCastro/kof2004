// The same combat rules apply to CPU and players; only decision speed and choices differ.
export const difficulties={
  easy:{delay:.52,jitter:.2,guard:.16,cancel:.05,projectile:.06,counter:0,antiair:0,max:0},
  normal:{delay:.32,jitter:.16,guard:.38,cancel:.22,projectile:.16,counter:.05,antiair:.08,max:0},
  hard:{delay:.21,jitter:.12,guard:.62,cancel:.44,projectile:.28,counter:.14,antiair:.22,max:.12},
  expert:{delay:.13,jitter:.08,guard:.82,cancel:.7,projectile:.4,counter:.28,antiair:.38,max:.24},
};
export function aiSettings(level){return difficulties[level]||difficulties.normal;}
export function decideAI(f,opponent,projectiles,difficulty,random=Math.random){
  const config=aiSettings(difficulty),distance=Math.abs(f.x-opponent.x),roll=random();
  const projectile=projectiles.find(p=>p.owner===opponent&&(f.x-p.x)*p.facing>0&&Math.abs(p.x-f.x)<250);
  const threatening=['punch','kick','strongPunch','strongKick','uppercut','sweep','grab','special','special2','super','guardCounter'].includes(opponent.action);
  const threat=projectile||(opponent.actionTime>0&&distance<200&&threatening);
  if(f.blockStun>0&&f.energy>=50&&roll<config.counter)return roll<config.counter/2?{strongKick:true}:{dodge:true};
  if(f.confirmed&&f.energy>=50&&f.cpuCancelAttackId!==f.attackId){
    f.cpuCancelAttackId=f.attackId;if(roll<config.cancel)return {special:true};
  }
  if(threat&&roll<config.guard){
    const isLow=projectile?projectile.level==='low':opponent.stance==='crouch'||opponent.action==='sweep';
    return {block:true,down:isLow};
  }
  if(f.action!=='idle'||f.cooldown>0||f.stun>0)return {};
  if(opponent.y< -35&&distance<145&&roll<config.antiair&&f.y===0)return {uppercut:true};
  if(distance>150){
    if(f.energy>=50&&roll<config.projectile)return {special2:true};
    return {left:f.x>opponent.x,right:f.x<opponent.x,jump:roll>.96,jumpHeld:roll>.96};
  }
  if(f.energy>=75&&!f.maxTime&&roll<config.max)return {max:true};
  if(distance<90&&roll>.87)return {grab:true};
  if(f.energy>=50&&roll<.18)return {special:true};
  if(distance<125&&roll<.5)return {punch:true};
  if(roll<.7)return {kick:true};
  if(roll<.85)return {strongPunch:true};
  return {strongKick:true};
}
