import { helpWindow } from "./help-actions.js?v=cast40";
import { play } from "./audio.js?v=cast40";
import { hasGrapplePair, grapplePairDistance, grapplePairContactRemaining, grapplePairImpact, grapplePairDuration } from "./sprites.js?v=cast40";
import { FIGHTERS } from "./fighters.js?v=cast40";
import { integrate, melee, spendSpecial, updateBody } from "./combat.js?v=cast40";
import { finishWeapon, launchHeld, noteWeaponSwing, spawnBolt } from "./weapons.js?v=cast40";
import { deliverHelp, finishHelp, helpTarget, startHelp } from "./citizens.js?v=cast40";

const LIGHTS = [
  { startup: 0.10, active: 0.09, dmg: 7, kb: 65, lift: 0, stun: 0.32 },
  { startup: 0.10, active: 0.09, dmg: 8, kb: 85, lift: 0, stun: 0.34 },
  { startup: 0.16, active: 0.11, dmg: 12, kb: 340, lift: 520, knockdown: true },
];

const KICKS = [
  { startup: 0.08, active: 0.07, dmg: 7, kb: 45, lift: 0, stun: 0.25 },
  { startup: 0.07, active: 0.07, dmg: 8, kb: 60, lift: 0, stun: 0.27 },
  { startup: 0.1, active: 0.08, dmg: 12, kb: 340, lift: 520, knockdown: true },
];

const MOVES = {
  heavy: {
    startup: 0.12,
    active: 0.08,
    recover: 0.2,
    dmg: 14,
    kb: 280,
    lift: 520,
    knockdown: true,
    kind: "heavy",
    hitstop: 0.06,
    shake: 7,
    points: 150,
  },
  dashatk: {
    startup: 0.04,
    active: 0.08,
    recover: 0.16,
    dmg: 10,
    kb: 320,
    lift: 520,
    knockdown: true,
    kind: "dash",
    lunge: 2.25,
    lungeFor: 0.12,
    hitstop: 0.05,
    points: 130,
  },
};

function lungeSpec(player) {
  if (player.kind === "sayed") {
    return {
      startup: 0.06,
      active: 0.07,
      recover: 0.18,
      dmg: 11,
      kb: 320,
      lift: 520,
      knockdown: true,
      kind: "heavy",
      lunge: 2.6,
      lungeFor: 0.1,
      reachAdd: 33,
      ownBox: true,
      hitstop: 0.05,
      points: 140,
    };
  }
  return {
    startup: 0.18,
    active: 0.12,
    recover: 0.32,
    dmg: 16,
    kb: 400,
    lift: 540,
    knockdown: true,
    kind: "heavy",
    lunge: 1.7,
    lungeFor: 0.16,
    reachAdd: 34,
    ownBox: true,
    hitstop: 0.07,
    shake: 8,
    points: 170,
  };
}

function reversalSpec(player) {
  if (player.kind === "sayed") {
    return {
      startup: 0.05,
      active: 0.07,
      recover: 0.2,
      dmg: 10,
      kb: 300,
      lift: 520,
      knockdown: true,
      kind: "heavy",
      reachAdd: -6,
      ownBox: true,
      hitstop: 0.05,
      points: 140,
    };
  }
  return {
    startup: 0.12,
    active: 0.1,
    recover: 0.28,
    dmg: 13,
    kb: 340,
    lift: 520,
    knockdown: true,
    kind: "heavy",
    reachAdd: 10,
    ownBox: true,
    hitstop: 0.06,
    shake: 7,
    points: 160,
  };
}

function specialSpec(player) {
  if (player.kind === "sayed") {
    return {
      startup: 0.1,
      active: 0.08,
      recover: 0.4,
      bolt: true,
      kind: "special",
    };
  }
  return {
    startup: 0.14,
    active: 0.12,
    recover: 0.42,
    dmg: 18,
    kb: 380,
    lift: 540,
    knockdown: true,
    kind: "special",
    z: 86,
    rz: 70,
    rx: 52,
    hitstop: 0.08,
    shake: 9,
    points: 220,
  };
}

export function makePlayer(fighter, x, y) {
  return {
    id: "player",
    team: "player",
    kind: fighter.id,
    fighter,
    name: fighter.name,
    x,
    y,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    facing: 1,
    w: 42,
    h: 88,
    hp: fighter.hp,
    hpMax: fighter.hp,
    chip: 0,
    chipTimer: 0,
    state: "idle",
    stateT: 0,
    combo: 0,
    spawned: false,
    invuln: 0,
    flash: 0,
    holding: null,
    grabId: null,
    hurtT: 0,
    anim: 0,
    alive: true,
    scale: 1,
    isBoss: false,
    dashT: 0,
    jumpAttacked: false,
    jatkT: 0,
    queuedLight: false,
    bufferLight: 0,
    bufferHeavy: 0,
    bufferSpecial: 0,
    bufferJump: 0,
    bufferGrab: 0,
    lastTapL: -10,
    lastTapR: -10,
    wantDash: 0,
    deadT: 0,
    grabCd: 0,
    cashed: false,
    colors: fighter,
  };
}

export function bufferPlayerInput(player, input, dt = 0) {
  // Preserve one deliberate follow-up through startup and impact freeze.
  if (input.light && player.state === "light" && player.combo < 2) player.queuedLight = true;
  player.bufferLight = Math.max(0, player.bufferLight - dt);
  player.bufferHeavy = Math.max(0, player.bufferHeavy - dt);
  player.bufferSpecial = Math.max(0, player.bufferSpecial - dt);
  player.bufferJump = Math.max(0, player.bufferJump - dt);
  player.bufferGrab = Math.max(0, player.bufferGrab - dt);
  if (input.light) player.bufferLight = 0.14;
  if (input.heavy) player.bufferHeavy = 0.14;
  if (input.special) player.bufferSpecial = 0.14;
  if (input.jump) player.bufferJump = 0.12;
  if (input.grab) player.bufferGrab = 0.16;
}

function noteTap(player, time, dir, lastTap, savedFacing) {
  if (time - lastTap < 0.22) {
    player.wantDash = dir;
    player.dashOrigin = savedFacing;
  }
  if (player.facing !== dir) {
    player.holdFace = player.facing;
    player.holdFaceDir = dir;
    player.holdFaceUntil = time + 0.22;
  }
  return player.facing;
}

function takeTap(player, input, time) {
  if (input.justLeft) {
    player.facingAtTapL = noteTap(player, time, -1, player.lastTapL, player.facingAtTapL ?? player.facing);
    player.lastTapL = time;
  }
  if (input.justRight) {
    player.facingAtTapR = noteTap(player, time, 1, player.lastTapR, player.facingAtTapR ?? player.facing);
    player.lastTapR = time;
  }
}

function reachOf(player) {
  return player.fighter.reach + (player.holding?.kind === "pipe" ? 18 : 0);
}

function pipeMul(player) {
  return player.holding?.kind === "pipe" ? 1.35 : 1;
}

function swing(player, game, spec) {
  const kick = player.kind === "sayed" && player.holding?.kind !== "pipe" && !spec.radial && !spec.ownBox;
  const connected = melee(game, player, {
    dmg: spec.dmg * player.fighter.power * pipeMul(player),
    kb: spec.kb,
    lift: spec.lift,
    stun: spec.stun,
    knockdown: spec.knockdown,
    // Cover the visible leg continuously from the body, without the old distant dead zone.
    reach: kick ? 110 : (spec.radial ? 40 : reachOf(player) + (spec.reachAdd || 0)),
    rx: spec.rx,
    ry: spec.ry,
    z: kick ? 58 : spec.z,
    rz: kick ? 52 : spec.rz,
    radial: spec.radial,
    kind: spec.kind,
    points: spec.points,
    hitstop: spec.hitstop,
    shake: spec.shake,
    already: player.swingHits,
  });
  if (connected > 0 && player.holding?.kind === "pipe" && !spec.radial) noteWeaponSwing(player);
  return connected;
}

function endMove(player) {
  finishWeapon(player);
  player.state = "idle";
  player.combo = 0;
  player.queuedLight = false;
  player.vx = 0;
  player.vy = 0;
}

function grabTarget(game, player, reach = 100) {
  let best = null;
  let bestDx = reach;
  for (const enemy of game.enemies) {
    if (enemy.isMachine || enemy.untargetable || enemy.kind === "greene" || !enemy.alive || (enemy.isBoss && !hasGrapplePair(player, enemy)) || enemy.z > 16) continue;
    if (enemy.state === "down" || enemy.state === "air" || enemy.state === "dead" || enemy.state === "grabbed") continue;
    const dx = (enemy.x - player.x) * player.facing;
    const dy = Math.abs(enemy.y - player.y);
    if (dx >= 0 && dx < bestDx && dy < 30) {
      best = enemy;
      bestDx = Math.max(0, dx);
    }
  }
  return best;
}

function startGrab(game, player, enemy) {
  // Never swap character art midway through a hold when a lazy sheet arrives.
  player.grapplePairLocked = undefined;
  player.grapplePairLocked = hasGrapplePair(player, enemy);
  player.state = "grab";
  player.stateT = 0;
  player.grabId = enemy.id;
  player.grabHits = 0;
  player.grabStrikeT = 0;
  player.grabStrikeConnected = false;
  player.grabStartX = enemy.x;
  player.grabStartY = enemy.y;
  player.bufferGrab = 0;
  player.vx = 0;
  player.vy = 0;
  enemy.state = "grabbed";
  enemy.stateT = 0;
  enemy.vx = 0;
  enemy.vy = 0;
  enemy.vz = 0;
  game.banner = "Grabbed Â· J strike Â· K throw";
  game.bannerT = 1.1;
}

function startBackstep(player) {
  player.facing = player.dashOrigin || player.facing;
  player.holdFaceUntil = 0;
  player.holdFaceDir = 0;
  player.state = "backstep";
  player.stateT = 0;
  player.backArmed = false;
  player.vx = 0;
  player.vy = 0;
  play("dash");
}

function startSpecial(player) {
  const spec = specialSpec(player);
  spendSpecial(player);
  player.state = "special";
  player.stateT = 0;
  player.spawned = false;
  player.swingHits = new Set();
  player.invuln = Math.max(player.invuln, spec.startup);
  player.vx = 0;
  player.vy = 0;
  play("special");
}

function startMove(player, name) {
  player.state = name;
  player.stateT = 0;
  player.spawned = false;
  player.swingHits = new Set();
  player.vx = 0;
  player.vy = 0;
  if (name === "heavy" || name === "lunge" || name === "reversal") play("heavy");
  if (name === "reversal") player.invuln = Math.max(player.invuln, player.kind === "sayed" ? 0.08 : 0.12);
  if (name === "dashatk") play("dash");
}

function tryOffense(player, game, input) {
  if (player.bufferJump > 0 && player.z <= 0) {
    player.bufferJump = 0;
    player.state = "jump";
    player.vz = 820;
    player.jumpAttacked = false;
    player.spawned = false;
    player.jatkT = 0;
    player.vx = input.x * player.fighter.speed;
    player.vy = 0;
    play("jump");
    return true;
  }
  if (player.bufferSpecial > 0 && player.z <= 0) {
    player.bufferSpecial = 0;
    startSpecial(player);
    return true;
  }
  if (player.holding?.kind === "bottle" && player.bufferHeavy > 0) {
    player.bufferHeavy = 0;
    launchHeld(game, player);
    player.state = "throw";
    player.stateT = 0;
    return true;
  }
  if (player.bufferHeavy > 0) {
    player.bufferHeavy = 0;
    if (player.holding?.kind === "pipe") {
      launchHeld(game, player);
      player.state = "throw";
      player.stateT = 0;
    } else if (input.x === -player.facing) {
      startMove(player, "reversal");
    } else if (input.x === player.facing) {
      startMove(player, "lunge");
    } else {
      startMove(player, "heavy");
    }
    return true;
  }
  if (player.bufferLight > 0) {
    player.bufferLight = 0;
    // A neighbor in need beside you always comes first. Strike becomes help.
    if (player.state !== "dash" && player.z <= 0) {
      const cit = helpTarget(game, player);
      if (cit) {
        startHelp(game, player, cit);
        return true;
      }
    }
    if (player.state === "dash") {
      startMove(player, "dashatk");
      return true;
    }
    if (player.holding?.kind === "bottle") {
      launchHeld(game, player);
      player.state = "throw";
      player.stateT = 0;
      return true;
    }
    startMove(player, "light");
    player.combo = 0;
    return true;
  }
  return false;
}

function tryGrab(player, game, reach) {
  if (player.grabCd > 0 || player.z > 8) return false;
  const enemy = grabTarget(game, player, reach);
  if (!enemy) return false;
  startGrab(game, player, enemy);
  return true;
}

function steer(player, input, time) {
  const speed = player.fighter.speed;
  const diagonal = Math.max(1, Math.hypot(input.x, input.y));
  player.vx = input.x * speed / diagonal;
  player.vy = input.y * speed * 0.72 / diagonal;
  // The first tap already records the old facing for a double-tap backstep.
  if (input.x !== 0) player.facing = input.x;
  const moving = input.x !== 0 || input.y !== 0;
  player.state = moving ? "walk" : "idle";
}

function updateLight(player, game, dt) {
  const table = player.kind === "sayed" ? KICKS : LIGHTS;
  const step = table[player.combo] || table[0];
  player.stateT += dt;
  player.vx = 0;
  player.vy = 0;
  if (!player.spawned && player.stateT >= step.startup) {
    player.spawned = true;
    swing(player, game, {
      dmg: step.dmg,
      kb: step.kb,
      lift: step.lift,
      stun: step.stun,
      knockdown: step.knockdown,
      kind: player.combo === 2 ? "heavy" : "light",
      points: 100 + player.combo * 20,
      hitstop: player.combo === 2 ? 0.07 : 0.045,
      shake: player.combo === 2 ? 8 : 4,
    });
  }
  const linkAt = step.startup + step.active;
  if (player.combo < 2 && (player.queuedLight || player.bufferLight > 0) && player.stateT >= linkAt) {
    player.bufferLight = 0;
    finishWeapon(player);
    player.queuedLight = false;
    player.combo += 1;
    player.stateT = 0;
    player.spawned = false;
    player.swingHits = new Set();
    return;
  }
  if (player.stateT >= linkAt + player.fighter.comboWindow) endMove(player);
}

function moveSpec(player) {
  if (player.state === "special") return specialSpec(player);
  if (player.state === "lunge") return lungeSpec(player);
  if (player.state === "reversal") return reversalSpec(player);
  return MOVES[player.state];
}

// Rendering reads the same timings that gameplay uses for damage and recovery.
export function playerMoveWindow(player) {
  if (player.state === "throw") return { startup: 0.16, active: 0.04, total: 0.42 };
  if (player.state === "help") return helpWindow(player);
  if (player.state === "light") {
    const table = player.kind === "sayed" ? KICKS : LIGHTS;
    const step = table[player.combo] || table[0];
    return { startup: step.startup, active: step.active, total: step.startup + step.active + player.fighter.comboWindow };
  }
  const spec = moveSpec(player);
  if (!spec) return null;
  return { startup: spec.startup, active: spec.active, total: spec.startup + spec.active + spec.recover };
}

function updateTimed(player, game, dt) {
  const spec = moveSpec(player);
  player.stateT += dt;
  if (spec.lunge && player.stateT < spec.lungeFor) {
    player.vx = player.facing * player.fighter.speed * spec.lunge;
    integrate(player, dt);
  } else {
    player.vx = 0;
  }
  if (!player.spawned && player.stateT >= spec.startup && player.stateT < spec.startup + spec.active + 0.02) {
    player.spawned = true;
    if (spec.bolt) spawnBolt(game, player);
    else swing(player, game, spec);
  }
  if (player.stateT >= spec.startup + spec.active + spec.recover) endMove(player);
}

function updateJump(player, game, input, dt) {
  player.vx = input.x * player.fighter.speed * 0.9;
  if (input.x !== 0) player.facing = input.x;
  player.vy = input.y * player.fighter.speed * 0.45;
  if (player.bufferLight > 0 && !player.jumpAttacked) {
    player.bufferLight = 0;
    player.jumpAttacked = true;
    player.jatkT = 0;
    player.spawned = false;
    player.swingHits = new Set();
    player.state = "jatk";
  }
  const z0 = player.z;
  integrate(player, dt);
  if (player.state === "jatk") {
    player.jatkT += dt;
    if (!player.spawned && player.jatkT >= (player.kind === "sayed" ? 0.08 : 0.04)) {
      player.spawned = true;
      swing(player, game, { dmg: 10, kb: 200, lift: 40, kind: "light", points: 120, reach: reachOf(player) });
    }
  }
  if (z0 > 0 && player.z === 0) {
    finishWeapon(player);
    player.state = "idle";
    player.jumpAttacked = false;
    player.vx = 0;
    player.vy = 0;
  }
}

// Pair geometry is measured in world pixels, independent of facing.
export function grabContactDistance(player, enemy) {
  if (enemy && hasGrapplePair(player, enemy)) return grapplePairDistance(player, enemy);
  const distances = player.fighter.id === "sayed"
    ? { cruz: 83, pete: 79, pete_ww: 88, vance: 72, vance_worried: 72, greene: 82 }
    : { cruz: 108, pete: 100, pete_ww: 105, vance: 96, vance_worried: 96, greene: 100 };
  return distances[enemy?.sprite || enemy?.kind] ?? (player.fighter.id === "sayed" ? 78 : 70);
}

function updateGrab(player, game, input, dt) {
  const enemy = game.enemies.find((ent) => ent.id === player.grabId);
  player.stateT += dt;
  player.grabStrikeT = Math.max(0, (player.grabStrikeT || 0) - dt);
  player.vx = 0;
  player.vy = 0;
  if (!enemy || !enemy.alive) {
    player.grabId = null;
    player.grabCd = 0.55;
    player.state = "idle";
    return;
  }
  // The third pummel releases the victim into knockdown; finish the hero's recovery
  // without pinning the airborne victim back to the contact position.
  if (enemy.state !== "grabbed") {
    if (player.grabStrikeT <= 0) {
      player.grabId = null; player.grabCd = .55; player.state = "idle";
    }
    return;
  }
  const reachProgress = Math.min(1, player.stateT / 0.24);
  const ease = reachProgress * reachProgress * (3 - 2 * reachProgress);
  enemy.x = (player.grabStartX ?? player.x + player.facing * grabContactDistance(player, enemy)) * (1 - ease) + (player.x + player.facing * grabContactDistance(player, enemy)) * ease;
  enemy.y = (player.grabStartY ?? player.y) * (1 - ease) + player.y * ease;
  enemy.z = 0;
  enemy.facing = -player.facing;
  // Damage happens at extension, not the key-down / wind-up frame.
  if (player.grabStrikeT > 0 && player.grabStrikeT <= grapplePairContactRemaining(player, enemy) && !player.grabStrikeConnected) {
    player.grabStrikeConnected = true;
    melee(game, player, { dmg: (player.grabHits >= 3 ? 10 : 6) * player.fighter.power, kb: player.grabHits >= 3 ? 180 : 0, lift: player.grabHits >= 3 ? 360 : 0, knockdown: player.grabHits >= 3,
      reach: Math.max(128, grabContactDistance(player, enemy) + 24), kind: "grab", points: 80, hitstop: .065, shake: 3,
      targetId: enemy.id, ...grapplePairImpact(player, enemy),
      already: new Set() });
  }
  const punch = player.bufferLight > 0 && player.stateT >= 0.24 && player.grabStrikeT === 0;
  if (punch) {
    player.bufferLight = 0;
    player.grabHits += 1;
    player.grabStrikeT = grapplePairDuration(player, enemy);
    player.grabStrikeConnected = false;
    return;
  }
  const throwNow = player.bufferHeavy > 0;
  // An expiring hold must not cut a paired impact/recovery sequence in half.
  if (player.stateT > 3.5 && player.grabStrikeT === 0 && !throwNow) {
    enemy.state = "idle"; enemy.vx = 0; player.grabId = null;
    player.grabCd = 0.45; player.state = "idle"; return;
  }
  if (throwNow) {
    const dir = input.x === -player.facing ? -player.facing : player.facing;
    player.bufferLight = 0;
    player.bufferHeavy = 0;
    player.grabCd = 0.55;
    player.throwDir = dir;
    player.spawned = false;
    player.state = "throw";
    player.stateT = 0;
  }
}

function applyThrow(game, player, enemy, dir) {
  enemy.state = "hurt";
  melee(game, player, {
    dmg: 10 * player.fighter.power,
    kb: 420,
    lift: 520,
    knockdown: true,
    reach: Math.max(128, grabContactDistance(player, enemy) + 24),
    targetId: enemy.id,
    kind: "throw",
    points: 250,
    hitstop: 0.07,
    shake: 8,
    already: new Set(),
  });
  if (enemy.alive) {
    enemy.state = "air";
    enemy.vz = 480;
    enemy.vx = dir * 460;
    enemy.juggle = 1;
    enemy.toss = {
      life: 0.42,
      dmg: Math.round(8 * player.fighter.power),
      facing: dir,
      hit: new Set([enemy.id]),
    };
  }
  play("throw");
}

function updateBackstep(player, dt) {
  player.stateT += dt;
  if (!player.backArmed && player.stateT >= 0.05) {
    player.backArmed = true;
    player.invuln = Math.max(player.invuln, 0.1);
  }
  player.vx = -player.facing * player.fighter.speed * 2.1;
  player.vy = 0;
  integrate(player, dt);
  if (player.stateT >= 0.22) {
    player.state = "idle";
    player.vx = 0;
    player.vy = 0;
  }
}

function respawn(game) {
  const fresh = makePlayer(game.player.fighter, game.cameraX + 220, 550);
  fresh.invuln = 1.7;
  fresh.facing = 1;
  game.player = fresh;
}

export function updatePlayer(player, game, input, dt) {
  // A hit or death can interrupt a grapple. Never strand its target in grabbed.
  if (player.grabId && player.state !== "grab" && player.state !== "throw") {
    const held = game.enemies.find(ent => ent.id === player.grabId);
    if (held?.state === "grabbed") { held.state = "idle"; held.stateT = 0; }
    player.grabId = null;
  }
  if (player.helpId && player.state !== "help") finishHelp(game, player);
  player.anim += dt;
  if (player.grabCd > 0) player.grabCd = Math.max(0, player.grabCd - dt);
  if (["hurt", "air", "down", "getup", "dead"].includes(player.state)) player.queuedLight = false;
  bufferPlayerInput(player, input, dt);
  takeTap(player, input, game.time);

  if (player.state === "grabbed") {
    if (input.light || input.heavy || input.jump) player.grabMash = (player.grabMash || 0) + 1;
    return;
  }

  if (updateBody(player, dt)) {
    if (player.state === "getup" && player.bufferLight > 0 && player.hurtT < 0.16) {
      player.bufferLight = 0;
      startMove(player, "reversal");
    } else if (player.state === "dead" && player.deadT <= 0 && !player.cashed && game.mode === "play") {
      player.cashed = true;
      game.lives -= 1;
      if (game.lives <= 0) game.mode = "gameover";
      else respawn(game);
    }
    return;
  }

  if (player.state === "grab") {
    updateGrab(player, game, input, dt);
    return;
  }
  if (player.state === "help") {
    player.stateT += dt;
    player.vx = 0;
    player.vy = 0;
    const timing = helpWindow(player);
    const action = player.helpAction;
    if (action) {
      const u = Math.min(1, player.stateT / action.approach);
      player.x = action.fromX + (action.targetX - action.fromX) * u;
      player.y = action.fromY + (action.targetY - action.fromY) * u;
      player.gaitDistance = (player.gaitDistance || 0) + Math.hypot(action.targetX - action.fromX, action.targetY - action.fromY) / action.approach * dt;
    }
    if (!player.spawned && player.stateT >= timing.startup) {
      player.spawned = true;
      const cit = (game.citizens || []).find((c) => c.id === player.helpId);
      deliverHelp(game, player, cit);
    }
    if (player.stateT >= timing.total) {
      finishHelp(game, player);
      endMove(player);
    }
    return;
  }
  if (player.state === "backstep") {
    updateBackstep(player, dt);
    return;
  }
  if (player.state === "light") {
    updateLight(player, game, dt);
    // Keep the standing combo window, but permit stepping out after recovery.
    const timing = playerMoveWindow(player);
    if (player.state === "light" && player.combo < 2 && !player.queuedLight &&
        player.bufferLight <= 0 && (input.x || input.y) &&
        player.stateT >= timing.startup + timing.active + 0.1) {
      endMove(player);
      steer(player, input, game.time);
      integrate(player, dt);
    }
    return;
  }
  if (player.state === "heavy" || player.state === "dashatk" || player.state === "special" || player.state === "lunge" || player.state === "reversal") {
    updateTimed(player, game, dt);
    return;
  }
  if (player.state === "throw") {
    player.stateT += dt;
    const timing = playerMoveWindow(player);
    const held = game.enemies.find(ent => ent.id === player.grabId);
    if (held?.alive && !player.spawned) {
      held.x = player.x + player.facing * grabContactDistance(player, held);
      held.y = player.y;
      if (player.stateT >= timing.startup) {
        player.spawned = true;
        applyThrow(game, player, held, player.throwDir || player.facing);
        player.grabId = null;
      }
    }
    if (player.stateT >= timing.total) { player.grabId = null; endMove(player); }
    return;
  }
  if (player.state === "jump" || player.state === "jatk") {
    updateJump(player, game, input, dt);
    return;
  }

  if ((player.state === "idle" || player.state === "walk" || player.state === "dash") && player.wantDash) {
    const tap = player.wantDash;
    player.wantDash = 0;
    if (tap === -(player.dashOrigin || player.facing)) startBackstep(player);
    else {
      player.facing = tap;
      player.holdFaceUntil = 0;
      player.holdFaceDir = 0;
      player.state = "dash";
      player.dashT = 0.18;
      play("dash");
    }
  }

  if (player.state === "backstep") {
    updateBackstep(player, dt);
    return;
  }

  if (player.bufferGrab > 0 && (player.state === "idle" || player.state === "walk" || player.state === "dash")) {
    player.bufferGrab = 0;
    if (tryGrab(player, game, 120)) return;
  }

  if (player.state === "dash") {
    if (tryOffense(player, game, input)) return;
    const holding = input.x === player.facing;
    if (player.dashT > 0) player.dashT -= dt;
    if (player.dashT <= 0 && !holding) {
      steer(player, input, game.time);
      integrate(player, dt);
      return;
    }
    player.vx = player.facing * player.fighter.speed * 2.35;
    player.vy = input.y * player.fighter.speed * 0.4;
    integrate(player, dt);
    return;
  }

  if (tryOffense(player, game, input)) return;
  steer(player, input, game.time);
  integrate(player, dt);
}

export function fighterById(id) {
  return FIGHTERS[id] || FIGHTERS.mamdani;
}
