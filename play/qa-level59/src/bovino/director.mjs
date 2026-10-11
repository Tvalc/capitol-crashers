import {beginAction, tickActor} from './encounter.mjs';

// Position decisions are returned to the game's existing prop-collision solver.
// Attacks commit to a facing/lane during the tell, so every attack is dodgeable.
export function directActor(actor, player, peers, dt, bounds) {
  if (!Number.isFinite(dt) || dt <= 0) return {events:[], dx:0, dy:0};
  dt=Math.min(dt,.1);
  const events=tickActor(actor,dt);
  if (actor.action!=='idle' || actor.hp<=0 || !player?.alive)
    return {events,dx:0,dy:0};
  actor.cooldown=Math.max(0,(actor.cooldown??.8)-dt);
  const dx=player.x-actor.x, dy=player.y-actor.y;
  actor.facing=dx<0?-1:1;
  const slot=(actor.sequence??0)%4;
  const preferred=actor.phase==='coat'?185:145+slot*28;
  // Stagger depth positions while closing, rather than forming an invincible pile.
  const lane=Math.max(bounds.top,Math.min(bounds.bottom,player.y+(slot-1.5)*14));
  const active=peers.filter(a=>a!==actor && a.hp>0 && ['throw','shout'].includes(a.action)).length;
  if (actor.cooldown===0 && active<2 && Math.abs(dx)<310 && Math.abs(dy)<32) {
    const action=((actor.attacks??0)+slot)%3===2?'shout':'throw';
    if (beginAction(actor,action)) {
      actor.attacks=(actor.attacks??0)+1;
      actor.cooldown=1.35+slot*.22;
      events.push({type:'tell',action,facing:actor.facing,lane:actor.y});
    }
    return {events,dx:0,dy:0};
  }
  const speed=actor.phase==='coat'?62:98;
  // Retreat only a short distance when crowded; no endless keep-away.
  const horizontal=Math.abs(dx)>preferred+25?actor.facing:
    Math.abs(dx)<70?-actor.facing:0;
  const nx=Math.max(bounds.left,Math.min(bounds.right,actor.x+horizontal*speed*dt));
  const ny=Math.max(bounds.top,Math.min(bounds.bottom,actor.y+Math.max(-1,Math.min(1,(lane-actor.y)/16))*speed*.7*dt));
  return {events,dx:nx-actor.x,dy:ny-actor.y};
}
