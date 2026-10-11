const KEY='capitol-crashers-campaign54';
export function saveCheckpoint(storage,game){
 if(game.practice)return;
 try{storage.setItem(KEY,JSON.stringify({version:1,stageKey:game.stage.stageKey,fighterId:game.fighterId,score:game.score,lives:Math.max(1,game.lives),helped:game.helped,testified:game.testified}));}catch{}
}
export function readCheckpoint(storage,stages){
 try{const s=JSON.parse(storage.getItem(KEY));
 if(s?.version!==1||!['mamdani','sayed'].includes(s.fighterId))return null;
 const index=stages.findIndex(x=>x.stageKey===s.stageKey);if(index<0)return null;
 return {...s,index,helped:Math.max(0,Math.floor(Number(s.helped)||0)),testified:Math.max(0,Math.floor(Number(s.testified)||0)),score:Math.max(0,Number(s.score)||0),lives:Math.max(1,Math.min(3,Number(s.lives)||3))};
 }catch{return null;}
}
export function clearCheckpoint(storage){try{storage.removeItem(KEY);}catch{}}
