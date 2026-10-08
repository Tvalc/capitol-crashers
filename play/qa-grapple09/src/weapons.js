import { play } from "./audio.js";
import { applyHit } from "./combat.js?v=grapple09b";

export function launchHeld(game, owner) {
  const held = owner.holding;
  if (!held) return;
  owner.holding = null;
  spawnShot(game, owner, {
    kind: held.kind,
    dmg: (held.kind === "pipe" ? 16 : 11) * (owner.fighter?.power ?? 1),
    speed: held.kind === "pipe" ? 560 : 360,
    vz: held.kind === "pipe" ? 30 : 180,
  });
  play("throw");
}

export function spawnBolt(game, owner) {
  const facing = owner.facing || 1;
  game.projectiles.push({
    kind: "bolt",
    x: owner.x + facing * 70,
    y: owner.y,
    z: 52,
    vx: facing * 680,
    vy: 0,
    vz: 0,
    team: owner.team,
    dmg: 16 * (owner.fighter?.power ?? 1),
    kb: 340,
    life: 0.4,
    alive: true,
    spin: 0,
  });
}

export function spawnSombrero(game, owner) {
  const facing = owner.facing || 1;
  game.projectiles.push({
    kind: "sombrero",
    x: owner.x + facing * 128,
    y: owner.y,
    z: 168,
    vx: facing * 720,
    vy: 0,
    vz: 0,
    team: "enemy",
    dmg: owner.dmg + 4,
    kb: 170,
    life: 0.9,
    age: 0,
    alive: true,
    spin: 0,
  });
}

export function spawnSatellite(game, x, y, dmg, lead = 0) {
  game.projectiles.push({
    kind: "satellite",
    x,
    y,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    team: "enemy",
    dmg,
    kb: 280,
    life: 2.15,
    age: 0,
    hover: 1.15,
    lock: 0.48,
    lead,
    alive: true,
    spin: 0,
    hit: false,
    locked: false,
  });
}

export function spawnLaser(game, x, y, dmg) {
  game.projectiles.push({
    kind: "laser",
    x,
    y,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    team: "enemy",
    dmg,
    kb: 260,
    life: 0.7,
    age: 0,
    warn: 0.32,
    alive: true,
    spin: 0,
    hit: false,
  });
}

export function spawnShot(game, owner, spec) {
  const facing = owner.facing || 1;
  game.projectiles.push({
    kind: spec.kind,
    x: owner.x + facing * 36,
    y: owner.y,
    z: 56,
    vx: facing * spec.speed,
    vy: spec.vy ?? 0,
    vz: spec.vz ?? 40,
    team: owner.team,
    dmg: spec.dmg,
    life: spec.life ?? 1.35,
    alive: true,
    spin: 0,
  });
}

export function updatePickups(game) {
  const player = game.player;
  if (!player?.alive) return;
  if (player.holding) return;
  if (player.state !== "idle" && player.state !== "walk" && player.state !== "dash") return;
  for (const pickup of game.stage.pickups) {
    if (pickup.taken) continue;
    if (Math.abs(pickup.x - player.x) < 32 && Math.abs(pickup.y - player.y) < 28) {
      pickup.taken = true;
      player.holding = {
        kind: pickup.kind,
        left: pickup.kind === "pipe" ? 3 : 1,
      };
      play("pickup");
      game.banner = pickup.kind === "pipe" ? "Pipe" : "Bottle";
      game.bannerT = 0.8;
      break;
    }
  }
}

export function updateProjectiles(game, dt) {
  for (const shot of game.projectiles) {
    if (!shot.alive) continue;
    if (shot.kind === "satellite") {
      shot.age += dt;
      shot.life -= dt;
      const target = game.player;
      if (!shot.locked && shot.age < shot.hover && target) {
        const goalX = target.x + (shot.lead || 0);
        shot.x += (goalX - shot.x) * Math.min(1, dt * 1.7);
        shot.y += (target.y - shot.y) * Math.min(1, dt * 1.7);
      } else if (!shot.locked) {
        shot.locked = true;
      }
      const fireAt = shot.hover + shot.lock;
      if (!shot.hit && shot.age >= fireAt && target?.alive) {
        shot.hit = true;
        if (Math.abs(shot.x - target.x) < 34 && Math.abs(shot.y - target.y) < 30) {
          applyHit(game, {
            x: shot.x,
            y: shot.y,
            dmg: shot.dmg,
            kb: shot.kb,
            lift: 50,
            knockdown: false,
            facing: Math.sign(target.x - shot.x) || 1,
            team: "enemy",
            kind: "throw",
            points: 0,
            hitstop: 0.06,
            shake: 8,
          }, target);
        }
      }
      if (shot.life <= 0) shot.alive = false;
      continue;
    }
    if (shot.kind === "laser") {
      shot.age += dt;
      shot.life -= dt;
      if (!shot.hit && shot.age >= shot.warn) {
        shot.hit = true;
        const target = game.player;
        if (target?.alive && Math.abs(shot.x - target.x) < 42 && Math.abs(shot.y - target.y) < 32) {
          applyHit(game, {
            x: shot.x,
            y: shot.y,
            dmg: shot.dmg,
            kb: shot.kb,
            lift: 40,
            knockdown: false,
            facing: Math.sign(target.x - shot.x) || 1,
            team: "enemy",
            kind: "throw",
            points: 0,
            hitstop: 0.06,
            shake: 7,
          }, target);
        }
      }
      if (shot.life <= 0) shot.alive = false;
      continue;
    }
    if (shot.kind === "sombrero") {
      shot.life -= dt;
      shot.age = (shot.age || 0) + dt;
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      const target = game.player;
      if (target?.alive && !shot.hit && Math.abs(shot.x - target.x) < target.w * 0.55 + 16 && Math.abs(shot.y - target.y) < 28) {
        shot.hit = true;
        shot.alive = false;
        applyHit(game, {
          x: shot.x,
          y: shot.y,
          dmg: shot.dmg,
          kb: shot.kb,
          lift: 20,
          knockdown: false,
          facing: Math.sign(shot.vx) || 1,
          team: "enemy",
          kind: "throw",
          points: 0,
          hitstop: 0.05,
          shake: 5,
        }, target);
      }
      if (shot.life <= 0) shot.alive = false;
      continue;
    }
    shot.life -= dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    if (shot.kind !== "bolt") {
      shot.z += shot.vz * dt;
      shot.vz -= 900 * dt;
      shot.spin += dt * 8;
    }
    if (shot.z <= 0) {
      shot.z = 0;
      shot.vz = 0;
      if (shot.kind === "bottle") {
        shot.alive = false;
        game.fx.push({ x: shot.x, y: shot.y, z: 10, t: 0, life: 0.2, color: "#d7e7a0" });
        continue;
      }
      shot.vx *= Math.exp(-3 * dt);
    }
    const targets = shot.team === "player" ? game.enemies : [game.player];
    for (const target of targets) {
      if (!target?.alive) continue;
      const nearX = Math.abs(shot.x - target.x) < target.w * 0.55 + 12;
      const nearY = Math.abs(shot.y - target.y) < 26;
      const nearZ = Math.abs(shot.z + 8 - (target.z + target.h * 0.4)) < target.h * 0.55;
      if (nearX && nearY && nearZ) {
        applyHit(game, {
          x: shot.x,
          y: shot.y,
          dmg: shot.dmg,
          kb: shot.kind === "bolt" ? 340 : shot.kind === "pipe" ? 260 : 180,
          lift: shot.kind === "bolt" ? 520 : 50,
          knockdown: shot.kind === "bolt",
          facing: Math.sign(shot.vx) || 1,
          team: shot.team,
          kind: "throw",
          points: 140,
          hitstop: 0.05,
          shake: 6,
        }, target);
        shot.alive = false;
        break;
      }
    }
    if (shot.life <= 0) shot.alive = false;
  }
  game.projectiles = game.projectiles.filter((shot) => shot.alive);
}

export function noteWeaponSwing(player) {
  if (player.holding?.kind !== "pipe") return;
  player.holding.left -= 1;
  if (player.holding.left <= 0) player.holding.breakPending = true;
}

export function finishWeapon(player) {
  if (player.holding?.breakPending) {
    player.holding = null;
    play("break");
  }
}
