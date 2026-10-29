import {attack,activateMax,normalActions,specialActions,specialFor,clamp} from './fighters.js';

export const STEP=1/60;
// Directions are relative to the opponent: 2 down, 6 forward, 4 backward.
export function recordInput(f,intent,dt){
  f.inputTime+=dt;
  const horizontal=Number(!!intent.right)-Number(!!intent.left),relative=horizontal*f.facing;
  const direction=intent.down?(relative>0?3:relative<0?1:2):relative>0?6:relative<0?4:5;
  f.motion=f.motion.filter(entry=>f.inputTime-entry.time<.55);
  const changed=direction!==f.lastDirection;
  let dash=null;
  if(changed){
    f.motion.push({direction,time:f.inputTime});f.lastDirection=direction;
    if(direction===6){if(f.inputTime-f.lastForward<.24)dash='run';f.lastForward=f.inputTime;}
    if(direction===4){if(f.inputTime-f.lastBack<.24)dash='backdash';f.lastBack=f.inputTime;}
  }
  if(intent.down)f.lastDown=f.inputTime;
  return {horizontal,relative,direction,dash};
}
export function hasMotion(f,sequence){
  const recent=f.motion.filter(entry=>entry.direction!==5&&f.inputTime-entry.time<.5).map(entry=>entry.direction);
  return recent.slice(-sequence.length).join(',')===sequence.join(',');
}
export function commandFor(f,intent){
  const punch=intent.punch||intent.strongPunch,kick=intent.kick||intent.strongKick;
  if((punch||kick)&&hasMotion(f,[2,1,4]))return 'special2';
  if(punch&&hasMotion(f,[6,2,3]))return 'uppercut';
  if((punch||kick)&&hasMotion(f,[2,3,6]))return 'special';
  return null;
}
function startBackdash(f){
  if(f.y!==0||f.action!=='idle'||f.stun>0)return false;
  f.action='backdash';f.actionDuration=.28;f.actionTime=.28;f.cooldown=.32;f.dashFacing=f.facing;f.running=false;return true;
}
export function stepCombatant(f,intent,dt=STEP){
  const events=[];
  f.dodgeCooldown=Math.max(0,f.dodgeCooldown-dt);f.maxTime=Math.max(0,f.maxTime-dt);
  f.cooldown=Math.max(0,f.cooldown-dt);f.stun=Math.max(0,f.stun-dt);f.blockStun=Math.max(0,f.blockStun-dt);
  f.actionTime=Math.max(0,f.actionTime-dt);f.comboTimer-=dt;if(f.comboTimer<=0)f.combo=0;
  if(f.actionTime===0){
    if(f.action==='down'&&f.hp>0){f.action='rise';f.actionTime=.3;f.stun=.3;}
    else{f.action='idle';f.knockedDown=false;f.confirmed=false;f.armor=0;}
  }
  if(!f.blocking)f.guard=clamp(f.guard+dt*13,0,100);
  const input=recordInput(f,intent,dt);
  f.crouching=f.y===0&&!f.knockedDown&&(!!intent.down||(f.action==='special2'&&specialFor(f).type==='slide'));
  const wantsGuard=!!intent.block||input.relative<0;
  f.guardLow=f.crouching;
  f.blocking=f.y===0&&!f.knockedDown&&wantsGuard&&(f.action==='idle'||f.blockStun>0);
  // Holding a defense shortcut never prevents a requested attack when not in blockstun.
  if(f.blockStun===0&&['punch','kick','strongPunch','strongKick','special','special2','uppercut','sweep','grab','cast'].some(k=>intent[k]))f.blocking=false;
  if(f.hp>0){
    if(f.blockStun>0){
      const counter=intent.strongKick?'guardCounter':intent.dodge?'dodge':null;
      if(counter&&attack(f,counter))events.push({type:'attack',kind:counter});
    }else if(f.stun===0){
      if(input.dash==='backdash')startBackdash(f);
      if(input.dash==='run'&&f.action==='idle'&&f.y===0)f.running=true;
      if(intent.max&&activateMax(f))events.push({type:'max'});
      const motion=commandFor(f,intent);
      const newRequest=motion||(['special2','special','dodge','grab','uppercut','sweep','strongKick','strongPunch','kick','punch','cast'].find(k=>intent[k]));
      if(newRequest)f.inputBuffer={kind:newRequest,until:f.inputTime+.12,motion:!!motion};
      if(f.inputBuffer?.until<f.inputTime)f.inputBuffer=null;
      const requested=f.inputBuffer?.kind;
      if(requested&&attack(f,requested)){
        const kind=requested==='cast'?'special2':requested;
        if(f.inputBuffer.motion)f.motion=[];f.inputBuffer=null;
        f.running=false;events.push({type:'attack',kind,cancelled:f.cancelled});
      }
      if(f.action==='idle'&&(!f.blocking||(!intent.block&&input.relative<0&&f.blockStun===0))){
        if(input.relative<=0||f.crouching)f.running=false;
        if(f.y===0){
          const speed=(250+f.data.speed*12)*(f.running?1.6:input.relative<0?.72:1);
          f.vx=f.crouching?0:input.horizontal*speed;
          if(intent.jump){
            const superJump=f.inputTime-f.lastDown<.23;
            f.jumpType=superJump?'super':'normal';f.jumpAge=0;f.jumpHeld=true;
            f.vy=superJump?-780:-610;f.y=-1;f.crouching=false;
            f.vx=input.horizontal*(f.running?560:superJump?430:330);
            events.push({type:'jump',kind:f.jumpType});
          }
        }
      }
    }
  }
  if(f.action==='dodge')f.vx=f.dodgeFacing*420;
  else if(f.action==='backdash')f.vx=-f.dashFacing*470;
  else if(specialActions.includes(f.action)){
    const spec=specialFor(f);f.vx=f.actionTime>.16?(f.attackFacing||f.facing)*spec.advance:f.vx*Math.max(0,1-dt*12);
  }else if(f.action!=='idle'||f.stun>0)f.vx*=Math.max(0,1-dt*9);
  if(f.y<0){
    f.jumpAge+=dt;
    if(f.jumpHeld&&!intent.jumpHeld&&f.vy<0){
      if(f.jumpAge<.16){f.vy=Math.max(f.vy,f.jumpType==='super'?-450:-340);f.jumpType=f.jumpType==='super'?'superHop':'hop';}
      f.jumpHeld=false;
    }
  }
  // Projectiles are emitted once at the move's actual release frames.
  for(const shot of f.pendingShots){
    if(!shot.emitted&&specialActions.includes(f.action)&&f.attackId===shot.attackId&&f.actionDuration-f.actionTime>=shot.at){
      shot.emitted=true;const spec=shot.spec;
      events.push({type:'projectile',projectile:{owner:f,attackId:f.attackId,x:f.x+f.facing*75,y:f.y-(spec.type==='groundWave'?55:130),facing:f.facing,
        power:f.data.power,damage:spec.damage*(f.powered?1.12:1),color:f.data.effect,level:spec.level||'mid',size:spec.size,speed:spec.speed,
        life:1.8,kind:'special2',down:spec.type==='groundWave',style:f.data.id}});
    }
  }
  f.x=clamp(f.x+f.vx*dt,70,1210);
  if(f.y<0||f.vy!==0){
    f.vy+=1480*dt;f.y+=f.vy*dt;
    if(f.y>=0){f.y=0;f.vy=0;f.jumpHeld=false;events.push({type:'land'});}
  }
  f.walk+=Math.abs(f.vx)*dt*.065;
  return events;
}
