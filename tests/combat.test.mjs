import test from 'node:test';
import assert from 'node:assert/strict';
import { fighters, createCombatant, attack, resolveHit } from '../src/fighters.js';

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
