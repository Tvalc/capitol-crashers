import { play } from "./audio.js";
import { applyHit } from "./combat.js";

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
  if (player.state !== "idle" && player.state !== "walk") return;
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
    shot.life -= dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.z += shot.vz * dt;
    shot.vz -= 900 * dt;
    shot.spin += dt * 8;
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
          kb: shot.kind === "pipe" ? 260 : 180,
          lift: 50,
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
