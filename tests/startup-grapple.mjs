import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import os from 'node:os';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = await fs.mkdtemp(path.join(os.tmpdir(), 'crashers-regression-'));
await fs.cp(path.join(root,'play/qa-level60/src'),src,{recursive:true});
const mainPath=path.join(src,'main.js');
await fs.writeFile(mainPath,(await fs.readFile(mainPath,'utf8')).replace('import { PAGES } from "/story/panels.js";', 'const PAGES = [];'));
const requests=[];let fail='';
const fixture={frames:[{frame:{x:0,y:0,w:100,h:100},duration:100}],meta:{nativePixels:true,anchor:{x:50,y:100},pairedEnemyRoot:{x:80,y:100},bodyScale:1,holdFrame:0,playbackSequence:[0],contactFrame:0}};
globalThis.Image=class {
 naturalWidth=4096;naturalHeight=4096;width=4096;height=4096;
 set src(value){this.url=value;requests.push({type:'image',url:value});queueMicrotask(()=>value.includes(fail)&&fail?this.onerror?.():this.onload?.());}
};
globalThis.fetch=async(url,options={})=>{requests.push({type:options.method||'GET',url});return {ok: !(fail&&url.includes(fail)),status:503,json:async()=>fixture};};
globalThis.window={};globalThis.location={search:''};
const saved=new Map();globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)};
const mod=n=>import(pathToFileURL(path.join(src,n)).href+'?v=load63');
const sprites=await mod('sprites.js'),render=await mod('render.js'),main=await mod('main.js');
const {STAGES}=await import(pathToFileURL(path.join(src,'stages.js')).href+'?v=cast62');
const {makeEnemy}=await import(pathToFileURL(path.join(src,'enemies.js')).href+'?v=cast62');
const {createSceneAssetCache,sceneSprites}=await import(pathToFileURL(path.join(src,'scene-assets.js')).href+'?v=warm64');
let downloads=0,finish;
const cache=createSceneAssetCache(()=>{downloads++;return new Promise(resolve=>{finish=resolve;});});
const warming=cache(STAGES[0],'mamdani');
assert.equal(downloads,1,'Opening the workflow must start the download immediately');
assert.equal(cache({...STAGES[0]},'mamdani'),warming,'Entering gameplay must join the in-flight preload');
finish();await warming.promise;
assert.equal(cache({...STAGES[0]},'mamdani').ready,true,'Completed preload must avoid a loading-screen flash');
assert.equal(downloads,1,'Entry must not repeat the download');
assert.notEqual(cache(STAGES[0],'sayed'),warming,'Changing fighters requests their assets');
finish();
let attempts=0;
const retryCache=createSceneAssetCache(()=>++attempts===1?Promise.reject(new Error('offline')):Promise.resolve());
await assert.rejects(retryCache(STAGES[0],'mamdani').promise);
await retryCache(STAGES[0],'mamdani').promise;
assert.equal(attempts,2,'A failed speculative load must remain retriable');
assert.deepEqual(sceneSprites(STAGES[0],'mamdani'),['zohran','ice_bro']);
assert.ok(sceneSprites(STAGES[7],'sayed').includes('rogers_tropical'));
const ctx=new Proxy({measureText:t=>({width:String(t).length*10}),drawImage:image=>assert.ok(image,'Missing rendered image'),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:(()=>{})});
requests.length=0;
await Promise.all([sprites.loadSprites({sprites:['zohran','abdul'],title:true}),render.loadEnvironment()]);
const title=[...requests];
assert.equal(title.filter(x=>x.type==='GET').length,2);
assert.equal(title.filter(x=>x.type==='image').length,4);
assert.ok(title.every(x=>!x.url.includes('rogers')&&!x.url.includes('bovino')));
let before=requests.length;
await Promise.all([sprites.loadSprites({sprites:['zohran','abdul'],title:true}),render.loadEnvironment()]);
assert.equal(requests.length,before,'Menu requests should be cached');
const report={title,stages:[]};
for(const [index,stage] of STAGES.entries()){
 const game=main.createGame();main.beginRun(game,index%2?'sayed':'mamdani');game.stageIndex=index;main.startStage(game);game.mode='play';
 const kinds=stage.waves.flatMap(w=>[...w.group.map(e=>e.kind),...(w.support?[w.support.kind]:[])]);
 const ids=new Set([game.player.fighter.sprite]);
 for(const kind of kinds){ids.add(kind==='greene'?'greene':makeEnemy(kind,0,560).sprite);if(kind==='pete')ids.add('pete_ww');if(kind==='bovino')ids.add('bovino_mini');if(kind==='rogers'){ids.add('rogers_vacation');ids.add('rogers_tropical');}}
 before=requests.length;
 await Promise.all([sprites.loadSprites({sprites:[...ids]}),render.loadEnvironment(stage)]);
 render.draw(ctx,game);
 for(let i=0;i<180;i++){main.updateGame(game,main.blankInput(),1/60);render.draw(ctx,game);}
 report.stages.push({stage:stage.stageKey,sprites:[...ids],newRequests:requests.slice(before)});
}
let pairs=0;
for(const heroSprite of ['zohran','abdul'])for(const enemySprite of ['ice_bro','giuliani','bovino','bovino_mini','rogers','rogers_vacation','rogers_tropical','cruz','trump','beck','vance_worried','pete_ww','pete','mcconnell']){
 const hero={team:'player',fighter:{sprite:heroSprite},y:560,facing:1},enemy={sprite:enemySprite};
 if(!sprites.hasRegisteredGrapplePair(hero,enemy))continue;
 assert.equal(await sprites.ensureGrapplePair(hero,enemy),true);
 for(const remaining of [0,.6,.3,.01]){hero.grabStrikeT=remaining;assert.equal(sprites.drawGrapplePair(ctx,hero,enemy,420,1),true);}
 pairs++;
}
// Prompts follow the same rescue range as the actual action, including lane and hold state.
const neighbor={id:'neighbor',kind:'hungry',state:'need',x:150,y:500,alive:true};
const guideGame={player:{state:'idle',x:100,y:500,z:0},citizens:[neighbor]};
assert.equal(main.actionGuidance(guideGame,true).attack,'Help');
assert.match(main.actionGuidance(guideGame,false).hint,/Press J to save/);
guideGame.player.y=550;
assert.equal(main.actionGuidance(guideGame,true).attack,'Attack','Different street lane is not in rescue range');
guideGame.player.y=500;guideGame.player.x=0;
assert.equal(main.actionGuidance(guideGame,true).attack,'Attack','Distant neighbor must not show Help');
guideGame.player.x=100;guideGame.player.state='grab';guideGame.player.grabId='enemy';
assert.deepEqual(main.actionGuidance(guideGame,true),{attack:'Attack',heavy:'Throw',hint:'Enemy grabbed. Tap Attack to hit, or Throw to toss them.'});
guideGame.player.state='help';guideGame.player.grabId=null;
assert.equal(main.actionGuidance(guideGame,true).attack,'Helping');
console.log('PASS: contextual Help / Attack / Throw labels, rescue distance, street lane, hold and help states.');
// Failed required assets must reject and be retriable; overlapping loads share work.
fail='donald_trump_grabbed'; // soft failure is allowed and must not poison future required loads
await sprites.loadSprites({sprites:['trump']});fail='';
fail='test-missing';
await assert.rejects(render.loadEnvironment({...STAGES[0],setArt:'test-missing',indoor:true}));
fail='';await render.loadEnvironment({...STAGES[0],setArt:'test-missing',indoor:true});
report.pairedGrabs=pairs;
report.requests=requests.filter(x=>!x.url.includes('test-missing')&&!x.url.includes('donald_trump_grabbed'));
// Remove only the fresh, dedicated temporary fixture directory.
assert.ok(path.resolve(src).startsWith(path.resolve(os.tmpdir()) + path.sep + 'crashers-regression-'));
await fs.rm(src,{recursive:true,force:true});
console.log(`PASS: immediate prefetch, in-flight/completed handoff, fighter switching and retry; menu budget/deduplication; ${STAGES.length} stage load/render simulations; ${pairs} paired grabs; scenery retry.`);


