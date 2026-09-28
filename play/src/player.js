import { play } from "./audio.js";
import { FIGHTERS } from "./fighters.js?v=art";
import { integrate, melee, spendSpecial, updateBody } from "./combat.js?v=fight";
import { finishWeapon, launchHeld, noteWeaponSwing, spawnBolt } from "./weapons.js?v=fight";

const LIGHTS = [
  { startup: 0.2, active: 0.12, dmg: 7, kb: 180, lift: 0 },
  { startup: 0.18, active: 0.12, dmg: 8, kb: 200, lift: 0 },
  { startup: 0.24, active: 0.14, dmg: 12, kb: 340, lift: 520, knockdown: true },
];

const KICKS = [
  { startup: 0.08, active: 0.07, dmg: 7, kb: 180, lift: 0 },
  { startup: 0.07, active: 0.07, dmg: 8, kb: 200, lift: 0 },
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
    bufferLight: 0,
    bufferHeavy: 0,
    bufferSpecial: 0,
    bufferJump: 0,
    lastTapL: -10,
    lastTapR: -10,
    wantDash: 0,
    deadT: 0,
    cashed: false,
    colors: fighter,
  };
}

function buffer(player, input, dt) {
  player.bufferLight = Math.max(0, player.bufferLight - dt);
  player.bufferHeavy = Math.max(0, player.bufferHeavy - dt);
  player.bufferSpecial = Math.max(0, player.bufferSpecial - dt);
  player.bufferJump = Math.max(0, player.bufferJump - dt);
  if (input.light) player.bufferLight = 0.14;
  if (input.heavy) player.bufferHeavy = 0.14;
  if (input.special) player.bufferSpecial = 0.14;
  if (input.jump) player.bufferJump = 0.12;
}

function takeTap(player, input, time) {
  if (input.justLeft) {
    if (time - player.lastTapL < 0.22) player.wantDash = -1;
    player.lastTapL = time;
  }
  if (input.justRight) {
    if (time - player.lastTapR < 0.22) player.wantDash = 1;
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
  const kick = player.kind === "sayed" && !spec.radial;
  const connected = melee(game, player, {
    dmg: spec.dmg * player.fighter.power * pipeMul(player),
    kb: spec.kb,
    lift: spec.lift,
    knockdown: spec.knockdown,
    reach: kick ? 300 : (spec.radial ? 40 : reachOf(player)),
    rx: kick ? 78 : spec.rx,
    ry: kick ? 56 : spec.ry,
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
  player.vx = 0;
  player.vy = 0;
}

function grabTarget(game, player) {
  let best = null;
  let bestDx = 48;
  for (const enemy of game.enemies) {
    if (!enemy.alive || enemy.z > 12) continue;
    if (enemy.state === "down" || enemy.state === "air" || enemy.state === "dead") continue;
    const dx = (enemy.x - player.x) * player.facing;
    const dy = Math.abs(enemy.y - player.y);
    if (dx > 8 && dx < bestDx && dy < 30) {
      best = enemy;
      bestDx = dx;
    }
  }
  return best;
}

function startGrab(player, enemy) {
  player.state = "grab";
  player.stateT = 0;
  player.grabId = enemy.id;
  player.grabHits = 0;
  player.vx = 0;
  player.vy = 0;
  enemy.state = "grabbed";
  enemy.vx = 0;
  enemy.vy = 0;
  enemy.vz = 0;
}

function startBackstep(player) {
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
  if (name === "heavy") play("heavy");
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
  if (player.holding?.kind === "bottle" && (player.bufferLight > 0 || player.bufferHeavy > 0)) {
    player.bufferLight = 0;
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
    } else {
      startMove(player, "heavy");
    }
    return true;
  }
  if (player.bufferLight > 0) {
    player.bufferLight = 0;
    if (player.state === "dash") {
      startMove(player, "dashatk");
      return true;
    }
    if (!player.holding) {
      const enemy = grabTarget(game, player);
      if (enemy?.isBoss) {
        melee(game, player, {
          dmg: 4,
          kb: 30,
          lift: 0,
          reach: 56,
          kind: "light",
          points: 40,
          hitstop: 0.03,
          already: new Set(),
        });
        player.state = "throw";
        player.stateT = 0;
        return true;
      }
      if (enemy) {
        startGrab(player, enemy);
        return true;
      }
    }
    startMove(player, "light");
    player.combo = 0;
    return true;
  }
  return false;
}

function steer(player, input) {
  const speed = player.fighter.speed;
  player.vx = input.x * speed;
  player.vy = input.y * speed * 0.72;
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
      knockdown: step.knockdown,
      kind: player.combo === 2 ? "heavy" : "light",
      points: 100 + player.combo * 20,
      hitstop: player.combo === 2 ? 0.07 : 0.045,
      shake: player.combo === 2 ? 8 : 4,
    });
  }
  const linkAt = step.startup + step.active;
  if (player.combo < 2 && player.bufferLight > 0 && player.stateT >= linkAt) {
    player.bufferLight = 0;
    finishWeapon(player);
    player.combo += 1;
    player.stateT = 0;
    player.spawned = false;
    player.swingHits = new Set();
    return;
  }
  if (player.stateT >= linkAt + player.fighter.comboWindow) endMove(player);
}

function updateTimed(player, game, dt) {
  const spec = player.state === "special" ? specialSpec(player) : MOVES[player.state];
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

function updateGrab(player, game, input, dt) {
  const enemy = game.enemies.find((ent) => ent.id === player.grabId);
  player.stateT += dt;
  player.vx = 0;
  player.vy = 0;
  if (!enemy || !enemy.alive) {
    player.grabId = null;
    player.state = "idle";
    return;
  }
  enemy.x = player.x + player.facing * 52;
  enemy.y = player.y;
  enemy.z = 0;
  enemy.facing = -player.facing;
  const punch = player.bufferLight > 0 && player.grabHits < 3 && player.stateT >= 0.16;
  if (punch) {
    player.bufferLight = 0;
    player.grabHits += 1;
    player.stateT = 0;
    melee(game, player, {
      dmg: 6 * player.fighter.power,
      kb: 0,
      lift: 0,
      reach: 64,
      kind: "grab",
      points: 80,
      hitstop: 0.04,
      shake: 3,
      already: new Set(),
    });
    return;
  }
  const throwNow = player.bufferHeavy > 0 || (player.bufferLight > 0 && player.grabHits >= 3) || player.stateT > 0.9;
  if (throwNow) {
    const dir = input.x === -player.facing ? -player.facing : player.facing;
    player.bufferLight = 0;
    player.bufferHeavy = 0;
    enemy.state = "idle";
    enemy.alive = true;
    applyThrow(game, player, enemy, dir);
    player.grabId = null;
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
    reach: 64,
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
  player.anim += dt;
  buffer(player, input, dt);
  takeTap(player, input, game.time);

  if (updateBody(player, dt)) {
    if (player.state === "dead" && player.deadT <= 0 && !player.cashed && game.mode === "play") {
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
  if (player.state === "backstep") {
    updateBackstep(player, dt);
    return;
  }
  if (player.state === "light") {
    updateLight(player, game, dt);
    return;
  }
  if (player.state === "heavy" || player.state === "dashatk" || player.state === "special") {
    updateTimed(player, game, dt);
    return;
  }
  if (player.state === "throw") {
    player.stateT += dt;
    if (player.stateT >= 0.22) endMove(player);
    return;
  }
  if (player.state === "jump" || player.state === "jatk") {
    updateJump(player, game, input, dt);
    return;
  }

  if ((player.state === "idle" || player.state === "walk" || player.state === "dash") && player.wantDash) {
    const tap = player.wantDash;
    player.wantDash = 0;
    if (tap === -player.facing) startBackstep(player);
    else {
      player.facing = tap;
      player.state = "dash";
      player.dashT = 0.18;
      play("dash");
    }
  }

  if (player.state === "backstep") {
    updateBackstep(player, dt);
    return;
  }

  if (player.state === "dash") {
    if (tryOffense(player, game, input)) return;
    const holding = input.x === player.facing;
    if (player.dashT > 0) player.dashT -= dt;
    if (player.dashT <= 0 && !holding) {
      steer(player, input);
      integrate(player, dt);
      return;
    }
    player.vx = player.facing * player.fighter.speed * 2.35;
    player.vy = input.y * player.fighter.speed * 0.4;
    integrate(player, dt);
    return;
  }

  if (tryOffense(player, game, input)) return;
  steer(player, input);
  integrate(player, dt);
}

export function fighterById(id) {
  return FIGHTERS[id] || FIGHTERS.mamdani;
}
