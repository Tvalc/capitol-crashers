import { poseFor } from "./fighters.js";
import { WORLD } from "./stages.js";

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
    sprites.push({ y: 600, draw: () => drawPerson(ctx, preview("rook", 190, game), cam, game) });
    sprites.push({ y: 600, draw: () => drawPerson(ctx, preview("flick", 1090, game), cam, game) });
  }
  sprites.sort((a, b) => a.y - b.y);
  for (const sprite of sprites) sprite.draw();
  for (const fx of game.fx || []) drawFx(ctx, fx, cam);
  if (game.mode === "play") drawHud(ctx, game);
  ctx.restore();
}

function preview(id, x, game) {
  const colors = id === "flick"
    ? { body: "#c4493a", trim: "#7ec8e3", skin: "#d39a6c", pants: "#241c30", bag: "#8d6a45", hat: "tail" }
    : { body: "#3d5a80", trim: "#e2b657", skin: "#e4b48a", pants: "#1c2430", bag: "#c4a574", hat: "cap" };
  return {
    x,
    y: 590,
    z: 0,
    facing: id === "flick" ? -1 : 1,
    state: "walk",
    anim: game.time,
    scale: 1,
    team: "player",
    alive: true,
    isBoss: false,
    flash: 0,
    invuln: 0,
    holding: null,
    name: id,
    colors,
    w: 42,
    h: 88,
  };
}

function drawStreet(ctx, game, cam) {
  const stage = game.stage;
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.floorTop);
  sky.addColorStop(0, stage.sky0);
  sky.addColorStop(1, stage.sky1);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.viewW, WORLD.viewH);

  const parallax = cam * 0.35;
  for (let i = -1; i < 8; i += 1) {
    const x = i * 300 - (parallax % 300);
    ctx.fillStyle = stage.building;
    ctx.fillRect(x, 150, 210, WORLD.floorTop - 150);
    ctx.fillStyle = stage.trim;
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        if ((i + row + col) % 3 === 0) continue;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(x + 18 + col * 58, 176 + row * 48, 28, 18);
        ctx.globalAlpha = 1;
      }
    }
    if (stage.id === "dock" && i % 2 === 0) {
      ctx.strokeStyle = stage.accent;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x + 180, 150);
      ctx.lineTo(x + 250, 70);
      ctx.lineTo(x + 250, 150);
      ctx.stroke();
    }
    if (stage.id === "market") {
      ctx.fillStyle = stage.accent;
      ctx.fillRect(x + 20, WORLD.floorTop - 28, 170, 12);
    }
  }

  ctx.fillStyle = stage.groundEdge;
  ctx.fillRect(0, WORLD.floorTop - 18, WORLD.viewW, WORLD.viewH - WORLD.floorTop + 18);
  ctx.fillStyle = stage.ground;
  ctx.fillRect(0, WORLD.floorTop, WORLD.viewW, WORLD.floorBottom - WORLD.floorTop + 8);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 2;
  for (let y = WORLD.floorTop + 28; y <= WORLD.floorBottom; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD.viewW, y);
    ctx.stroke();
  }
}

function drawProp(ctx, game, prop, cam) {
  const x = prop.x - cam;
  const y = prop.y;
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(x - prop.w / 2, y - 8, prop.w, 10);
  if (game.stage.id === "market") {
    ctx.fillStyle = "#6b4634";
    ctx.fillRect(x - prop.w / 2, y - prop.h, prop.w, prop.h);
    ctx.fillStyle = game.stage.accent;
    ctx.fillRect(x - prop.w / 2 - 8, y - prop.h - 10, prop.w + 16, 12);
  } else if (game.stage.id === "roof") {
    ctx.fillStyle = "#3d4654";
    ctx.fillRect(x - prop.w / 2, y - prop.h, prop.w, prop.h);
    ctx.fillStyle = game.stage.accent;
    ctx.fillRect(x - 6, y - prop.h - 16, 12, 18);
  } else {
    ctx.fillStyle = "#6d5834";
    ctx.fillRect(x - prop.w / 2, y - prop.h, prop.w, prop.h);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.strokeRect(x - prop.w / 2, y - prop.h, prop.w, prop.h);
  }
}

function drawPickup(ctx, pickup, cam) {
  const x = pickup.x - cam;
  const y = pickup.y;
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  if (pickup.kind === "pipe") {
    ctx.strokeStyle = "#d9dde6";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x - 16, y - 8);
    ctx.lineTo(x + 16, y - 20);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#d7e7a0";
    roundRect(ctx, x - 5, y - 22, 10, 18, 3);
    ctx.fill();
  }
}

function drawShot(ctx, shot, cam) {
  const x = shot.x - cam;
  const y = shot.y - shot.z;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(shot.spin);
  if (shot.kind === "pipe") {
    ctx.strokeStyle = "#e8eef8";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#d7e7a0";
    ctx.fillRect(-4, -8, 8, 16);
  }
  ctx.restore();
}

function drawFx(ctx, fx, cam) {
  const alpha = 1 - fx.t / fx.life;
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.fillStyle = fx.color;
  ctx.beginPath();
  ctx.arc(fx.x - cam, fx.y - fx.z, 8 + fx.t * 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawPerson(ctx, ent, cam, game) {
  if (ent.team === "player" && ent.invuln > 0 && Math.floor(game.time * 16) % 2 === 0 && ent.state !== "special") return;
  const depth = 0.86 + ((ent.y - WORLD.floorTop) / (WORLD.floorBottom - WORLD.floorTop)) * 0.2;
  const sc = (ent.scale || 1) * depth;
  const sx = ent.x - cam;
  const colors = ent.colors;
  const pose = poseFor(ent);
  const flash = ent.flash > 0;

  ctx.save();
  ctx.translate(sx, ent.y);
  ctx.scale(sc, sc * 0.42);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(sx, ent.y - ent.z);
  ctx.scale(sc * (ent.facing || 1), sc);
  const ink = flash ? "#ffffff" : null;
  if (pose.down) {
    ctx.fillStyle = ink || colors.pants;
    ctx.fillRect(-36, -18, 54, 14);
    ctx.fillStyle = ink || colors.body;
    ctx.fillRect(-8, -24, 34, 16);
    ctx.fillStyle = ink || colors.skin;
    ctx.beginPath();
    ctx.arc(30, -20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, ent, sx);
    return;
  }

  const step = pose.step || 0;
  const lean = pose.lean || 0;
  ctx.fillStyle = ink || colors.pants;
  ctx.fillRect(-12, -40, 9, 36 + step * 2);
  ctx.fillRect(2, -40, 9, 36 - step * 2);
  ctx.fillStyle = ink || colors.skin;
  ctx.fillRect(-14, -44, 8, 8);
  ctx.fillRect(6, -44, 8, 8);

  ctx.fillStyle = ink || colors.body;
  ctx.fillRect(-16 + lean * 0.2, -78, 32, 42);
  ctx.fillStyle = ink || colors.trim;
  ctx.fillRect(-16 + lean * 0.2, -62, 32, 7);

  if (ent.team === "player" && colors.bag) {
    ctx.fillStyle = ink || colors.bag;
    ctx.fillRect(-20, -70, 8, 16);
  }

  ctx.fillStyle = ink || colors.skin;
  ctx.beginPath();
  ctx.arc(lean * 0.15, -92, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ink || colors.trim;
  if (colors.hat === "cap") ctx.fillRect(-15, -106, 30, 8);
  if (colors.hat === "helm") {
    ctx.beginPath();
    ctx.arc(0, -96, 16, Math.PI, 0);
    ctx.fill();
  }
  if (colors.hat === "tail") ctx.fillRect(-26, -96, 18, 5);

  const punch = pose.punch || 0;
  ctx.fillStyle = ink || colors.skin;
  ctx.fillRect(-20, -70, 10, 8);
  ctx.fillStyle = ink || colors.body;
  ctx.fillRect(8, -70 - punch * 4, 12 + punch * 36, 8);

  if (ent.holding?.kind === "pipe" && !pose.down) {
    ctx.strokeStyle = "#e8eef8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(16 + punch * 20, -78);
    ctx.lineTo(36 + punch * 28, -92);
    ctx.stroke();
  } else if (ent.holding?.kind === "bottle") {
    ctx.fillStyle = "#d7e7a0";
    ctx.fillRect(18, -86, 7, 14);
  }

  if (pose.special) {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = colors.trim;
    ctx.beginPath();
    ctx.arc(0, -50, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  label(ctx, ent, sx);
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

function bar(ctx, x, y, w, h, ent) {
  const red = Math.max(0, ent.hp - ent.chip) / ent.hpMax;
  const green = Math.max(0, ent.chip) / ent.hpMax;
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#d24b3a";
  ctx.fillRect(x, y, w * Math.min(1, red), h);
  ctx.fillStyle = "#7dce6a";
  ctx.fillRect(x + w * Math.min(1, red), y, w * Math.min(1 - red, green), h);
  ctx.strokeStyle = "rgba(244,239,228,0.7)";
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}
