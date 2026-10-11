// Committed tells and finite reinforcements: pressure without endless spawns.
export const TRUMP_TIMING = { punch: .34, punchEnd: .72, grabTell: .55, orders: .7, ordersEnd: 1.5, recovery: .8 };
export function partnerCommitting(enemy, game) {
  return (game.enemies || []).some(other => other !== enemy && other.alive &&
    ['trump', 'vance'].includes(other.kind) &&
    ['trumpGrabTell', 'grab', 'special', 'attack'].includes(other.state));
}
export function updateTrumpPattern(e, game, dt, api) {
  const p=game.player, t=TRUMP_TIMING;
  const enter=state=>{e.state=state;e.stateT=0;e.vx=e.vy=0;e.spawned=false;e.swingHits=new Set();};
  const recover=()=>enter('trumpRecover');
  if(e.state==='grab'){api.held(e,game,dt);return;}
  if(e.state==='throw'){e.stateT+=dt;if(e.stateT>=.35)recover();return;}
  if(e.state==='trumpRecover'){
    e.stateT+=dt;e.vx=e.vy=0;
    if(e.stateT>=t.recovery){enter('idle');e.attackCd=.25;}
    return;
  }
  if(e.state==='trumpGrabTell'){
    e.stateT+=dt;e.vx=e.vy=0;
    if(e.stateT>=t.grabTell && !api.grab(e,game))recover();
    return;
  }
  if(e.state==='trumpOrders'){
    e.stateT+=dt;e.vx=e.vy=0;
    if(!e.spawned && e.stateT>=t.orders){
      e.spawned=true;
      const remaining=2-(e.reinforcements||0);
      const active=[...game.enemies,...(game.pending||[])].filter(x=>x.alive&&x.kind==='ice_bro').length;
      if(remaining>0 && active<2){
        api.reinforce(e,game);e.reinforcements=(e.reinforcements||0)+1;
      }
    }
    if(e.stateT>=t.ordersEnd){e.ordersCd=9;recover();}
    return;
  }
  if(e.state==='attack'){
    e.stateT+=dt;e.vy=0;
    // The approach step commits to facing and lane; no impact-time homing.
    e.vx=e.stateT<t.punch?e.facing*100:0;e.x+=e.vx*dt;
    if(!e.spawned&&e.stateT>=t.punch){e.spawned=true;api.strike(e,game);}
    if(e.stateT>=t.punchEnd)recover();
    return;
  }
  e.ordersCd=Math.max(0,(e.ordersCd??3)-dt);
  const dx=p.x-e.x,dy=p.y-e.y,dist=Math.abs(dx);
  e.facing=Math.sign(dx)||e.facing;
  if(partnerCommitting(e,game)){
    // Reposition during the partner's commitment; never start a second
    // grab/rush while the player is already responding to the first.
    api.approach(e,{x:p.x-e.facing*160,y:p.y},dt,e.speed*.45);return;
  }
  if(e.attackCd<=0&&Math.abs(dy)<32&&dist<115){
    e.turns=(e.turns||0)+1;
    enter(e.turns%3===0 && dist>=12 && dist<=68?'trumpGrabTell':'attack');return;
  }
  if(e.attackCd<=0&&e.ordersCd<=0&&(e.reinforcements||0)<2&&dist>150){
    enter('trumpOrders');game.banner='SOMEBODY ELSE HANDLE THIS!';game.bannerT=1.5;return;
  }
  api.approach(e,p,dt,e.speed);
}
