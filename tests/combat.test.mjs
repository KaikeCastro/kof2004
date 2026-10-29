import test from 'node:test';
import assert from 'node:assert/strict';
import { fighters, createCombatant, attack, resolveHit, resolveProjectile } from '../src/fighters.js';

test('roster contains all eight referenced characters',()=>{
  assert.equal(fighters.length,8);assert.equal(new Set(fighters.map(f=>f.id)).size,8);
  for(const f of fighters){assert.ok(f.special);assert.ok(f.power>=1&&f.power<=10);}
});
test('an attack damages only an opponent in front and in range, once per attack',()=>{
  const a=createCombatant(0,300,1),b=createCombatant(1,600,-1);
  assert.equal(attack(a,'punch'),true);a.actionTime=.18;
  assert.equal(resolveHit(a,b),null);b.x=400;
  assert.ok(resolveHit(a,b));const hp=b.hp;assert.ok(hp<100);
  assert.equal(resolveHit(a,b),null);assert.equal(b.hp,hp);
  a.hitTargets.clear();a.facing=-1;assert.equal(resolveHit(a,b),null);
});
test('guard reduces damage, but cannot be used airborne',()=>{
  function run(y){const a=createCombatant(0,300,1),b=createCombatant(1,400,-1);b.blocking=true;b.y=y;attack(a,'punch');a.actionTime=.18;return {hit:resolveHit(a,b),hp:b.hp};}
  const grounded=run(0),airborne=run(-30);assert.equal(grounded.hit.blocked,true);assert.equal(airborne.hit.blocked,false);assert.ok(grounded.hp>airborne.hp);
});
test('special needs energy and spends exactly 50, cannot bypass cooldown or stun',()=>{
  const a=createCombatant(7,300,1);assert.equal(attack(a,'special'),false);a.energy=70;
  assert.equal(attack(a,'special'),true);assert.equal(a.energy,20);assert.equal(attack(a,'punch'),false);
  a.cooldown=0;a.actionTime=0;a.stun=.2;assert.equal(attack(a,'punch'),false);
});
test('combat awards energy, clamps health and cannot hit an already defeated opponent',()=>{
  const a=createCombatant(6,300,1),b=createCombatant(0,400,-1);a.energy=100;b.hp=1;
  attack(a,'kick');a.actionTime=.2;assert.ok(resolveHit(a,b));assert.equal(b.hp,0);assert.equal(a.energy,100);
  a.hitTargets.clear();assert.equal(resolveHit(a,b),null);
});
test('gancho e rasteira atingem na distância correta e respeitam o tempo do golpe',()=>{
  for(const kind of ['uppercut','sweep']){
    const a=createCombatant(0,300,1),b=createCombatant(1,395,-1);
    assert.equal(attack(a,kind),true);a.actionTime=.25;
    assert.ok(resolveHit(a,b),`${kind} deve atingir o adversário`);
    assert.ok(b.hp<100);
    a.hitTargets.clear();a.actionTime=.01;
    assert.equal(resolveHit(a,b),null);
  }
});

test('lançamento acerta à distância, respeita altura e defesa',()=>{
  const target=createCombatant(1,600,-1), shot={x:600,y:-130,facing:1,power:8};
  assert.ok(resolveProjectile(shot,target));const damage=100-target.hp;assert.ok(damage>0);
  const blocked=createCombatant(1,600,-1);blocked.blocking=true;assert.ok(resolveProjectile(shot,blocked).blocked);assert.ok(100-blocked.hp<damage);
  assert.equal(resolveProjectile({...shot,y:-400},blocked),null);
});

test('teams enforce three unique fighters and advance only through the selected order',async()=>{
  const {createTeam,advanceTeam,teamDefeated}=await import('../src/fighters.js');
  for(const roster of [[0,0,1],[0,1],[0,1,99]])assert.throws(()=>createTeam(roster));
  const roster=[2,0,7],team=createTeam(roster);roster[0]=6;
  assert.equal(team.roster[team.active],2);
  assert.equal(advanceTeam(team),true);assert.equal(team.roster[team.active],0);
  assert.equal(advanceTeam(team),true);assert.equal(team.roster[team.active],7);
  assert.equal(teamDefeated(team),false);assert.equal(advanceTeam(team),false);assert.equal(teamDefeated(team),true);
});
test('a confirmed normal cancels into special, a whiff or blocked normal does not',()=>{
  for(const blocked of [false,true]){
    const a=createCombatant(0,300,1),b=createCombatant(1,400,-1);a.energy=60;
    attack(a,'punch');a.actionTime=.18;
    assert.equal(attack(a,'special'),false);
    b.blocking=blocked;resolveHit(a,b);
    assert.equal(attack(a,'special'),!blocked);
    if(!blocked){assert.equal(a.cancelled,true);assert.equal(a.energy,21);}
  }
});
test('dodge evades strikes and projectiles, has vulnerable recovery and cannot be spammed',()=>{
  const a=createCombatant(0,300,1),b=createCombatant(1,390,-1);
  attack(a,'punch');a.actionTime=.18;assert.equal(attack(b,'dodge'),true);
  assert.equal(resolveHit(a,b),null);
  assert.equal(resolveProjectile({x:390,y:-130,facing:1,power:7},b),null);
  b.actionTime=.08;assert.ok(resolveHit(a,b));
  b.actionTime=0;b.cooldown=0;b.stun=0;b.knockedDown=false;assert.equal(attack(b,'dodge'),false);
});
test('throws beat guard and dodge but cannot grab an airborne target or hit twice',()=>{
  for(const defense of ['guard','dodge']){
    const a=createCombatant(6,300,1),b=createCombatant(1,380,-1);
    if(defense==='guard')b.blocking=true;else attack(b,'dodge');
    assert.equal(attack(a,'grab'),true);a.actionTime=.3;
    b.y=-1;assert.equal(resolveHit(a,b),null);b.y=0;
    const hit=resolveHit(a,b);assert.ok(hit);assert.equal(hit.blocked,false);assert.equal(b.knockedDown,true);assert.equal(b.action,'down');
    const hp=b.hp;assert.equal(resolveHit(a,b),null);assert.equal(b.hp,hp);
  }
});
test('special profiles differ in reach, damage, duration and movement',async()=>{
  const {specialStyles}=await import('../src/fighters.js');
  assert.equal(specialStyles.length,8);
  assert.equal(new Set(specialStyles.map(p=>JSON.stringify(p))).size,8);
  const close=createCombatant(6,300,1),long=createCombatant(3,300,1);
  close.energy=long.energy=50;attack(close,'special');attack(long,'special');close.actionTime=long.actionTime=.3;
  assert.equal(resolveHit(close,createCombatant(0,550,-1)),null);
  assert.ok(resolveHit(long,createCombatant(0,550,-1)));
});

// These tests drive the same deterministic simulation used by keyboard, CPU and LAN.
const {stepCombatant,STEP,recordInput,commandFor}=await import('../src/combat.js');
const {normalFor,activateMax}=await import('../src/fighters.js');
function frames(f,count,intent={}){for(let n=0;n<count;n++)stepCombatant(f,intent,STEP);}
function liveHit(a,b,kind){
  assert.ok(attack(a,kind),kind);
  for(let n=0;n<75;n++){
    const events=stepCombatant(a,{},STEP);
    const hit=resolveHit(a,b);if(hit)return hit;
    for(const event of events)if(event.type==='projectile'){
      const shot=event.projectile;
      for(let tick=0;tick<90;tick++){shot.x+=shot.facing*shot.speed*STEP;const h=resolveProjectile(shot,b);if(h)return h;}
    }
  }
  return null;
}
test('all eight fighters have two named, mechanically distinct specials that actually hit',()=>{
  const names=[];
  for(let i=0;i<fighters.length;i++){
    assert.equal(fighters[i].specials.length,2);
    for(const [slot,kind] of ['special','special2'].entries()){
      const a=createCombatant(i,300,1),b=createCombatant((i+1)%8,410,-1);a.energy=100;
      names.push(fighters[i].specials[slot].name);
      const hit=liveHit(a,b,kind);
      assert.ok(hit,`${fighters[i].name}: ${kind} must land`);
      assert.ok(b.hp<100);assert.ok(a.energy<=61);
    }
  }
  assert.equal(new Set(names).size,16);
});
test('four normals work for each fighter while standing, crouching and airborne',()=>{
  for(let index=0;index<8;index++)for(const stance of ['stand','crouch','air'])for(const kind of ['punch','kick','strongPunch','strongKick']){
    const a=createCombatant(index,300,1),b=createCombatant((index+1)%8,390,-1);
    a.crouching=stance==='crouch';if(stance==='air')a.y=-30;
    assert.equal(attack(a,kind),true);assert.equal(a.stance,stance);
    const spec=normalFor(a);a.actionTime=spec.duration-spec.startup-.02;
    assert.ok(resolveHit(a,b),`${index} ${stance} ${kind}`);
  }
});
test('high guard loses to lows, low guard loses to air attacks, mid attacks allow either',()=>{
  for(const lowGuard of [false,true])for(const kind of ['low','high','mid']){
    const a=createCombatant(0,300,1),b=createCombatant(1,390,-1);
    b.blocking=true;b.guardLow=lowGuard;b.crouching=lowGuard;
    if(kind==='low')a.crouching=true;if(kind==='high')a.y=-30;
    attack(a,kind==='low'?'kick':'punch');const info=normalFor(a);a.actionTime=info.duration-info.startup-.02;
    const hit=resolveHit(a,b);assert.ok(hit);
    assert.equal(hit.blocked,kind==='mid'||(kind==='low'?lowGuard:!lowGuard),`${kind} ${lowGuard}`);
  }
  const f=createCombatant(0,300,1);
  stepCombatant(f,{left:true},STEP);assert.equal(f.blocking,true);assert.ok(f.vx<0,'back guard still permits walking backward');
  stepCombatant(f,{left:true,down:true},STEP);assert.equal(f.guardLow,true);assert.equal(f.vx,0);
  stepCombatant(f,{right:true},STEP);assert.equal(f.blocking,false);
});
test('normal chains require a confirmed light hit; repeated lights and whiffs do not cancel',()=>{
  const a=createCombatant(0,300,1),b=createCombatant(1,390,-1);
  attack(a,'punch');a.actionTime=.18;
  assert.equal(attack(a,'strongPunch'),false);
  resolveHit(a,b);
  assert.equal(attack(a,'punch'),false);
  assert.equal(attack(a,'strongPunch'),true);assert.equal(a.cancelled,true);
});
test('MAX consumes a stock, expires, discounts specials and enables special-to-special cancels',()=>{
  const a=createCombatant(1,300,1),b=createCombatant(0,400,-1);a.energy=100;
  assert.equal(activateMax(a),true);assert.equal(a.energy,50);assert.equal(a.maxTime,8);
  assert.equal(activateMax(a),false);
  assert.equal(attack(a,'special'),true);assert.equal(a.energy,25);
  a.actionTime=.4;resolveHit(a,b);assert.equal(a.confirmed,true);assert.equal(b.knockedDown,false);
  const energy=a.energy;assert.equal(attack(a,'special'),false);assert.equal(a.energy,energy);
  assert.equal(attack(a,'special2'),true);assert.equal(a.energy,energy-25);
  frames(a,500);assert.equal(a.maxTime,0);
  const poor=createCombatant(0,300,1);poor.energy=49;assert.equal(activateMax(poor),false);assert.equal(poor.energy,49);
});
test('directional commands are recognized on both sides and cannot reuse an old motion',()=>{
  for(const facing of [1,-1])for(const [motion,expected] of [[[2,3,6],'special'],[[2,1,4],'special2'],[[6,2,3],'uppercut']]){
    const f=createCombatant(0,300,facing);
    for(const direction of motion){const forward=[3,6].includes(direction),back=[1,4].includes(direction);recordInput(f,{down:[1,2,3].includes(direction),right:(forward&&facing===1)||(back&&facing===-1),left:(forward&&facing===-1)||(back&&facing===1)},.07);}
    assert.equal(commandFor(f,{punch:true}),expected);
    recordInput(f,{},.6);assert.equal(commandFor(f,{punch:true}),null);
  }
});
test('double forward runs, double backward retreats, and holding direction cannot retrigger',()=>{
  const run=createCombatant(0,500,1);stepCombatant(run,{right:true},STEP);const walkSpeed=run.vx;
  stepCombatant(run,{},STEP);stepCombatant(run,{right:true},STEP);assert.equal(run.running,true);assert.ok(run.vx>walkSpeed*1.5);
  frames(run,20,{right:true});assert.equal(run.action,'idle');
  const retreat=createCombatant(0,500,1);stepCombatant(retreat,{left:true},STEP);stepCombatant(retreat,{},STEP);stepCombatant(retreat,{left:true},STEP);
  assert.equal(retreat.action,'backdash');assert.ok(retreat.vx< -400);
  frames(retreat,60,{left:true});assert.equal(retreat.action,'idle');
});
test('hop, normal jump, super jump and super hop have distinct trajectories',()=>{
  function trajectory(superJump,release){
    const f=createCombatant(0,500,1);if(superJump)stepCombatant(f,{down:true},STEP);
    stepCombatant(f,{jump:true,jumpHeld:true},STEP);let apex=f.y;
    for(let n=0;n<100;n++){stepCombatant(f,{jumpHeld:n<release},STEP);apex=Math.min(apex,f.y);}
    return {apex,type:f.jumpType,y:f.y};
  }
  const hop=trajectory(false,1),normal=trajectory(false,30),superJump=trajectory(true,40),superHop=trajectory(true,1);
  assert.equal(hop.type,'hop');assert.equal(normal.type,'normal');assert.equal(superJump.type,'super');assert.equal(superHop.type,'superHop');
  assert.ok(hop.apex>normal.apex);assert.ok(superJump.apex<normal.apex);assert.ok(superHop.apex>superJump.apex);
  for(const jump of [hop,normal,superJump,superHop])assert.equal(jump.y,0);
});
test('guard can break and guard counters spend exactly one stock',()=>{
  const a=createCombatant(0,300,1),b=createCombatant(1,390,-1);b.blocking=true;b.guard=1;
  attack(a,'strongPunch');a.actionTime=.25;const hit=resolveHit(a,b);
  assert.equal(hit.guardBreak,true);assert.equal(b.action,'guardBreak');assert.equal(b.blocking,false);
  for(const kind of ['dodge','guardCounter']){
    const f=createCombatant(0,300,1);f.blocking=true;f.stun=.16;f.blockStun=.16;f.energy=50;
    assert.equal(attack(f,kind),true);assert.equal(f.energy,0);assert.equal(f.stun,0);
  }
  const f=createCombatant(0,300,1);f.blockStun=.16;f.stun=.16;f.energy=49;assert.equal(attack(f,'guardCounter'),false);
});
test('a short input buffer starts a move at the end of recovery but stale commands expire',()=>{
  const f=createCombatant(0,300,1);f.cooldown=.08;
  stepCombatant(f,{strongPunch:true},STEP);assert.equal(f.action,'idle');
  frames(f,5);assert.equal(f.action,'strongPunch');
  const stale=createCombatant(0,300,1);stale.cooldown=.5;stepCombatant(stale,{strongPunch:true},STEP);frames(stale,40);assert.equal(stale.action,'idle');
});
test('projectile techniques emit the right number of shots and cannot emit after interruption',()=>{
  for(const [index,count] of [[2,1],[3,1],[6,1],[7,2]]){
    const f=createCombatant(index,300,1);f.energy=50;attack(f,'special2');let emitted=[];
    for(let n=0;n<100;n++)emitted.push(...stepCombatant(f,{},STEP).filter(e=>e.type==='projectile'));
    assert.equal(emitted.length,count);
    const interrupted=createCombatant(index,300,1);interrupted.energy=50;attack(interrupted,'special2');interrupted.action='hurt';interrupted.actionTime=.3;
    for(let n=0;n<100;n++)assert.equal(stepCombatant(interrupted,{},STEP).filter(e=>e.type==='projectile').length,0);
  }
});
test('Bruno can absorb one non-throw hit during his armored technique',()=>{
  const bruno=createCombatant(6,390,-1),a=createCombatant(0,300,1);bruno.energy=50;attack(bruno,'special');attack(a,'punch');a.actionTime=.18;
  const hit=resolveHit(a,bruno);assert.equal(hit.armored,true);assert.equal(bruno.action,'special');assert.equal(bruno.armor,0);assert.ok(bruno.hp<100);
});


test('every fighter can MAX-cancel a confirmed first power into the second, including rising attacks',()=>{
  for(let index=0;index<8;index++){
    const a=createCombatant(index,300,1),b=createCombatant((index+1)%8,410,-1);
    a.energy=100;assert.equal(activateMax(a),true);
    assert.ok(liveHit(a,b,'special'),fighters[index].name);
    assert.equal(b.knockedDown,false);
    const energy=a.energy;
    assert.equal(attack(a,'special2'),true,fighters[index].name);
    assert.equal(a.cancelled,true);assert.equal(a.energy,energy-25);
  }
});
