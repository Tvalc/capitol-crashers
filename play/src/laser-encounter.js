import { spawnSatellite } from './weapons.js?v=encounter38';
const smooth = t => { t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
export function addLaserEncounter(game, makeEnemy, x) {
  const left=game.lockCam??game.cameraX??0;
  const center=Math.max(left+320,Math.min(left+840,x));
  const relays=[-190,0,190].map((dx,i)=>{
    const r=makeEnemy('laser_relay',center+dx,530+(i%2)*95);
    r.laserCd=1.8+i*1.1; return r;
  });
  const op={kind:'greene',sprite:'greene',team:'scenery',untargetable:true,
    x:0,y:0,z:0,facing:-1,state:'idle',stateT:0,anim:0,alive:true,relays,
    age:0,exitT:0,castT:0,scale:.55,deckX:left+640,deckY:270,deckW:640,
    deckOffset:270,paceDir:-1,paceT:0,pauseT:.8};
  (game.laserOperators??=[]).push(op); game.enemies.push(...relays);
  position(op,0); game.banner='Break the three laser relays';game.bannerT=3;
  return op;
}
function position(op,time){
  const arrival=(1-smooth(op.age/1.6))*700;
  const departure=smooth(op.exitT/1.8)*760;
  op.platformX=op.deckX+arrival+departure;
  op.platformY=op.deckY+Math.sin(time*1.5)*2;
  op.x=op.platformX+op.deckOffset;op.y=op.platformY;
}
export function updateLaserEncounters(game,dt){
  for(const op of game.laserOperators||[]){
    if(!op.alive)continue;
    op.deckX=(game.cameraX||0)+640;
    op.age+=dt;op.anim+=dt;op.stateT+=dt;
    const active=op.relays.filter(r=>r.alive);
    if(!active.length){
      if(!op.exitT){game.banner='Laser network offline';game.bannerT=2.2;}
      op.exitT+=dt;op.state='idle';op.alive=op.exitT<1.8;
      position(op,game.time||op.age);continue;
    }
    if(op.age<1.6){position(op,op.age);continue;}
    op.castT=Math.max(0,op.castT-dt);
    const prior=op.state;
    if(op.castT>0)op.state='special';
    else if(op.pauseT>0){op.pauseT-=dt;op.state='idle';}
    else{
      op.state='walk';op.facing=op.paceDir;
      op.deckOffset+=op.paceDir*58*dt;
      if(op.deckOffset<85||op.deckOffset>op.deckW-85){
        op.deckOffset=Math.max(85,Math.min(op.deckW-85,op.deckOffset));
        op.paceDir*=-1;op.pauseT=.7;
      }
    }
    if(op.state!==prior){op.stateT=0;op.anim=0;}
    for(const r of active){
      if(!game.player?.alive)continue;
      r.laserCd-=dt;if(r.laserCd>0)continue;
      r.laserCd=5.2;op.castT=1.2;op.state='special';op.stateT=0;op.anim=0;
      spawnSatellite(game,game.player.x,game.player.y,10);
      game.projectiles.at(-1).sourceRelay=r.id;
    }
    position(op,game.time||op.age);
  }
  for(const shot of game.projectiles)if(shot.sourceRelay&&!game.enemies.some(e=>e.id===shot.sourceRelay&&e.alive))shot.alive=false;
}