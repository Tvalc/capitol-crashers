// Original game dialogue, not attributed real-world quotations.
// One short exchange at a time; ordinary walking never triggers a bubble.
export const LINES = {
  mamdani: { help:[['FREEZE THE RENT.','NOT THE NEIGHBORS.'],['MONEY OUT OF POLITICS.','DINNER ON THE TABLE.']], fight:[['YOUR DONORS','CAN WAIT.'],['PUBLIC SERVICE.','PERSONAL DELIVERY.'],['THE RENT IS FROZEN.','YOUR FEET ARE NEXT.']] },
  sayed: { help:[['HEALTHCARE FOR ALL.','YES, YOU TOO.'],['HOT MEAL. WARM COAT.','BASIC HUMAN DECENCY.']], fight:[['SECOND OPINION?','STILL A BAD IDEA.'],['YOUR TALKING POINTS','NEED LIFE SUPPORT.'],['I MAKE HOUSE CALLS.','EVEN HERE.']] },
  ice_bro: { fight:[['I DID MY RESEARCH!','ON A PODCAST.'],['FACT-CHECKING?','SOUNDS SUSPICIOUS.'],['MY SOURCE?','A GUY WITH A MIC.']] },
  bongino: { fight:[['MY SOURCE?','MY OTHER PODCAST.'],['LOUDER MEANS','MORE CORRECT!']] },
  bovino: { fight:[['ONE VERY NORMAL','FULL-SIZED OFFICER.'],['NOTHING TO SEE','UNDER THIS COAT.'],['FOUR? NO.','ONE. DEFINITELY ONE.']] },
  bovino_mini: { fight:[['I CALL THE','SHOULDERS NEXT!'],['WHO PULLED','MY PIN?!'],['SMALL GOVERNMENT.','BIG MEGAPHONE.']] },
  giuliani: { fight:[['IS THIS THE','LANDSCAPING PLACE?'],['MY HAIR DYE','IS MY ALIBI.'],['OBJECTION!','TO ALL OF THIS.']] },
  beck: { fight:[['THE CHALKBOARD','CONNECTS EVERYTHING!'],['FOLLOW THE ARROWS!','IGNORE THE FACTS!'],['MORE CHALK!','LESS CONTEXT!']] },
  cruz: { fight:[['IS THAT MY','BOARDING GROUP?'],['THIS IS A','FACT-FINDING VACATION!'],['I CAN SEE CANCUN','FROM THIS RECOVERY.']] },
  vance: { fight:[['THE COUCH','UNDERSTANDS ME.'],['I HAVE ALWAYS','BELIEVED THIS TODAY.'],['CAN WE TAKE THIS','SITTING DOWN?']] },
  trump: { fight:[['THE BEST COMBO.','MANY PEOPLE SAY IT.'],['I DEMAND','A REMATCH RECOUNT!'],['THAT WAS A','PERFECT PHONE CALL.']] },
  pete: { fight:[['I CAME PREPARED.','FOR THE CAMERA.'],['THE HAIR GEL','IS TACTICAL.'],['MISSION:','LOOK IMPORTANT.']] },
  greene: { fight:[['MY SPACE LASER','HAS A SPACE LASER!'],['WHO CUT THE','CONSPIRACY CABLE?'],['RELAY FAILURE?','CLEARLY A COVER-UP!']] },
  hungry: { help:[['A HOT MEAL','AND A WINTER COAT!']] },
  sick: { help:[['CARE SHOULD NOT','NEED A CREDIT CHECK.']] },
  evicted: { help:[['HOME SHOULD NOT','BE A LUXURY.']] },
  worker: { help:[['GOOD WORK.','FAIR PAY.']] },
  witness: { help:[['I KEPT','THE RECEIPTS.']] }
};
const states=new Set(['attack','light','heavy','special','cast','dashatk','lunge','grab','throw','windup','charge','shout','toss','canister','bovinoThrow','bovinoShout','help','cheer','helped','testified']);
const sessions=new WeakMap();
export function currentBanter(game) {
 let s=sessions.get(game);
 if(!s||game.time<s.time){s={time:game.time,next:0,active:null,actors:new WeakMap()};sessions.set(game,s);}
 s.time=game.time;
 if(s.active&&(game.time>s.active.until||!s.active.actor.alive))s.active=null;
 for(const actor of [game.player,...(game.enemies||[]),...(game.laserOperators||[]),...(game.citizens||[])]) {
  if(!actor||!actor.alive||actor.kind==='rogers')continue;
  const kind=actor.kind?.replace('citizen_','');const lines=LINES[kind];if(!lines)continue;
  let a=s.actors.get(actor);if(!a){a={state:null,next:0,index:0};s.actors.set(actor,a);}
  const changed=a.state!==actor.state;a.state=actor.state;
  const x=actor.x-(game.cameraX||0);if(x<80||x>1200)continue;
  if(!changed||!states.has(actor.state)||s.active||game.time<s.next||game.time<a.next)continue;
  // Rogers keeps his existing jokes unobstructed during his set pieces.
  if((game.enemies||[]).some(e=>e.kind==='rogers'&&['orders','attack','vacationSpecial','bill'].includes(e.state)))continue;
  const bank=(['help','cheer','helped','testified'].includes(actor.state)?lines.help:lines.fight)||lines.fight||lines.help;
  s.active={actor,text:bank[a.index++%bank.length],until:game.time+2.1};a.next=game.time+12;s.next=game.time+4.8;
 }
 return s.active;
}
