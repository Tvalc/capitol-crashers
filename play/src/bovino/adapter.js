import { directActor } from './director.mjs';
import { canister, soundwave, updateHazard } from './hazards.mjs';

export const isBovino = e => e?.kind === 'bovino' || e?.kind === 'bovino_mini';
function brain(e) {
  return e.bovino ||= {phase:e.kind==='bovino'?'coat':'mini',action:'idle',t:0,
    sequence:e.bovinoSlot||0,cooldown:.8+(e.bovinoSlot||0)*.45};
}
function launch(game,e,dropped=false) {
  (game.bovinoHazards ||= []).push(canister(e,dropped));
}
// Called only after the combat engine has accepted a hit, before changing pose.
export function interruptBovino(game,e) {
  if(!isBovino(e))return;
  const b=brain(e);
  if(b.action==='throw'&&!b.released){launch(game,e,true);b.released=true;}
  b.action='idle';b.t=0;b.cooldown=.9;
}
export function splitBovino(game,e) {
  if(e.kind!=='bovino'||e.bovino?.spawned)return false;
  const b=brain(e);b.action='split';b.t=0;b.splitStarted=true;
  e.state='bovinoSplit';e.stateT=0;e.vx=e.vy=e.vz=e.z=0;
  e.alive=true;e.untargetable=true;e.chip=0;
  if(game.player?.grabId===e.id){game.player.grabId=null;game.player.state='idle';game.player.stateT=0;}
  game.banner='FOUR SMALL MEN. ONE BIG COAT.';game.bannerT=2;
  return true;
}
export function updateBovino(e,game,dt,makeEnemy) {
  const b=brain(e);
  Object.assign(b,{id:e.id,hp:e.hp,x:e.x,y:e.y,facing:e.facing});
  const peers=game.enemies.filter(isBovino).map(other=>{
    const p=brain(other);p.hp=other.hp;return p;
  });
  const decision=directActor(b,game.player,peers,dt,{left:(game.cameraX||0)+45,
    right:Math.min(game.stage.length-45,(game.cameraX||0)+1235),top:470,bottom:635});
  e.x+=decision.dx;e.y+=decision.dy;e.facing=b.facing;
  e.vx=decision.dx/dt;e.vy=decision.dy/dt;e.stateT=b.t;
  e.state=b.action==='split'?'bovinoSplit':b.action==='throw'?'bovinoThrow':
    b.action==='shout'?'bovinoShout':decision.dx||decision.dy?'walk':'idle';
  for(const event of decision.events){
    if(event.type==='throw-canister')launch(game,e);
    if(event.type==='soundwave')(game.bovinoHazards||=[]).push(soundwave(e));
    if(event.type==='spawn-minis'){
      e.alive=false;e.state='dead';e.deadT=0;
      (game.bovinoCoats||=[]).push({x:e.x,y:e.y,z:90,age:0,life:1.5,facing:e.facing});
      for(const [i,mini] of event.minis.entries()){
        const child=makeEnemy('bovino_mini',e.x+mini.offsetX,e.y+mini.offsetY);
        child.bovinoSlot=i;child.bovino={...mini};child.invuln=.35;
        child.z=40+i*17;child.vz=150;child.state='air';
        game.pending.push(child);
      }
    }
  }
}
export function updateBovinoHazards(game,dt,hit){
  const previous=game.bovinoHazards||[];game.bovinoHazards=[];
  for(const h of previous){
    if(updateHazard(h,dt,[game.player,...game.enemies].filter(Boolean),(actor,spec)=>
      hit(game,{...spec,team:actor.team==='player'?'enemy':'player',facing:Math.sign(h.vx)||1,lift:0,
        x:h.x,y:h.y,points:0},actor)))game.bovinoHazards.push(h);
  }
  game.bovinoCoats=(game.bovinoCoats||[]).filter(c=>{c.age+=dt;return c.age<c.life;});
}

