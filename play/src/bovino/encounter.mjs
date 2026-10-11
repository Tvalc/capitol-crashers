// Pure encounter rules; game adapter and approved sprite clips remain separate.
export const TIMING = Object.freeze({ throwWindup: .72, shoutWindup: .85, recovery: .9, split: 1.1 });
export function createCoat() {
  return { phase: 'coat', hp: 100, action: 'idle', t: 0, splitStarted: false, spawned: false, sequence: 0 };
}
export function beginAction(actor, action) {
  if (actor.action !== 'idle' || !['throw', 'shout'].includes(action)) return false;
  actor.action = action; actor.t = 0; actor.released = false;
  return true;
}
export function hitActor(actor, damage) {
  const events = [];
  if (actor.action === 'split' || actor.phase === 'gone' || actor.hp <= 0) return events;
  if (actor.action === 'throw' && !actor.released) {
    events.push({ type: 'drop-canister', selfDamage: 14 });
    // The dropped cloud applies self-damage on detonation, not twice here.
  }
  actor.hp = Math.max(0, actor.hp - damage);
  actor.action = 'hurt'; actor.t = 0;
  if (actor.phase === 'coat' && actor.hp === 0 && !actor.splitStarted) {
    actor.splitStarted = true; actor.action = 'split';
    events.push({ type: 'coat-knocked-off' });
  } else if (!actor.hp) { actor.action = 'dead'; events.push({type:'defeated'}); }
  return events;
}
export function tickActor(actor, dt) {
  const events = [];
  actor.t += Math.max(0, dt);
  if (actor.action === 'split' && actor.t >= TIMING.split && !actor.spawned) {
    actor.spawned = true; actor.phase = 'gone'; actor.action = 'dead';
    events.push({type:'spawn-minis', minis:Array.from({length:4}, (_,i)=>({
      phase:'mini', hp:32, action:'idle', t:0, sequence:i, cooldown:.7+i*.45,
      offsetX:(i-1.5)*64, offsetY:i%2 ? 28 : -28
    }))});
  } else if (actor.action === 'throw' || actor.action === 'shout') {
    const windup = actor.action === 'throw' ? TIMING.throwWindup : TIMING.shoutWindup;
    if (!actor.released && actor.t >= windup) {
      actor.released = true;
      events.push({type:actor.action === 'throw' ? 'throw-canister' : 'soundwave'});
    }
    if (actor.t >= windup + TIMING.recovery) { actor.action='idle'; actor.t=0; }
  } else if (actor.action === 'hurt' && actor.t >= .3) { actor.action='idle'; actor.t=0; }
  return events;
}

