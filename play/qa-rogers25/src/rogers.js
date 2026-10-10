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
    enemy.vx=enemy.facing*440;
    // Steering stops before the charge ends, leaving a dodge window.
    enemy.vy=enemy.stateT<.65?Math.max(-150,Math.min(150,(player.y-enemy.y)*5)):0;
    enemy.x+=enemy.vx*dt;enemy.y+=enemy.vy*dt;strike();
    if(enemy.stateT>=.95) enter('bill');
    return;
  }
  if(enemy.state==='attack') {
    if(enemy.stateT>=.48 && enemy.stateT<.66) strike();
    if(enemy.stateT>=1.0) {enter('bill');enemy.recovery=1.0;}
    return;
  }
  if(enemy.state==='umbrellaRise') {
    enemy.z=150*Math.min(1,enemy.stateT/.65);
    if(enemy.stateT>=.65) enter('umbrellaHover');
    return;
  }
  if(enemy.state==='umbrellaHover') {
    enemy.z=150+Math.sin(enemy.stateT*7)*7;
    enemy.x+=Math.max(-130,Math.min(130,(player.x-enemy.facing*120-enemy.x)*3))*dt;
    enemy.y+=Math.max(-90,Math.min(90,(player.y-enemy.y)*3))*dt;
    if(enemy.stateT>=.9){
      enemy.diveX=player.x+enemy.facing*30;enemy.diveY=player.y;
      enemy.diveStartX=enemy.x;enemy.diveStartY=enemy.y;
      enter('umbrellaDive');enemy.swingHits=new Set();
    }
    return;
  }
  if(enemy.state==='umbrellaDive') {
    const t=Math.min(1,enemy.stateT/.6);
    enemy.x=enemy.diveStartX+(enemy.diveX-enemy.diveStartX)*t;
    enemy.y=enemy.diveStartY+(enemy.diveY-enemy.diveStartY)*t;
    enemy.z=150*(1-t);
    if(t>.8)strike();
    if(t>=1){enemy.z=0;enemy.vz=0;enter('umbrellaLand');}
    return;
  }
  if(enemy.state==='umbrellaLand') {
    enemy.z=0;
    if(enemy.stateT>=.85){enter('bill');enemy.recovery=.6;}
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
    enter(form===0?'orders':form===1?'umbrellaRise':Math.abs(dx)<110?'attack':'vacationSpecial');enemy.swingHits=new Set();return;
  }
  enemy.vx=Math.abs(dx)>(form?80:190)?Math.sign(dx)*(form===2?110:90):0;
  enemy.vy=Math.abs(dy)>10?Math.sign(dy)*65:0;
  enemy.x+=enemy.vx*dt;enemy.y+=enemy.vy*dt;
  enemy.state=enemy.vx||enemy.vy?'walk':'idle';
}
