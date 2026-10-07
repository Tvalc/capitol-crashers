import { FIGHTERS, poseFor } from "./fighters.js?v=chibi-site2";
import { drawSprite } from "./sprites.js?v=hd4";
import { WORLD, STAGES } from "./stages.js?v=idle21";
import { CITIZEN_KINDS } from "./citizens.js?v=idle21";

const art = {};
export function loadEnvironment() {
  const names=['rally','studio','capitol','crate','bin','hydrant','barrel','pipe','bottle','food','impact','button-teal','street-panel','plane-loop','nyc-background','nyc-pavement','nyc-sidewalk','nyc-lamp','scenery-pantry-night','scenery-bus-stop-night','scenery-bench-night','scenery-planter-night','scenery-kiosk-night','scenery-bench','scenery-planter'];
  const required = Promise.all(names.map(name => new Promise((resolve,reject) => {
    const image=new Image(); image.onload=()=>{art[name]=image;resolve();};
    image.onerror=()=>reject(new Error(`Missing Makko artwork: ${name}`));
    image.src=`../art/chibi/${name}.webp?v=idle21`;
  })));
  // Parallax layers, the banner plane and icicles are optional until their art lands.
  const optional = [];
  const tryLoad = (key, src) => optional.push(new Promise((resolve) => {
    const image = new Image(); image.onload = () => { art[key] = image; resolve(); }; image.onerror = () => resolve(); image.src = src;
  }));
  for (const stage of STAGES) for (const layer of stage.layers || []) tryLoad(`${stage.id}-${layer.name}`, `../art/parallax/${stage.id}/${layer.name}.webp?v=1`);
  tryLoad("icicles", "../art/parallax/icicles.webp?v=1");
  return Promise.all([required, ...optional]);
}
function painted(ctx,name,x,y,w,h) {
  if (['panel','banner','button-gold','button-teal'].includes(name)) {
    const image=art['street-panel']; if(!image)return;
    const s=90,d=Math.min(20,w/4,h/4);
    const xs=[0,s,image.width-s,image.width],ys=[0,s,image.height-s,image.height];
    const dx=[x,x+d,x+w-d,x+w],dy=[y,y+d,y+h-d,y+h];
    for(let row=0;row<3;row++)for(let col=0;col<3;col++)ctx.drawImage(image,xs[col],ys[row],xs[col+1]-xs[col],ys[row+1]-ys[row],dx[col],dy[row],dx[col+1]-dx[col],dy[row+1]-dy[row]);
    return;
  }
  const image=art[name]; if(!image)return;
  ctx.drawImage(image,x,y,w,h);
}

export function fittedText(ctx,text,x,y,width,size=18) {
  text=String(text);
  ctx.font=`800 ${size}px Segoe UI, sans-serif`;
  while(ctx.measureText(text).width>width && size>10)ctx.font=`800 ${--size}px Segoe UI, sans-serif`;
  ctx.fillText(text,x,y);
}

export function wrappedText(ctx,text,x,y,width,lineHeight=21) {
  const words=String(text).split(/\s+/);let line='',lines=[];
  for(const word of words){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>width){lines.push(line);line=word;}else line=next;}
  if(line)lines.push(line);
  lines.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight));
  return lines.length;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function draw(ctx, game) {
  const cam = game.cameraX || 0;
  ctx.save();
  if (game.shake > 0.4) {
    ctx.translate((Math.random() - 0.5) * game.shake * 2, (Math.random() - 0.5) * game.shake * 2);
  }
  drawStreet(ctx, game, cam);
  drawPlanes(ctx, game);
  const sprites = [];
  for (const prop of game.stage?.scenery || []) {
    const img=art[prop.art];const h=img?prop.w*img.height/img.width:prop.h;
    sprites.push({y:prop.y,draw:()=>painted(ctx,prop.art,prop.x-cam-prop.w/2,prop.y-h,prop.w,h)});
  }
  for (const sign of game.stage?.signs || []) {
    sprites.push({ y: WORLD.floorTop + 1, draw: () => drawSign(ctx, sign, cam) });
  }
  for (const mark of game.stage?.marks || []) {
    sprites.push({ y: WORLD.floorTop + 2, draw: () => drawMark(ctx, mark, cam) });
  }
  for (const prop of game.stage?.props || []) {
    sprites.push({ y: prop.y, draw: () => drawProp(ctx, game, prop, cam) });
  }
  for (const cit of game.citizens || []) {
    sprites.push({ y: cit.y, draw: () => drawPerson(ctx, cit, cam, game) });
  }
  for (const pickup of game.stage?.pickups || []) {
    if (pickup.taken) continue;
    sprites.push({ y: pickup.y, draw: () => drawPickup(ctx, pickup, cam) });
  }
  for (const shot of game.projectiles || []) {
    sprites.push({ y: shot.y, draw: () => drawShot(ctx, shot, cam) });
  }
  for (const enemy of game.enemies || []) {
    sprites.push({ y: enemy.y, draw: () => drawPerson(ctx, enemy, cam, game) });
  }
  if (game.player) sprites.push({ y: game.player.y, draw: () => drawPerson(ctx, game.player, cam, game) });
  if (!game.player && (game.mode === "title" || game.mode === "select")) {
    sprites.push({ y: 600, draw: () => drawPerson(ctx, preview("mamdani", 190, game), cam, game) });
    sprites.push({ y: 600, draw: () => drawPerson(ctx, preview("sayed", 1090, game), cam, game) });
  }
  sprites.sort((a, b) => a.y - b.y);
  for (const sprite of sprites) sprite.draw();
  if (game.stage?.won) drawWin(ctx, game);
  for (const fx of game.fx || []) drawFx(ctx, fx, cam);
  if (game.mode === "play") drawHud(ctx, game);
  ctx.restore();
}

function preview(id, x, game) {
  const { body, trim, skin, pants, bag, hat, hair } = FIGHTERS[id] || FIGHTERS.mamdani;
  const colors = { body, trim, skin, pants, bag, hat, hair };
  return {
    x,
    y: 590,
    z: 0,
    facing: id === "sayed" ? -1 : 1,
    state: "walk",
    anim: game.time,
    scale: 1,
    team: "player",
    alive: true,
    isBoss: false,
    flash: 0,
    invuln: 0,
    holding: null,
    fighter: FIGHTERS[id] || FIGHTERS.mamdani,
    kind: id,
    name: (FIGHTERS[id] || FIGHTERS.mamdani).name,
    colors,
    w: 42,
    h: 88,
  };
}

function drawStreet(ctx,game,cam) {
  const image=art[game.stage.id] || art.rally;
  if(!image)return;
  if(game.stage.id==='rally' && art['nyc-background'] && art['nyc-pavement'] && art['nyc-sidewalk']) {
    const backdrop=art['nyc-background'],road=art['nyc-pavement'],curb=art['nyc-sidewalk'];
    // Opaque architecture has no sidewalk furniture baked into it.
    const width=WORLD.viewW*1.6;
    for(let x=-((cam*.55)%width);x<WORLD.viewW;x+=width) ctx.drawImage(backdrop,0,0,backdrop.width,Math.round(backdrop.height*.9),x,0,width,WORLD.floorTop);
    for(let x=-(cam%width);x<WORLD.viewW;x+=width) ctx.drawImage(road,x,WORLD.floorTop,width,WORLD.viewH-WORLD.floorTop);
    // The transparent curb is a complete authored prop, not a slice through the scene.
    const tileWidth=420;
    for(let x=-(cam%tileWidth);x<WORLD.viewW;x+=tileWidth) ctx.drawImage(curb,x,435,tileWidth+1,50);
    return;
  }
  // Cut below the entire NYC curb, planter feet and shop crates.
  const curb=Math.round(image.height*(game.stage.id==='rally'?.64:.58));
  const layers=(game.stage.layers||[]).map(layer=>({layer,image:art[`${game.stage.id}-${layer.name}`]})).filter(entry=>entry.image);
  // Buildings nearest the sidewalk share its world coordinates. Only distant layers lag.
  if(layers.length){
    for(const {layer,image:img} of layers){
      const w=img.width*(WORLD.floorTop/img.height);
      const offset=-((cam*layer.speed)%w);
      for(let x=offset;x<WORLD.viewW;x+=w) ctx.drawImage(img,0,0,img.width,img.height,x,0,w+.5,WORLD.floorTop);
    }
  } else {
    const w=WORLD.viewW*1.6;
    const offset=-((cam%w)+w)%w;
    for(let x=offset;x<WORLD.viewW;x+=w) ctx.drawImage(image,0,0,image.width,curb,x,0,w+.5,WORLD.floorTop);
  }
  // The pavement is at the actors' depth: a camera movement shifts both by the same pixels.
  // Shared width and camera offset keep the painted curb connected to the storefronts.
  const groundWidth=WORLD.viewW*1.6;
  const offset=-((cam%groundWidth)+groundWidth)%groundWidth;
  for(let x=offset;x<WORLD.viewW;x+=groundWidth){
    ctx.drawImage(image,0,curb,image.width,image.height-curb,x,WORLD.floorTop,groundWidth+.5,WORLD.viewH-WORLD.floorTop);
  }
}

// Planes tow the message across the sky, independent of the street scroll.
function drawPlanes(ctx, game) {
  const planes = game.stage?.planes || [];
  const image = art["plane-loop"];
  if (!image || !planes.length || game.mode !== "play" || game.stage.id === "studio") return;
  ctx.save();
  ctx.font = "800 20px Bungee, Segoe UI, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const width = 360, height = width * 204 / 960;
  for (const [index, plane] of planes.entries()) {
    // Brief flyovers separated by quiet sky; no permanently circling slogan.
    const elapsed = game.time - (8 + index * 22);
    if (elapsed < 0) continue;
    const phase = elapsed % 58;
    const speed = 165;
    if (phase > (WORLD.viewW + width + 200) / speed) continue;
    const span = WORLD.viewW + width + 200;
    const x = WORLD.viewW + 100 - phase * speed;
    // The entire authored sprite travels left: nose at left, rope and banner behind at right.
    const frame=Math.floor(game.time*18+plane.start)%12;
    ctx.drawImage(image,frame%4*960,Math.floor(frame/4)*204,960,204,x,plane.y-height/2,width,height);
    ctx.fillStyle = "#1a1208";
    ctx.font = '800 12px Segoe UI, sans-serif';
    const multiline=ctx.measureText(plane.text).width>width*.43;
    wrappedText(ctx,plane.text,x+width*.744,plane.y-height*.035-(multiline?7:0),width*.43,14);
  }
  ctx.restore();
}

// Sidewalk sign posts along the street carry the slogans.
function drawSign(ctx, sign, cam) {
  const x = sign.x - cam;
  if (x < -300 || x > WORLD.viewW + 300) return;
  const y = sign.y ?? 350;
  ctx.save();
  ctx.font = "800 18px Bungee, Segoe UI, sans-serif";
  const w = sign.w ?? 200;
  const h = 46;
  painted(ctx,'panel',x-w/2,y-h/2,w,h);
  ctx.fillStyle = "#f4efe4"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  fittedText(ctx,sign.text,x,y,w-32,16);
  ctx.restore();
}

// A RENT FROZEN notice goes up on the building where a tenant was helped.
function drawMark(ctx, mark, cam) {
  const x = mark.x - cam;
  if (x < -200 || x > WORLD.viewW + 200) return;
  if (mark.t >= 3) return;
  const pop = Math.min(1, mark.t / 0.25) * Math.min(1, (3-mark.t)/0.5);
  const y = 236 - (1 - pop) * 30;
  ctx.save();
  ctx.globalAlpha = pop;
  ctx.font = "800 18px Bungee, Segoe UI, sans-serif";
  const w = Math.min(400,Math.max(240,Math.ceil(ctx.measureText(mark.text).width + 56)));
  ctx.translate(x, y); ctx.rotate(-0.04);
  painted(ctx, "panel", -w / 2, -32, w, 64);
  ctx.fillStyle = "#f4efe4"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; fittedText(ctx,mark.text,0,0,w-48,18);
  ctx.restore();
}

// The street changes when the policy wins: icicles along the eaves, a cool cast.
function drawWin(ctx, game) {
  if (game.stage.id !== "rally") return;
  ctx.save();
  if (art.icicles) {
    const img = art.icicles; const h = 90; const w = img.width * (h / img.height);
    for (let x = -((game.cameraX * 0.45) % w); x < WORLD.viewW; x += w) ctx.drawImage(img, x, WORLD.floorTop - 70, w, h);
  }
  ctx.fillStyle = "rgba(120,180,255,0.10)"; ctx.fillRect(0, 0, WORLD.viewW, WORLD.viewH);
  ctx.restore();
}

function drawProp(ctx, game, prop, cam) {
  const name = game.stage.id === 'studio' ? 'bin' : game.stage.id === 'capitol' ? 'barrel' : 'crate';
  painted(ctx, name, prop.x - cam - prop.w / 2, prop.y - prop.h, prop.w, prop.h);
}

function drawPickup(ctx,pickup,cam) {
  const name=pickup.kind==='pipe'?'pipe':pickup.kind==='bottle'?'bottle':'food';
  painted(ctx,name,pickup.x-cam-22,pickup.y-34,44,34);
}

const hatSprite = typeof Image === "undefined" ? { complete: false } : new Image();
hatSprite.src = "assets/sprites/ted_cruz_hat.webp?v=idleentry1";
const craftSprite = typeof Image === "undefined" ? { complete: false } : new Image();
craftSprite.src = "assets/sprites/satellite_craft.webp?v=idleentry1";
const beamSprite = typeof Image === "undefined" ? { complete: false } : new Image();
beamSprite.src = "assets/sprites/satellite_beam.webp?v=idleentry1";

function drawShot(ctx, shot, cam) {
  if (shot.kind === "satellite") {
    const x = shot.x - cam;
    const firing = shot.age >= shot.hover + shot.lock;
    const locking = shot.locked && !firing;
    const bob = shot.locked ? 0 : Math.sin(shot.age * 7) * 8;
    const craftY = 78 + bob;
    ctx.save();
    ctx.strokeStyle = firing ? "rgba(120, 230, 255, 0.95)" : locking ? "rgba(255, 220, 90, 0.95)" : "rgba(160, 210, 255, 0.4)";
    ctx.lineWidth = firing ? 3 : 2;
    ctx.beginPath();
    ctx.ellipse(x, shot.y, firing ? 26 : locking ? 24 : 36, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    if ((firing || locking) && beamSprite.complete && beamSprite.naturalWidth) {
      ctx.globalAlpha = firing ? 0.95 : 0.28;
      ctx.drawImage(beamSprite, x - 16, craftY + 18, 32, Math.max(8, shot.y - craftY - 18));
      ctx.globalAlpha = 1;
    }
    if (craftSprite.complete && craftSprite.naturalWidth) {
      ctx.drawImage(craftSprite, x - 78, craftY - 30, 156, 62);
    }
    ctx.restore();
    return;
  }
  if (shot.kind === "laser") {
    const x=shot.x-cam, warming=shot.age<shot.warn;
    ctx.save();ctx.globalAlpha=warming?.25:1;
    if(beamSprite.complete&&beamSprite.naturalWidth)ctx.drawImage(beamSprite,x-18,0,36,shot.y);
    painted(ctx,'impact',x-28,shot.y-12,56,24);ctx.restore();return;
  }
  const x = shot.x - cam;
  const y = shot.y - shot.z;
  if (shot.kind === "sombrero" && hatSprite.complete && hatSprite.naturalWidth) {
    const spin = 0.72 + Math.abs(Math.sin((shot.age || 0) * 24)) * 0.28;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale((shot.vx < 0 ? -1 : 1) * spin, 1);
    ctx.drawImage(hatSprite, -48, -18, 96, 36);
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(shot.spin);
  const name=shot.kind==='pipe'||shot.kind==='bolt'?'pipe':'bottle';
  painted(ctx,name,-20,-15,40,30);
  ctx.restore();
}

function drawFx(ctx,fx,cam) {
  if (fx.kind === "heart" || fx.kind === "receipts") {
    const u = fx.t / fx.life;
    ctx.save(); ctx.globalAlpha = Math.max(0, 1 - u);
    const x = fx.x - cam, y = fx.y - fx.z - u * 60;
    ctx.font = "800 22px Bungee, Segoe UI, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#ffd23f";
    ctx.strokeStyle = "#1a1208"; ctx.lineWidth = 4;
    const message = fx.kind === "heart" ? "THANK YOU!" : "RECEIPTS";
    ctx.strokeText(message, x, y); ctx.fillText(message, x, y);
    ctx.restore(); return;
  }
  ctx.save();ctx.globalAlpha=Math.max(0,1-fx.t/fx.life);
  const size=(fx.heavy ? 64 : 38)*(1+Math.min(1,fx.t/.06)*.25);
  painted(ctx,'impact',fx.x-cam-size/2,fx.y-fx.z-size/2,size,size);ctx.restore();
}

function drawPerson(ctx, ent, cam, game) {
  if (ent.team === "citizen" && ent.helpOwner?.state === "help" && ent.helpOwner.stateT >= ent.helpOwner.helpAction.approach) return;
  if (ent.team === "player" && ent.invuln > 0 && Math.floor(game.time * 16) % 2 === 0 && ent.state !== "special") return;
  const depth = 0.86 + ((ent.y - WORLD.floorTop) / (WORLD.floorBottom - WORLD.floorTop)) * 0.2;
  const sc = (ent.scale || 1) * depth;
  const sx = ent.x - cam;
  const colors = ent.colors;
  const pose = poseFor(ent);
  const flash = ent.flash > 0;

  const spriteScale = sc * 1.05;

  ctx.save();
  ctx.translate(sx, ent.y);
  ctx.scale(spriteScale, spriteScale * 0.42);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  const airborne = Math.min(1, (ent.z || 0) / 160);
  ctx.globalAlpha = 1 - airborne * .55;
  ctx.ellipse(0, 0, 38 - airborne * 10, 11 - airborne * 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (drawSprite(ctx, ent, sx, spriteScale)) label(ctx, ent, sx);
}

function label(ctx, ent, sx) {
  if (!ent.isBoss || !ent.alive) return;
  ctx.fillStyle = "#f4efe4";
  ctx.font = "700 16px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  // Chibi sheets stand about 2.4x the logical body height; keep the tag clear of the hair.
  ctx.fillText(ent.title ? `${ent.title} · ${ent.name}` : ent.name, sx, ent.y - ent.z - (ent.h || 90) * (ent.scale || 1) * 2.4 - 14);
}

function innerPlate(x, y, w, h) {
  const px = 22;
  const py = 20;
  return { x: x + px, y: y + py, w: w - px * 2, h: h - py * 2 };
}

function drawHud(ctx, game) {
  const player = game.player;
  if (!player) return;
  ctx.save();
  const aspect = 3;

  const lw = 360;
  const lh = Math.round(lw / aspect);
  painted(ctx, "panel", 14, 10, lw, lh);
  const left = innerPlate(14, 10, lw, lh);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#f4efe4";
  ctx.font = "700 20px Segoe UI, sans-serif";
  fittedText(ctx,player.name,left.x,left.y,left.w,20);
  const barH = 26;
  const barY = left.y + 28;
  bar(ctx, left.x, barY, left.w, barH, player);
  ctx.font = "600 16px Segoe UI, sans-serif";
  ctx.fillStyle = "#e2b657";
  fittedText(ctx,`Lives ${game.lives}   ·   Helped ${game.helped || 0}`,left.x,barY+barH+8,left.w,16);

  const sw = 240;
  const sh = 104;
  const sx = WORLD.viewW - 14 - sw;
  painted(ctx, "panel", sx, 10, sw, sh);
  const score = innerPlate(sx, 10, sw, sh);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f4efe4";
  const scoreText = String(game.score).padStart(6, "0");
  if (game.combo >= 2) {
    ctx.font = "700 22px Segoe UI, sans-serif";
    ctx.fillText(scoreText, score.x + score.w / 2, score.y + score.h * 0.34);
    ctx.fillStyle = "#ef6b4a";
    ctx.font = "800 18px Segoe UI, sans-serif";
    ctx.fillStyle = game.comboKind === "help" ? "#5fd38a" : "#ef6b4a";
    fittedText(ctx,game.comboKind === "help" ? `${game.combo} HELPED` : `${game.combo} HITS`,score.x+score.w/2,score.y+score.h*.72,score.w,18);
  } else {
    ctx.font = "700 26px Segoe UI, sans-serif";
    ctx.fillText(scoreText, score.x + score.w / 2, score.y + score.h / 2);
  }

  const boss = (game.enemies || []).find((enemy) => enemy.isBoss && enemy.alive);
  if (boss) {
    const bw = 440;
    const bh = 104;
    const bx = (WORLD.viewW - bw) / 2;
    painted(ctx, "panel", bx, 8, bw, bh);
    const box = innerPlate(bx, 8, bw, bh);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#f4efe4";
    ctx.font = "700 18px Segoe UI, sans-serif";
    fittedText(ctx,boss.title ? `${boss.title} · ${boss.name}` : boss.name,box.x+box.w/2,box.y,box.w,18);
    bar(ctx, box.x + box.w * 0.06, box.y + 28, box.w * 0.88, 24, boss);
  }

  if (player.holding) {
    const word = player.holding.kind === "pipe" ? `Pipe ${player.holding.left}` : "Bottle";
    ctx.font = "700 16px Segoe UI, sans-serif";
    const bw = Math.ceil(ctx.measureText(word).width + 64);
    const bh = 52;
    const bx = 16;
    const by = WORLD.viewH - 16 - bh;
    painted(ctx, "button-gold", bx, by, bw, bh);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f4efe4";
    ctx.fillText(word, bx + bw / 2, by + bh * 0.46);
  }

  if (game.banner && (game.bannerT > 0 || game.introT > 0)) {
    const hasLine = game.introT > 0.2 && game.stage?.line;
    const bw = 680, bh = hasLine ? 132 : 80;
    const bx = (WORLD.viewW - bw) / 2, by = 146;
    painted(ctx, "panel", bx, by, bw, bh);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#f4efe4";
    fittedText(ctx,game.banner,WORLD.viewW/2,by+(hasLine?35:40),bw-64,28);
    if(hasLine){ctx.font="600 17px Segoe UI, sans-serif";ctx.fillStyle="#efe4c9";wrappedText(ctx,game.stage.line,WORLD.viewW/2,by+72,bw-64,22);}

  }
  ctx.restore();
}

function bar(ctx, x, y, w, h, ent) {
  painted(ctx, "button-gold", x, y, w, h);
  const image = art["button-teal"];
  const ratio = Math.max(0, Math.min(1, ent.hp / ent.hpMax));
  if (!image || ratio <= 0) return;
  const insetX = 0.08;
  const insetY = 0.24;
  const faceW = 1 - insetX * 2;
  const faceH = 1 - insetY * 2;
  ctx.drawImage(
    image,
    image.width * insetX,
    image.height * insetY,
    image.width * faceW * ratio,
    image.height * faceH,
    x + w * insetX,
    y + h * insetY,
    w * faceW * ratio,
    h * faceH
  );
}
