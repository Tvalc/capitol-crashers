import { FIGHTERS, poseFor } from "./fighters.js?v=chibi-site2";
import { drawSprite } from "./sprites.js?v=citizen-happy3";
import { WORLD, STAGES } from "./stages.js?v=feel1";
import { CITIZEN_KINDS } from "./citizens.js?v=citizens1";

const art = {};
export function loadEnvironment() {
  const names=['rally','studio','capitol','crate','bin','hydrant','barrel','pipe','bottle','food','impact','panel','button-gold','button-teal','banner'];
  const required = Promise.all(names.map(name => new Promise((resolve,reject) => {
    const image=new Image(); image.onload=()=>{art[name]=image;resolve();};
    image.onerror=()=>reject(new Error(`Missing Makko artwork: ${name}`));
    image.src=`../art/chibi/${name}.webp?v=1`;
  })));
  // Parallax layers, the banner plane and icicles are optional until their art lands.
  const optional = [];
  const tryLoad = (key, src) => optional.push(new Promise((resolve) => {
    const image = new Image(); image.onload = () => { art[key] = image; resolve(); }; image.onerror = () => resolve(); image.src = src;
  }));
  for (const stage of STAGES) for (const layer of stage.layers || []) tryLoad(`${stage.id}-${layer.name}`, `../art/parallax/${stage.id}/${layer.name}.webp?v=1`);
  tryLoad("plane", "../art/parallax/plane.webp?v=1");
  tryLoad("icicles", "../art/parallax/icicles.webp?v=1");
  return Promise.all([required, ...optional]);
}
function painted(ctx,name,x,y,w,h) {
  const image=art[name]; if(!image)return;
  ctx.drawImage(image,x,y,w,h);
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
  const sourceWidth=image.width*.86;
  const progress=Math.max(0,Math.min(1,cam/Math.max(1,game.stage.length-WORLD.viewW)));
  const sourceX=(image.width-sourceWidth)*progress;
  const curb=Math.round(image.height*.58);
  // Multilayer parallax when the stage has layers painted; the single painting otherwise.
  const layers=(game.stage.layers||[]).map(layer=>({layer,image:art[`${game.stage.id}-${layer.name}`]})).filter(entry=>entry.image);
  if(layers.length){
    for(const {layer,image:img} of layers){
      const scale=WORLD.floorTop/img.height;
      const w=img.width*scale;
      let offset=-((cam*layer.speed)%w);
      for(let x=offset;x<WORLD.viewW;x+=w) ctx.drawImage(img,0,0,img.width,img.height,Math.round(x),0,Math.ceil(w)+1,WORLD.floorTop);
    }
  } else {
    ctx.drawImage(image,sourceX,0,sourceWidth,curb,0,0,WORLD.viewW,WORLD.floorTop);
  }
  ctx.drawImage(image,sourceX,curb,sourceWidth,image.height-curb,0,WORLD.floorTop,WORLD.viewW,WORLD.viewH-WORLD.floorTop);
}

// Planes tow the message across the sky, independent of the street scroll.
function drawPlanes(ctx, game) {
  const planes = game.stage?.planes || [];
  if (!planes.length || game.mode !== "play") return;
  ctx.save();
  ctx.font = "800 22px Bungee, Segoe UI, sans-serif";
  ctx.textBaseline = "middle";
  for (const plane of planes) {
    const textW = ctx.measureText(plane.text).width + 36;
    const span = WORLD.viewW + textW + 260;
    const x = WORLD.viewW + 120 - (((game.time * plane.speed + plane.start) % span) + span) % span;
    const y = plane.y;
    // plane
    if (art.plane) ctx.drawImage(art.plane, x - 60, y - 24, 120, 48);
    else {
      ctx.fillStyle = "#e8e2d4";
      ctx.beginPath(); ctx.ellipse(x, y, 44, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ef6b4a";
      ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x - 48, y - 20); ctx.lineTo(x - 40, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x - 6, y - 14, 12, 4);
    }
    // tow line + banner
    ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 44, y + 2); ctx.lineTo(x - 70, y + 8); ctx.stroke();
    const bx = x - 70 - textW, by = y - 16;
    ctx.fillStyle = "#ffd23f"; roundRect(ctx, bx, by, textW, 34, 6); ctx.fill();
    ctx.strokeStyle = "#1a1208"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#1a1208"; ctx.textAlign = "left"; ctx.fillText(plane.text, bx + 18, by + 18);
  }
  ctx.restore();
}

// Sidewalk sign posts along the street carry the slogans.
function drawSign(ctx, sign, cam) {
  const x = sign.x - cam;
  if (x < -300 || x > WORLD.viewW + 300) return;
  const y = WORLD.floorTop + 6;
  ctx.save();
  ctx.font = "800 18px Bungee, Segoe UI, sans-serif";
  const w = Math.ceil(ctx.measureText(sign.text).width + 40);
  const h = 54;
  ctx.fillStyle = "#3b2a1c"; ctx.fillRect(x - 5, y - 118, 10, 118);
  if (art.panel) ctx.drawImage(art.panel, x - w / 2 - 14, y - 134 - h * 0.3, w + 28, h * 1.6);
  else { ctx.fillStyle = "#19e6ff"; roundRect(ctx, x - w / 2, y - 134, w, h, 8); ctx.fill(); }
  ctx.fillStyle = "#f4efe4"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(sign.text, x, y - 134 + h / 2);
  ctx.restore();
}

// A RENT FROZEN notice goes up on the building where a tenant was helped.
function drawMark(ctx, mark, cam) {
  const x = mark.x - cam;
  if (x < -200 || x > WORLD.viewW + 200) return;
  const pop = Math.min(1, mark.t / 0.25);
  const y = 236 - (1 - pop) * 30;
  ctx.save();
  ctx.globalAlpha = pop;
  ctx.font = "800 18px Bungee, Segoe UI, sans-serif";
  const w = Math.ceil(ctx.measureText(mark.text).width + 28);
  ctx.translate(x, y); ctx.rotate(-0.04);
  ctx.fillStyle = "#f4efe4"; ctx.fillRect(-w / 2, -22, w, 44);
  ctx.strokeStyle = "#1c5fd8"; ctx.lineWidth = 4; ctx.strokeRect(-w / 2 + 3, -19, w - 6, 38);
  ctx.fillStyle = "#1c5fd8"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(mark.text, 0, 1);
  ctx.restore();
}

// The street changes when the policy wins: icicles along the eaves, a cool cast.
function drawWin(ctx, game) {
  if (game.stage.id !== "rally") return;
  ctx.save();
  if (art.icicles) {
    const img = art.icicles; const h = 90; const w = img.width * (h / img.height);
    for (let x = -((game.cameraX * 0.45) % w); x < WORLD.viewW; x += w) ctx.drawImage(img, x, WORLD.floorTop - 70, w, h);
  } else {
    ctx.fillStyle = "rgba(220,240,255,0.9)";
    for (let x = -((game.cameraX * 0.45) % 46); x < WORLD.viewW; x += 46) {
      const len = 18 + ((x * 7) % 26);
      ctx.beginPath(); ctx.moveTo(x, WORLD.floorTop - 72); ctx.lineTo(x + 14, WORLD.floorTop - 72); ctx.lineTo(x + 7, WORLD.floorTop - 72 + len); ctx.closePath(); ctx.fill();
    }
  }
  ctx.fillStyle = "rgba(120,180,255,0.10)"; ctx.fillRect(0, 0, WORLD.viewW, WORLD.viewH);
  ctx.restore();
}

// Painted stand-in for a citizen until their Makko sheet exists.
function drawCitizenPlaceholder(ctx, cit, sx, sc) {
  const c = cit.colors || CITIZEN_KINDS[cit.kind];
  const h = cit.h * sc, w = cit.w * sc;
  const down = cit.state === "down";
  ctx.save();
  ctx.translate(sx, cit.y - (cit.z || 0));
  if (down) { ctx.rotate(cit.facing * 1.4); ctx.translate(0, 10); }
  // legs, body, head
  ctx.fillStyle = c.pants; ctx.fillRect(-w * 0.32, -h * 0.42, w * 0.26, h * 0.42); ctx.fillRect(w * 0.06, -h * 0.42, w * 0.26, h * 0.42);
  ctx.fillStyle = c.body; roundRect(ctx, -w * 0.42, -h * 0.78, w * 0.84, h * 0.4, 8); ctx.fill();
  ctx.fillStyle = c.trim; ctx.fillRect(-w * 0.1, -h * 0.76, w * 0.2, h * 0.3);
  ctx.fillStyle = c.skin; ctx.beginPath(); ctx.arc(0, -h * 0.9, h * 0.17, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1a1a1a"; ctx.beginPath(); ctx.arc(0, -h * 1.0, h * 0.16, Math.PI, Math.PI * 2); ctx.fill();
  // mood
  ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 2; ctx.beginPath();
  const happy = cit.state === "helped" || cit.state === "testified" || cit.state === "follow";
  if (happy) ctx.arc(cit.facing * 3, -h * 0.87, 5, 0.1 * Math.PI, 0.9 * Math.PI); else ctx.arc(cit.facing * 3, -h * 0.82, 5, 1.1 * Math.PI, 1.9 * Math.PI);
  ctx.stroke();
  ctx.restore();
  // need bubble
  if (cit.state === "need" || cit.state === "down") {
    const bob = Math.sin((cit.anim || 0) * 4) * 3;
    const bx = sx, by = cit.y - h - 28 + bob;
    ctx.save();
    ctx.fillStyle = "#f4efe4"; ctx.beginPath(); ctx.arc(bx, by, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f4efe4"; ctx.beginPath(); ctx.moveTo(bx - 6, by + 14); ctx.lineTo(bx + 6, by + 14); ctx.lineTo(bx, by + 24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 2.5; ctx.fillStyle = "#1a1a1a"; ctx.lineCap = "round";
    const icon = c.icon;
    ctx.beginPath();
    if (icon === "bowl") { ctx.arc(bx, by - 1, 9, 0, Math.PI); ctx.moveTo(bx - 11, by - 1); ctx.lineTo(bx + 11, by - 1); }
    else if (icon === "cross") { ctx.moveTo(bx - 8, by); ctx.lineTo(bx + 8, by); ctx.moveTo(bx, by - 8); ctx.lineTo(bx, by + 8); }
    else if (icon === "box") { ctx.rect(bx - 8, by - 6, 16, 13); ctx.moveTo(bx - 8, by - 1); ctx.lineTo(bx + 8, by - 1); }
    else if (icon === "dollar") { ctx.moveTo(bx + 5, by - 7); ctx.bezierCurveTo(bx - 10, by - 10, bx - 10, by, bx, by); ctx.bezierCurveTo(bx + 10, by, bx + 10, by + 10, bx - 5, by + 7); ctx.moveTo(bx, by - 10); ctx.lineTo(bx, by + 10); }
    else { ctx.rect(bx - 9, by - 5, 18, 12); ctx.moveTo(bx - 9, by - 5); ctx.lineTo(bx - 3, by - 9); ctx.lineTo(bx + 1, by - 5); }
    ctx.stroke();
    ctx.restore();
  }
}
function drawProp(ctx,game,prop,cam) {
  const name=game.stage.id==='studio'?'bin':game.stage.id==='capitol'?'barrel':'crate';
  painted(ctx,name,prop.x-cam-prop.w/2,prop.y-prop.h,prop.w,prop.h);
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
    if (fx.kind === "heart") {
      ctx.fillStyle = "#ef4a7a"; ctx.beginPath();
      ctx.moveTo(x, y + 12); ctx.bezierCurveTo(x - 22, y - 6, x - 10, y - 22, x, y - 8); ctx.bezierCurveTo(x + 10, y - 22, x + 22, y - 6, x, y + 12); ctx.fill();
    } else {
      ctx.font = "800 22px Bungee, Segoe UI, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#ffd23f";
      ctx.strokeStyle = "#1a1208"; ctx.lineWidth = 4; ctx.strokeText("RECEIPTS", x, y); ctx.fillText("RECEIPTS", x, y);
    }
    ctx.restore(); return;
  }
  ctx.save();ctx.globalAlpha=Math.max(0,1-fx.t/fx.life);
  const size=(fx.heavy ? 64 : 38)*(1+Math.min(1,fx.t/.06)*.25);
  painted(ctx,'impact',fx.x-cam-size/2,fx.y-fx.z-size/2,size,size);ctx.restore();
}

function drawPerson(ctx, ent, cam, game) {
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
  else if (ent.team === "citizen") drawCitizenPlaceholder(ctx, ent, sx, spriteScale);
  if (ent.team === "citizen" && ent.state === "follow") {
    ctx.save(); ctx.font = "700 13px Segoe UI, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#ffd23f";
    ctx.fillText("WITNESS", sx, ent.y - ent.z - (ent.h || 84) * spriteScale - 10); ctx.restore();
  }
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
  const px = w * 0.1;
  const py = h * 0.27;
  return { x: x + px, y: y + py, w: w - px * 2, h: h - py * 2 };
}

function drawHud(ctx, game) {
  const player = game.player;
  if (!player) return;
  ctx.save();
  const aspect = 510 / 245;

  const lw = 360;
  const lh = Math.round(lw / aspect);
  painted(ctx, "panel", 14, 10, lw, lh);
  const left = innerPlate(14, 10, lw, lh);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#f4efe4";
  ctx.font = "700 20px Segoe UI, sans-serif";
  ctx.fillText(player.name, left.x, left.y);
  const barH = 26;
  const barY = left.y + 28;
  bar(ctx, left.x, barY, left.w, barH, player);
  ctx.font = "600 16px Segoe UI, sans-serif";
  ctx.fillStyle = "#e2b657";
  ctx.fillText(`Lives ${game.lives}   ·   Helped ${game.helped || 0}`, left.x, barY + barH + 8);

  const sw = 240;
  const sh = Math.round(sw / aspect);
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
    ctx.fillText(game.comboKind === "help" ? `${game.combo} HELPED` : `${game.combo} HITS`, score.x + score.w / 2, score.y + score.h * 0.72);
  } else {
    ctx.font = "700 26px Segoe UI, sans-serif";
    ctx.fillText(scoreText, score.x + score.w / 2, score.y + score.h / 2);
  }

  const boss = (game.enemies || []).find((enemy) => enemy.isBoss && enemy.alive);
  if (boss) {
    const bw = 440;
    const bh = 156;
    const bx = (WORLD.viewW - bw) / 2;
    painted(ctx, "panel", bx, 8, bw, bh);
    const box = innerPlate(bx, 8, bw, bh);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#f4efe4";
    ctx.font = "700 18px Segoe UI, sans-serif";
    ctx.fillText(boss.title ? `${boss.title} · ${boss.name}` : boss.name, box.x + box.w / 2, box.y);
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
    ctx.fillStyle = "#251a0b";
    ctx.fillText(word, bx + bw / 2, by + bh * 0.46);
  }

  if (game.banner && (game.bannerT > 0 || game.introT > 0)) {
    let size = 32;
    ctx.font = `800 ${size}px Segoe UI, sans-serif`;
    const maxW = 440;
    while (ctx.measureText(game.banner).width > maxW && size > 18) {
      size -= 2;
      ctx.font = `800 ${size}px Segoe UI, sans-serif`;
    }
    const bw = Math.max(380, Math.ceil(ctx.measureText(game.banner).width + 140));
    const bh = Math.round(bw * (219 / 574));
    const bx = (WORLD.viewW - bw) / 2;
    const by = 156;
    painted(ctx, "banner", bx, by, bw, bh);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#251a0b";
    const hasLine = game.introT > 0.2 && game.stage?.line;
    ctx.fillText(game.banner, WORLD.viewW / 2, by + bh * (hasLine ? 0.4 : 0.48));
    if (hasLine) {
      ctx.font = "600 16px Segoe UI, sans-serif";
      ctx.fillStyle = "#5a3a12";
      ctx.fillText(game.stage.line, WORLD.viewW / 2, by + bh * 0.66);
    }
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
