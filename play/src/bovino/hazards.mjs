// Gameplay-only hazards. Rendering must use the approved Makko prop assets.
export function canister(owner, dropped = false) {
  return {kind:'bovino-canister', ownerId:owner.id, x:owner.x+(dropped?0:owner.facing*(owner.kind==='bovino'?48:30)), y:owner.y,
    z:dropped ? 16 : owner.kind==='bovino' ? 155 : 76, vx:dropped ? 0 : owner.facing*210,
    vz:dropped ? 0 : 160, age:0, fuse:dropped ? .12 : .8,
    active:false, life:2.3, hitIds:new Set(), dropped};
}
export function soundwave(owner) {
  return {kind:'bovino-soundwave', ownerId:owner.id, x:owner.x,
    y:owner.y,z:owner.kind==='bovino'?155:76,vx:owner.facing*250,age:0,life:1.1,hitIds:new Set()};
}
export function updateHazard(h, dt, actors, hit) {
  dt=Math.max(0,Math.min(dt,.1));
  h.age+=dt; h.life-=dt;
  if(h.life<=0) return false;
  if(h.kind==='bovino-canister') {
    if(!h.active) {
      h.x+=h.vx*dt; h.z=Math.max(0,h.z+h.vz*dt); h.vz-=500*dt;
      if(h.age>=h.fuse && h.z===0) {h.active=true;h.vx=0;}
    }
    if(!h.active) return true;
    for(const a of actors) {
      if(!a.alive || h.hitIds.has(a.id) || a.z>45) continue;
      // Only an interrupted throw backfires; ordinary throws cannot clear allies for the player.
      if(a.team!=='player' && !(h.dropped && a.id===h.ownerId)) continue;
      if(Math.abs(a.x-h.x)>62 || Math.abs(a.y-h.y)>32) continue;
      if(hit(a,{dmg:a.id===h.ownerId?14:8,stun:.28,kb:70,kind:'gas'})) h.hitIds.add(a.id);
    }
  } else {
    h.x+=h.vx*dt;
    for(const a of actors) {
      if(!a.alive || a.team!=='player' || h.hitIds.has(a.id) || a.z>65) continue;
      if(Math.abs(a.x-h.x)>34 || Math.abs(a.y-h.y)>25) continue;
      if(hit(a,{dmg:7,stun:.2,kb:125,kind:'soundwave'})) h.hitIds.add(a.id);
    }
  }
  return true;
}

