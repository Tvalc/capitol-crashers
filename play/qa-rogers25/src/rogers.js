// The phone call telegraphs a committed lane. The player can sidestep, then
// punish the unanswered-phone recovery. Damage is supplied by the game.
export function updateRogers(enemy, player, dt, strike) {
  const enter = state => { enemy.state = state; enemy.stateT = 0; enemy.vx = enemy.vy = 0; };
  enemy.stateT += dt;
  if (enemy.state === 'orders') {
    enemy.vx = enemy.vy = 0;
    if (enemy.stateT >= 1.25) { enter('charge'); enemy.swingHits = new Set(); }
    return;
  }
  if (enemy.state === 'charge') {
    enemy.vx = enemy.facing * 340; enemy.vy = 0;
    enemy.x += enemy.vx * dt;
    strike();
    if (enemy.stateT >= .7) enter('bill');
    return;
  }
  if (enemy.state === 'bill') {
    enemy.vx = enemy.vy = 0;
    if (enemy.stateT >= 3.0) { enter('idle'); enemy.attackCd = .85; }
    return;
  }
  const dx = player.x - enemy.x, dy = player.y - enemy.y;
  enemy.facing = Math.sign(dx) || enemy.facing;
  if (enemy.attackCd <= 0 && Math.abs(dx) < 470 && Math.abs(dy) < 24) {
    enter('orders');
    return;
  }
  enemy.vx = Math.abs(dx) > 220 ? Math.sign(dx) * 90 : 0;
  enemy.vy = Math.abs(dy) > 10 ? Math.sign(dy) * 60 : 0;
  enemy.x += enemy.vx * dt; enemy.y += enemy.vy * dt;
  enemy.state = enemy.vx || enemy.vy ? 'walk' : 'idle';
}
