// Three readable phases, committed lanes, and punishable recoveries.
export const ROGERS_FORMS = ['rogers', 'rogers_vacation', 'rogers_tropical'];
export function updateRogersForm(enemy, game, dt) {
  if (enemy.state === 'transform') {
    enemy.stateT += dt;
    if (enemy.stateT >= 1.3) { enemy.state='idle'; enemy.stateT=0; enemy.attackCd=.7; }
    return true;
  }
  const form = Math.max(0, ROGERS_FORMS.indexOf(enemy.sprite));
  if (form >= 2 || enemy.hp > enemy.hpMax * (2-form)/3 || enemy.hp <= 0) return false;
  if (enemy.z > 0 || ['grab','grabbed','hurt','air','down','death'].includes(enemy.state)) return false;
  enemy.sprite=ROGERS_FORMS[form+1]; enemy.transformed=true;
  enemy.state='transform'; enemy.stateT=0; enemy.transformDur=1.3;
  enemy.vx=enemy.vy=0; enemy.invuln=1.3; enemy.swingHits=new Set();
  game.banner = form === 0 ? 'THE VACATION JERSEY COMES OUT' : 'FULL FLORIDA MODE';
  game.bannerT=1.6;
  return true;
}
export function updateRogers(enemy, player, dt, strike) {
  const form=Math.max(0,ROGERS_FORMS.indexOf(enemy.sprite));
  const enter=state=>{enemy.state=state;enemy.stateT=0;enemy.vx=enemy.vy=0;};
  enemy.stateT+=dt;
  if(enemy.state==='orders') {
    if(enemy.stateT>=1.05) {enter('charge');enemy.swingHits=new Set();}
    return;
  }
  if(enemy.state==='charge') {
    enemy.vx=enemy.facing*300;enemy.vy=0;enemy.x+=enemy.vx*dt;strike();
    if(enemy.stateT>=.6) enter('bill');
    return;
  }
  if(enemy.state==='attack') {
    if(enemy.stateT>=.48 && enemy.stateT<.66) strike();
    if(enemy.stateT>=1.0) {enter('bill');enemy.recovery=1.0;}
    return;
  }
  if(enemy.state==='vacationSpecial') {
    // First .55s is a stationary tell. No steering after committing.
    enemy.vx=enemy.stateT>=.55 && enemy.stateT<1.12 ? enemy.facing*(form===2?290:240) : 0;
    enemy.vy=0;enemy.x+=enemy.vx*dt;if(enemy.vx) strike();
    if(enemy.stateT>=1.3) {enter('bill');enemy.recovery=1.4;}
    return;
  }
  if(enemy.state==='bill') {
    if(enemy.stateT>=(enemy.recovery||1.55)) {enter('idle');enemy.attackCd=.6;enemy.recovery=0;}
    return;
  }
  const dx=player.x-enemy.x,dy=player.y-enemy.y;
  enemy.facing=Math.sign(dx)||enemy.facing;
  if(enemy.attackCd<=0 && Math.abs(dy)<24 && Math.abs(dx)<430) {
    enter(form===0?'orders':Math.abs(dx)<110?'attack':'vacationSpecial');enemy.swingHits=new Set();return;
  }
  enemy.vx=Math.abs(dx)>(form?80:190)?Math.sign(dx)*(form===2?110:90):0;
  enemy.vy=Math.abs(dy)>10?Math.sign(dy)*65:0;
  enemy.x+=enemy.vx*dt;enemy.y+=enemy.vy*dt;
  enemy.state=enemy.vx||enemy.vy?'walk':'idle';
}
