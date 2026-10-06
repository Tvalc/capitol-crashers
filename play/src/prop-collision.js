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
