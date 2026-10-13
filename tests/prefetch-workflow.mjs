import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = await fs.mkdtemp(path.join(os.tmpdir(), 'crashers-workflow-'));
await fs.cp(path.join(root, 'play/qa-level60/src'), src, {recursive:true});
const file=path.join(src,'main.js');
await fs.writeFile(file,(await fs.readFile(file,'utf8')).replace('import { PAGES } from "/story/panels.js";', 'const PAGES = [];'));
const requests=[];
const fixture={frames:[{frame:{x:0,y:0,w:100,h:100}}],meta:{nativePixels:true,anchor:{x:50,y:100},pairedEnemyRoot:{x:80,y:100},bodyScale:1,contactFrame:0}};
globalThis.Image=class {naturalWidth=4096;naturalHeight=4096;width=4096;height=4096;set src(url){requests.push(url);queueMicrotask(()=>this.onload?.());}};
globalThis.fetch=async url=>{requests.push(url);return {ok:true,json:async()=>fixture};};
const ctx=new Proxy({measureText:t=>({width:String(t).length*10}),drawImage:image=>assert.ok(image),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:(()=>{})});
class Element {
 constructor(id=''){this.id=id;this.listeners={};this.style={};this.dataset={};this.hidden=false;this.classList={toggle(){},contains(){return false;},remove(){},add(){}};}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
 fire(type){for(const fn of this.listeners[type]||[])fn({target:this});}
 append(){} before(){} after(){} focus(){} replaceChildren(){} setAttribute(){}
 getBoundingClientRect(){return {width:1280,height:720};}
 getContext(){return ctx;}
 querySelector(){return new Element();}
}
const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
const fighters=['mamdani','sayed'].map(id=>{const e=get('pick-'+id);e.dataset.id=id;return e;});
let tick;
globalThis.requestAnimationFrame=fn=>{tick=fn;};
globalThis.location={search:''};globalThis.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
globalThis.window={location,devicePixelRatio:1,addEventListener(){}};
globalThis.document={getElementById:get,querySelector:get,querySelectorAll:()=>fighters,createElement:()=>new Element(),addEventListener(){},body:new Element(),documentElement:new Element()};
await import(pathToFileURL(file).href+'?v=warm64');
assert.ok(!requests.some(url=>url.includes('ice_bro_attack')),'Page load must not download Stage 1 before Play');
assert.ok(!requests.some(url=>url.includes('citizens/')),'Page load must not download citizens before Play');
assert.ok(!requests.some(url=>url.includes('zohran_mamdani_help_hungry')),'Page load must not download hero gameplay before Play');
assert.ok(!requests.some(url=>url.includes('mike_rogers_attack')),'Do not download late-game bosses at entry');
assert.ok(!requests.some(url=>url.includes('abdul_el_sayed_attack')),'Do not compete with the default hero before selection');
await new Promise(resolve=>setTimeout(resolve,0));
get('start').fire('click');
assert.ok(requests.some(url=>url.includes('ice_bro_attack')),'Pressing Play must start fetching Stage 1 enemies');
assert.ok(requests.some(url=>url.includes('citizens/')),'Pressing Play must start fetching Stage 1 citizens');
assert.ok(!requests.some(url=>url.includes('_help_')||url.includes('abdul_el_sayed_attack')),'Fighter sheets wait for the pick');
get('run').fire('click');
tick(performance.now()+16);
await new Promise(resolve=>setTimeout(resolve,0));
assert.ok(requests.some(url=>url.includes('zohran_mamdani_help_hungry')),'Starting the run loads the chosen hero');
assert.ok(requests.some(url=>url.includes('giuliani_attack')),'Stage two must start fetching while stage one is active');
const iceRequests=requests.filter(url=>url.includes('ice_bro_attack.json')).length;
assert.equal(iceRequests,1,'Play must reuse the opening preload');
get('pick-sayed').fire('click');
assert.ok(requests.some(url=>url.includes('abdul_el_sayed_attack')),'Choosing El-Sayed must immediately warm his moves');
await new Promise(resolve=>setTimeout(resolve,0));
assert.ok(path.resolve(src).startsWith(path.resolve(os.tmpdir())+path.sep+'crashers-workflow-'));
await fs.rm(src,{recursive:true,force:true});
console.log('PASS: page load fetches only the title; Play starts stage one shared art; the run adds the chosen hero and reuses it; stage two preloads during play; changing fighters starts their moves.');

