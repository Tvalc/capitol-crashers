import { FIGHTERS, poseFor } from "./fighters.js?v=chibi-site2";
import { drawSprite } from "./sprites.js?v=chibi-site2";
import { WORLD } from "./stages.js?v=chibi-site2";

const art = {};
export function loadEnvironment() {
  const names=['rally','studio','capitol','crate','bin','hydrant','barrel','pipe','bottle','food','impact','panel','button-gold','button-teal','banner'];
  return Promise.all(names.map(name => new Promise((resolve,reject) => {
    const image=new Image(); image.onload=()=>{art[name]=image;resolve();};
    image.onerror=()=>reject(new Error(`Missing Makko artwork: ${name}`));
    image.src=`../art/chibi/${name}.webp?v=1`;
  })));
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
  const sprites = [];
  for (const prop of game.stage?.props || []) {
    sprites.push({ y: prop.y, draw: () => drawProp(ctx, game, prop, cam) });
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
  ctx.drawImage(image,sourceX,0,sourceWidth,curb,0,0,WORLD.viewW,WORLD.floorTop);
  ctx.drawImage(image,sourceX,curb,sourceWidth,image.height-curb,0,WORLD.floorTop,WORLD.viewW,WORLD.viewH-WORLD.floorTop);
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
  ctx.save();ctx.globalAlpha=Math.max(0,1-fx.t/fx.life);
  const size=28+fx.t*100;
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
  ctx.ellipse(0, 8, 54, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (drawSprite(ctx, ent, sx, spriteScale)) label(ctx, ent, sx);
}

function label(ctx, ent, sx) {
  if (!ent.isBoss || !ent.alive) return;
  ctx.fillStyle = "#f4efe4";
  ctx.font = "700 16px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(ent.name, sx, ent.y - ent.z - (ent.h || 90) * (ent.scale || 1) - 16);
}

function drawHud(ctx, game) {
  const player = game.player;
  if (!player) return;
  painted(ctx,'panel',18,12,320,102);
  painted(ctx,'panel',WORLD.viewW-230,12,210,82);
  ctx.textAlign = "left";
  ctx.font = "700 18px Segoe UI, sans-serif";
  ctx.fillStyle = "#f4efe4";
  ctx.fillText(player.name, 36, 40);
  bar(ctx, 36, 52, 280, 16, player);

  ctx.font = "600 14px Segoe UI, sans-serif";
  ctx.fillStyle = "#e2b657";
  ctx.fillText(`Lives ${game.lives}`, 36, 92);

  ctx.textAlign = "right";
  ctx.fillStyle = "#f4efe4";
  ctx.font = "700 20px Segoe UI, sans-serif";
  ctx.fillText(String(game.score).padStart(6, "0"), WORLD.viewW - 36, 42);
  if (game.combo >= 2) {
    ctx.fillStyle = "#ef6b4a";
    ctx.font = "800 28px Segoe UI, sans-serif";
    ctx.fillText(`${game.combo} HITS`, WORLD.viewW - 36, 78);
  }

  const boss = (game.enemies || []).find((enemy) => enemy.isBoss && enemy.alive);
  if (boss) {
    painted(ctx,'panel',WORLD.viewW/2-184,8,368,74);
    ctx.textAlign = "center";
    ctx.fillStyle = "#f4efe4";
    ctx.font = "700 16px Segoe UI, sans-serif";
    ctx.fillText(boss.name, WORLD.viewW / 2, 36);
    bar(ctx, WORLD.viewW / 2 - 160, 46, 320, 14, boss);
  }

  if (player.holding) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#f4efe4";
    ctx.font = "700 16px Segoe UI, sans-serif";
    const word = player.holding.kind === "pipe" ? `Pipe ${player.holding.left}` : "Bottle";
    ctx.fillText(word, 36, WORLD.viewH - 36);
  }

  if (game.banner && (game.bannerT > 0 || game.introT > 0)) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#f4efe4";
    ctx.font = "800 42px Segoe UI, sans-serif";
    ctx.fillText(game.banner, WORLD.viewW / 2, 150);
    if (game.introT > 0.2 && game.stage?.line) {
      ctx.font = "600 18px Segoe UI, sans-serif";
      ctx.fillStyle = "#e2b657";
      ctx.fillText(game.stage.line, WORLD.viewW / 2, 184);
    }
  }
}

function bar(ctx,x,y,w,h,ent) {
  const image=art['button-teal'];
  painted(ctx,'button-gold',x,y,w,h);
  const ratio=Math.max(0,Math.min(1,ent.hp/ent.hpMax));
  if(image&&ratio>0)ctx.drawImage(image,0,0,image.width*ratio,image.height,x,y,w*ratio,h);
}
