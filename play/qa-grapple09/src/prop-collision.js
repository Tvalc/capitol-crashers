// Collision uses ground footprints, never the tall painted silhouette.
// Characters with feet above/below the footprint can pass behind/in front.
export function propFootprints(stage) {
  const result = (stage.props || []).map(p => ({x:p.x, y:p.y-8, rx:p.w*.43, ry:12}));
  for (const p of stage.scenery || []) {
    let width=.40, depth=12;
    if (p.art.includes('lamp')) { width=.16; depth=7; }
    else if (p.art.includes('bench')) { width=.43; depth=14; }
    else if (p.art.includes('bus-stop')) { width=.44; depth=13; }
    else if (p.art.includes('planter')) { width=.34; depth=13; }
    result.push({x:p.x,y:p.y-depth,rx:p.w*width,ry:depth});
  }
  return result;
}

export function collideProps(ent, before, boxes) {
  if (!before || ent.state==='held' || ent.state==='grabbed') return;
  const targetX=ent.x, targetY=ent.y;
  const dx=targetX-before.x, dy=targetY-before.y;
  // Small swept steps prevent fast lunges/throws tunnelling through a base.
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/6));
  let x=before.x,y=before.y;
  const rx=12,ry=7;
  const inside=(px,py,b)=>Math.abs(px-b.x)<b.rx+rx && Math.abs(py-b.y)<b.ry+ry;
  for(let i=0;i<steps;i++) {
    let nx=x+dx/steps;
    for(const b of boxes) if(inside(nx,y,b)) {
      if(x<=b.x-b.rx-rx) nx=b.x-b.rx-rx;
      else if(x>=b.x+b.rx+rx) nx=b.x+b.rx+rx;
      else { // Spawn/help placement within a base: exit by the nearest edge.
        const left=b.x-b.rx-rx,right=b.x+b.rx+rx;
        nx=Math.abs(nx-left)<Math.abs(nx-right)?left:right;
      }
    }
    x=nx;
    let ny=y+dy/steps;
    for(const b of boxes) if(inside(x,ny,b)) ny=y<=b.y?b.y-b.ry-ry:b.y+b.ry+ry;
    y=ny;
  }
  ent.x=x;ent.y=y;
}

// Keep a chosen lane until the whole footprint is passed; recomputing the
// nearest side every tick makes followers oscillate against the obstacle.
export function steerAroundProps(ent, before, boxes, dt, top, bottom) {
  if (!dt || ent.team === 'player' || ent.z > 0 || !['walk','run','follow','leaving','chase','idle'].includes(ent.state)) return;
  const dx=ent.x-before.x, dy=ent.y-before.y;
  if (Math.hypot(dx,dy)<.01) return;
  const direction=Math.sign(dx) || ent.facing || 1;
  let route=ent.propRoute;
  if (route && (direction!==route.direction || direction*(before.x-route.exitX)>=0)) route=ent.propRoute=null;
  if (!route) {
    const candidates=boxes.filter(b => direction*(b.x-before.x)>=-b.rx-14 && direction*(b.x-before.x)<b.rx+38 && Math.abs(before.y-b.y)<b.ry+16);
    candidates.sort((a,b)=>Math.abs(a.x-before.x)-Math.abs(b.x-before.x));
    const b=candidates[0];
    if (!b) return;
    const lanes=[b.y-b.ry-16,b.y+b.ry+16].filter(y=>y>=top && y<=bottom);
    if (!lanes.length) return;
    lanes.sort((a,b)=>Math.abs(a-before.y)-Math.abs(b-before.y));
    route=ent.propRoute={direction,lane:lanes[0],exitX:b.x+direction*(b.rx+22)};
  }
  const speed=Math.max(90,Math.hypot(dx,dy)/dt);
  const step=Math.sign(route.lane-before.y)*Math.min(Math.abs(route.lane-before.y),speed*dt);
  ent.y=before.y+step;
  ent.x=Math.abs(route.lane-ent.y)>1 ? before.x : before.x+direction*speed*dt;
  ent.vx=(ent.x-before.x)/dt; ent.vy=step/dt;
}
