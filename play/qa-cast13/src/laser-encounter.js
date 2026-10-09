import { spawnSatellite } from './weapons.js?v=laser22b';

// Operators are scenery, never members of game.enemies or any damage target list.
export function addLaserEncounter(game, makeEnemy, x) {
  const left = game.lockCam ?? game.cameraX ?? 0;
  const center = Math.max(left + 320, Math.min(left + 840, x));
  const relays = [-190, 0, 190].map((dx, i) => {
    const relay = makeEnemy('laser_relay', center + dx, 530 + (i % 2) * 95);
    relay.laserCd = 1.8 + i * 1.1;
    return relay;
  });
  const operator = { kind:'greene', sprite:'greene', team:'scenery', untargetable:true,
    x:Math.min(left+1100,center+330), y:335, z:0, facing:-1, state:'idle', stateT:0, anim:0, alive:true,
    relays, homeX:center, exitT:0, castT:0, scale:.55 };
  (game.laserOperators ??= []).push(operator);
  game.enemies.push(...relays);
  game.banner='Break the three laser relays'; game.bannerT=3;
  return operator;
}

export function updateLaserEncounters(game, dt) {
  for (const operator of game.laserOperators || []) {
    operator.anim += dt; operator.stateT += dt;
    const active = operator.relays.filter(r => r.alive);
    if (!active.length) {
      if (!operator.exitT) {
        game.banner='Laser network offline'; game.bannerT=2.2;
      }
      operator.exitT += dt; operator.state='run'; operator.facing=1;
      operator.x += dt * 110;
      operator.alive=operator.exitT<3;
      continue;
    }
    operator.castT=Math.max(0,operator.castT-dt);
    operator.state=operator.castT>0?'special':'idle';
    for (const relay of active) {
      if (!game.player?.alive) continue;
      relay.laserCd -= dt;
      if (relay.laserCd>0) continue;
      relay.laserCd=5.2;
      operator.castT=.8;operator.state='special';operator.stateT=0;
      spawnSatellite(game,game.player.x,game.player.y,10);
      const shot=game.projectiles.at(-1);
      shot.sourceRelay=relay.id;
    }
  }
  // Destroying a relay also cancels its already telegraphed strike.
  for (const shot of game.projectiles) if (shot.sourceRelay &&
    !game.enemies.some(e=>e.id===shot.sourceRelay&&e.alive)) shot.alive=false;
}

