import { FIGHTERS, poseFor } from "./fighters.js?v=chibi-site2";
import { drawSprite } from "./sprites.js?v=grounded1";
import { WORLD } from "./stages.js?v=feel1";

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
}

function label(ctx, ent, sx) {
  if (!ent.isBoss || !ent.alive) return;
  ctx.fillStyle = "#f4efe4";
  ctx.font = "700 16px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(ent.name, sx, ent.y - ent.z - (ent.h || 90) * (ent.scale || 1) - 16);
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
  ctx.fillText(`Lives ${game.lives}`, left.x, barY + barH + 8);

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
    ctx.fillText(`${game.combo} HITS`, score.x + score.w / 2, score.y + score.h * 0.72);
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
    ctx.fillText(boss.name, box.x + box.w / 2, box.y);
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
