import { melee, updateBody } from "./combat.js?v=feel1";
import { WORLD } from "./stages.js?v=idle21";
import { spawnSatellite, spawnShot, spawnSombrero } from "./weapons.js?v=chibi-site2";

const KINDS = {
  grunt: {
    name: "Grunt",
    hp: 32,
    speed: 74,
    w: 40,
    h: 84,
    dmg: 8,
    reach: 50,
    scale: 1,
    body: "#6e5344",
    trim: "#d7c4a3",
    skin: "#e0b088",
    pants: "#2c2622",
    hat: "cap",
  },
  rusher: {
    name: "Rusher",
    hp: 26,
    speed: 68,
    w: 40,
    h: 84,
    dmg: 12,
    reach: 48,
    scale: 1,
    body: "#8d3b45",
    trim: "#f0d0a0",
    skin: "#c98862",
    pants: "#241818",
    hat: "none",
  },
  thrower: {
    name: "Thrower",
    hp: 22,
    speed: 62,
    w: 38,
    h: 82,
    dmg: 9,
    reach: 46,
    scale: 1,
    body: "#2f6d62",
    trim: "#e7d27a",
    skin: "#dbb08a",
    pants: "#1c2422",
    hat: "tail",
  },
  crane: {
    name: "The Landlord",
    hp: 260,
    speed: 44,
    w: 72,
    h: 118,
    dmg: 16,
    reach: 108,
    scale: 1.45,
    boss: true,
    body: "#4e5968",
    trim: "#e2b33c",
    skin: "#c49a78",
    pants: "#2a2e33",
    hat: "helm",
  },
  mara: {
    name: "Super PAC",
    hp: 200,
    speed: 86,
    w: 48,
    h: 96,
    dmg: 10,
    reach: 58,
    scale: 1.28,
    boss: true,
    body: "#6a3a68",
    trim: "#f2a3c7",
    skin: "#e0b090",
    pants: "#241824",
    hat: "tail",
  },
  signal: {
    name: "The Lobbyist",
    hp: 220,
    speed: 132,
    w: 46,
    h: 96,
    dmg: 11,
    reach: 64,
    scale: 1.22,
    boss: true,
    body: "#1e2430",
    trim: "#3ecf8e",
    skin: "#d7a888",
    pants: "#12151c",
    hat: "cap",
  },
  greene: {
    name: "Marjorie Taylor Greene",
    sprite: "greene",
    hp: 58,
    speed: 250,
    w: 44,
    h: 96,
    dmg: 11,
    reach: 52,
    scale: 1,
    body: "#d9d4ea",
    trim: "#1c1c1c",
    skin: "#f0c8a8",
    pants: "#cfc8e4",
    hat: "none",
  },
  cruz: {
    name: "Ted Cruz",
    sprite: "cruz",
    hp: 68,
    speed: 160,
    w: 44,
    h: 96,
    dmg: 12,
    reach: 54,
    scale: 1,
    body: "#1d3f86",
    trim: "#c4a15a",
    skin: "#e4b48a",
    pants: "#1a2744",
    hat: "sombrero",
  },
  vance: {
    name: "JD Vance",
    sprite: "vance",
    hp: 130,
    speed: 145,
    w: 48,
    h: 100,
    dmg: 14,
    reach: 62,
    scale: 1.08,
    body: "#243656",
    trim: "#d7c4a3",
    skin: "#e0b088",
    pants: "#1c2430",
    hat: "none",
  },
  trump: {
    name: "Donald Trump",
    sprite: "trump",
    hp: 320,
    speed: 118,
    w: 64,
    h: 110,
    dmg: 18,
    reach: 96,
    scale: 1.2,
    boss: true,
    body: "#1d4e89",
    trim: "#c9a227",
    skin: "#f0c8a0",
    pants: "#1a3358",
    hat: "none",
  },
};

let seq = 1;

export function makeEnemy(kind, x, y) {
  const stats = KINDS[kind];
  return {
    id: `e${seq++}`,
    team: "enemy",
    kind,
    sprite: stats.sprite || kind,
    name: stats.name,
    x,
    y: clampY(y),
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    facing: -1,
    w: stats.w,
    h: stats.h,
    hp: stats.hp,
    hpMax: stats.hp,
    chip: 0,
    chipTimer: 0,
    state: "idle",
    stateT: 0,
    combo: 0,
    spawned: false,
    invuln: 0,
    flash: 0,
    hurtT: 0,
    anim: Math.random() * 4,
    alive: true,
    scale: stats.scale,
    isBoss: !!stats.boss,
    attackCd: 0.35 + Math.random() * 0.25,
    throwCd: 0.8,
    dashCd: 2.2,
    armor: 0,
    phase2: false,
    summoned: false,
    swingHits: new Set(),
    hit1: false,
    hit2: false,
    colors: stats,
    dmg: stats.dmg,
    speed: stats.speed,
    reach: stats.reach,
    deadT: 0,
  };
}

function clampY(y) {
  return Math.max(WORLD.floorTop, Math.min(WORLD.floorBottom, y));
}

function claim(game, enemy) {
  if (enemy.isBoss) return true;
  if (game.attackSlot && game.attackSlot !== enemy.id) return false;
  game.attackSlot = enemy.id;
  return true;
}

function release(game, enemy) {
  if (game.attackSlot === enemy.id) game.attackSlot = null;
}

function tryEnemyGrab(enemy, game) {
  const player = game.player;
  if (!player?.alive || player.invuln > 0 || player.z > 10) return false;
  if (player.state === "grabbed" || player.state === "air" || player.state === "down" || player.state === "dead" || player.state === "getup") return false;
  const dx = (player.x - enemy.x) * enemy.facing;
  const dy = Math.abs(player.y - enemy.y);
  if (dx < 12 || dx > 68 || dy > 28) return false;
  if (!claim(game, enemy)) return false;
  enemy.state = "grab";
  enemy.stateT = 0;
  enemy.vx = 0;
  enemy.vy = 0;
  player.state = "grabbed";
  player.grabMash = 0;
  player.vx = 0;
  player.vy = 0;
  player.vz = 0;
  player.z = 0;
  game.banner = "Mash J to break the grab";
  game.bannerT = 0.8;
  return true;
}

function updateEnemyGrab(enemy, game, dt) {
  const player = game.player;
  enemy.stateT += dt;
  enemy.vx = 0;
  enemy.vy = 0;
  if (!player || player.state !== "grabbed") {
    enemy.state = "idle";
    enemy.attackCd = 0.6;
    release(game, enemy);
    return;
  }
  player.x = enemy.x + enemy.facing * 54;
  player.y = enemy.y;
  player.z = 0;
  player.facing = -enemy.facing;
  const broke = (player.grabMash || 0) >= 3;
  if (broke || enemy.stateT > 0.8) {
    player.grabMash = 0;
    if (broke) {
      player.state = "idle";
      player.vx = -enemy.facing * 180;
      player.invuln = Math.max(player.invuln || 0, 0.4);
    } else {
      player.state = "air";
      player.vz = 420;
      player.vx = enemy.facing * 400;
      player.hp = Math.max(1, player.hp - enemy.dmg);
      player.flash = 0.12;
    }
    enemy.state = "throw";
    enemy.stateT = 0;
    release(game, enemy);
  }
}

function face(enemy, player) {
  enemy.facing = player.x >= enemy.x ? 1 : -1;
}

function approach(enemy, player, dt, speed = enemy.speed) {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  face(enemy, player);
  enemy.state = "walk";
  enemy.vx = Math.abs(dx) > 6 ? Math.sign(dx) * speed : 0;
  enemy.vy = Math.abs(dy) > 10 ? Math.sign(dy) * speed * 0.8 : 0;
  enemy.x += enemy.vx * dt;
  enemy.y = clampY(enemy.y + enemy.vy * dt);
}

function checkPhase(enemy, game) {
  if (!enemy.isBoss || enemy.phase2 || enemy.hp > enemy.hpMax * 0.5) return;
  enemy.phase2 = true;
  if (enemy.kind === "crane") enemy.armor = 0.65;
  if (enemy.kind === "signal" && !enemy.summoned) {
    enemy.summoned = true;
    game.pending.push(makeEnemy("grunt", enemy.x - 100, enemy.y - 48));
    game.pending.push(makeEnemy("grunt", enemy.x + 120, enemy.y + 42));
    game.banner = "Signal calls backup";
  } else {
    game.banner = `${enemy.name} gets serious`;
  }
  game.bannerT = 1.4;
}

function updateGrunt(enemy, game, dt) {
  const player = game.player;
  if (enemy.state === "grab") {
    updateEnemyGrab(enemy, game, dt);
    return;
  }
  if (enemy.state === "throw") {
    enemy.stateT += dt;
    if (enemy.stateT >= 0.35) {
      enemy.state = "idle";
      enemy.attackCd = 0.8;
    }
    return;
  }
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  face(enemy, player);
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.spawned && enemy.stateT >= 0.4) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg,
        kb: 190,
        lift: 10,
        reach: enemy.reach,
        already: enemy.swingHits,
        kind: "light",
        hitstop: 0.04,
      });
    }
    if (enemy.stateT >= 0.72) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.55;
      enemy.swingHits = new Set();
      release(game, enemy);
    }
    return;
  }
  if (Math.abs(dx) < enemy.reach && Math.abs(dy) < 30 && enemy.attackCd <= 0 && claim(game, enemy)) {
    enemy.swingN = (enemy.swingN || 0) + 1;
    if (enemy.swingN % 2 === 0 && tryEnemyGrab(enemy, game)) return;
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  approach(enemy, player, dt);
}

function updateRusher(enemy, game, dt) {
  const player = game.player;
  face(enemy, player);
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    enemy.vx = 0;
    if (!enemy.spawned && enemy.stateT >= 0.22) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg,
        kb: 160,
        lift: 0,
        reach: enemy.reach,
        already: enemy.swingHits,
        kind: "light",
        hitstop: 0.04,
      });
    }
    if (enemy.stateT >= 0.5) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.7;
      enemy.swingHits = new Set();
      release(game, enemy);
    }
    return;
  }
  if (enemy.state === "windup") {
    enemy.stateT += dt;
    enemy.vx = 0;
    if (enemy.stateT >= 0.32) {
      enemy.state = "charge";
      enemy.stateT = 0;
      enemy.swingHits = new Set();
      face(enemy, player);
    }
    return;
  }
  if (enemy.state === "charge") {
    enemy.stateT += dt;
    enemy.vx = enemy.facing * 360;
    enemy.x += enemy.vx * dt;
      melee(game, enemy, {
      dmg: enemy.dmg,
      kb: 240,
      lift: 30,
      reach: enemy.reach,
      low: true,
      already: enemy.swingHits,
      kind: "heavy",
      hitstop: 0.05,
    });
    if (enemy.stateT >= 0.4) {
      enemy.state = "idle";
      enemy.attackCd = 1.2;
      enemy.swingHits = new Set();
    }
    return;
  }
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  if (enemy.attackCd <= 0 && Math.abs(dy) < 30 && Math.abs(dx) < enemy.reach && claim(game, enemy)) {
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  if (enemy.attackCd <= 0 && Math.abs(dy) < 34 && Math.abs(dx) < 420 && Math.abs(dx) > 70) {
    enemy.state = "windup";
    enemy.stateT = 0;
    return;
  }
  approach(enemy, player, dt);
}

function updateGreene(enemy, game, dt) {
  const player = game.player;
  if (enemy.state === "special") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.spawned && enemy.stateT >= 0.15) {
      enemy.spawned = true;
      spawnSatellite(game, player.x - 40, player.y, enemy.dmg + 6, -24);
      spawnSatellite(game, player.x + 40, player.y, enemy.dmg + 4, 24);
      game.banner = "Dodge the lock";
      game.bannerT = 1.3;
    }
    if (enemy.stateT >= 1.35) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.7;
    }
    return;
  }
  if (enemy.state === "leap") {
    enemy.stateT += dt;
    enemy.z += enemy.vz * dt;
    enemy.vz -= 1500 * dt;
    enemy.x += enemy.vx * dt;
    if (!enemy.spawned && enemy.vz < 0 && enemy.z < 90) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg + 2,
        kb: 220,
        lift: 80,
        reach: enemy.reach + 10,
        already: enemy.swingHits,
        kind: "heavy",
        hitstop: 0.05,
      });
    }
    if (enemy.z <= 0) {
      enemy.z = 0;
      enemy.vz = 0;
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.65;
      enemy.swingHits = new Set();
    }
    return;
  }
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.spawned && enemy.stateT >= 0.22) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg,
        kb: 160,
        lift: 10,
        reach: enemy.reach,
        already: enemy.swingHits,
        kind: "light",
        hitstop: 0.04,
      });
    }
    if (enemy.stateT >= 0.55) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.28;
      enemy.swingHits = new Set();
    }
    return;
  }
  const dx = player.x - enemy.x;
  const dy = Math.abs(player.y - enemy.y);
  const dist = Math.abs(dx);
  face(enemy, player);
  if (enemy.laserCd <= 0 && dist > 48 && dist < 760 && dy < 140) {
    enemy.laserCd = 1.6;
    enemy.state = "special";
    enemy.stateT = 0;
    enemy.spawned = false;
    return;
  }
  if (enemy.attackCd <= 0 && dist > 80 && dist < 260 && dy < 40) {
    enemy.state = "leap";
    enemy.stateT = 0;
    enemy.z = 0;
    enemy.vz = 480;
    enemy.vx = enemy.facing * 280;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    enemy.attackCd = 0.3;
    return;
  }
  if (dist < enemy.reach + 8 && dy < 32 && enemy.attackCd <= 0) {
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  enemy.state = "run";
  const moving = Math.abs(dx) > 8;
  enemy.vx = moving ? Math.sign(dx) * enemy.speed * 0.9 : 0;
  enemy.vy = dy > 12 ? Math.sign(player.y - enemy.y) * enemy.speed * 0.45 : 0;
  enemy.x += enemy.vx * dt;
  enemy.y = clampY(enemy.y + enemy.vy * dt);
}

function updateTrump(enemy, game, dt) {
  const player = game.player;
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.spawned && enemy.stateT >= 0.34) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: Math.max(6, enemy.dmg - 6),
        kb: 80,
        lift: 0,
        reach: 72,
        rx: 26,
        already: enemy.swingHits,
        kind: "light",
        hitstop: 0.03,
      });
    }
    if (enemy.stateT >= 0.72) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.48;
      enemy.swingHits = new Set();
    }
    return;
  }
  if (enemy.state === "doze") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (enemy.stateT >= 0.4) enemy.state = "idle";
    return;
  }
  const dx = player.x - enemy.x;
  const dy = Math.abs(player.y - enemy.y);
  face(enemy, player);
  if (Math.abs(dx) < 96 && dy < 40 && enemy.attackCd <= 0) {
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  enemy.dozeCd = (enemy.dozeCd ?? 4.8) - dt;
  if (enemy.dozeCd <= 0 && Math.abs(dx) > 160) {
    enemy.dozeCd = 7.5;
    enemy.state = "doze";
    enemy.stateT = 0;
    return;
  }
  approach(enemy, player, dt, enemy.speed);
}

function updateVance(enemy, game, dt) {
  const player = game.player;
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  if (enemy.state === "grab") {
    updateEnemyGrab(enemy, game, dt);
    return;
  }
  if (enemy.state === "throw") {
    enemy.stateT += dt;
    if (enemy.stateT >= 0.35) {
      enemy.state = "idle";
      enemy.attackCd = 1.1;
    }
    return;
  }
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.spawned && enemy.stateT >= 0.28) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg,
        kb: 140,
        lift: 30,
        reach: enemy.reach,
        already: enemy.swingHits,
        kind: "light",
        hitstop: 0.04,
      });
    }
    if (enemy.stateT >= 0.55) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.38;
      enemy.swingHits = new Set();
    }
    return;
  }
  if (enemy.state === "charge") {
    enemy.stateT += dt;
    enemy.z += enemy.vz * dt;
    enemy.vz -= 1700 * dt;
    if (enemy.z < 0) {
      enemy.z = 0;
      enemy.vz = 0;
    }
    enemy.vx = enemy.facing * 420;
    enemy.x += enemy.vx * dt;
    if (!enemy.spawned && enemy.stateT >= 0.16) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg + 1,
        kb: 180,
        lift: 40,
        reach: 64,
        already: enemy.swingHits,
        kind: "heavy",
        hitstop: 0.04,
      });
    }
    if (enemy.stateT >= 0.62) {
      enemy.state = "idle";
      enemy.z = 0;
      enemy.vz = 0;
      enemy.spawned = false;
      enemy.attackCd = 0.62;
      enemy.swingHits = new Set();
    }
    return;
  }
  face(enemy, player);
  const dist = Math.abs(dx);
  const ady = Math.abs(dy);
  if (dist < 84 && ady < 30 && enemy.attackCd <= 0 && claim(game, enemy)) {
    enemy.swingN = (enemy.swingN || 0) + 1;
    if (enemy.swingN % 3 === 0 && tryEnemyGrab(enemy, game)) return;
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  enemy.dashCd = (enemy.dashCd ?? 0.8) - dt;
  if (enemy.dashCd <= 0 && dist > 90 && dist < 420 && ady < 48) {
    enemy.dashCd = 1.35;
    enemy.state = "charge";
    enemy.stateT = 0;
    enemy.z = 0;
    enemy.vz = 240;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  const moving = dist > 10 || ady > 14;
  const running = dist > 120;
  enemy.state = moving ? (running ? "run" : "walk") : "idle";
  const speed = enemy.speed * (running ? 1.55 : 1.15);
  let mx = dist > 10 ? Math.sign(dx) : 0;
  let my = ady > 14 ? Math.sign(dy) : 0;
  const length = Math.hypot(mx, my) || 1;
  enemy.vx = mx / length * speed;
  enemy.vy = my / length * speed * 0.72;
  enemy.x += enemy.vx * dt;
  enemy.y = clampY(enemy.y + enemy.vy * dt);
}

function updateCruz(enemy, game, dt) {
  const player = game.player;
  face(enemy, player);
  if (enemy.fleeT > 0) {
    enemy.fleeT -= dt;
    enemy.state = "run";
    enemy.vx = -enemy.facing * enemy.speed * 1.35;
    enemy.vy = 0;
    enemy.x += enemy.vx * dt;
    if (enemy.fleeT <= 0) enemy.state = "idle";
    return;
  }
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.spawned && enemy.stateT >= 0.72) {
      enemy.spawned = true;
      spawnSombrero(game, enemy);
    }
    if (enemy.stateT >= 0.82) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.38;
      enemy.swingHits = new Set();
      release(game, enemy);
    }
    return;
  }
  if (enemy.state === "windup") {
    enemy.stateT += dt;
    enemy.vx = 0;
    if (enemy.stateT >= 0.28) {
      enemy.state = "charge";
      enemy.stateT = 0;
      enemy.swingHits = new Set();
      face(enemy, player);
    }
    return;
  }
  if (enemy.state === "charge") {
    enemy.stateT += dt;
    enemy.vx = enemy.facing * 340;
    enemy.x += enemy.vx * dt;
    melee(game, enemy, {
      dmg: enemy.dmg,
      kb: 220,
      lift: 20,
      reach: enemy.reach,
      low: true,
      already: enemy.swingHits,
      kind: "heavy",
      hitstop: 0.05,
    });
    if (enemy.stateT >= 0.38) {
      enemy.state = "idle";
      enemy.attackCd = 0.55;
      enemy.swingHits = new Set();
    }
    return;
  }
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const dist = Math.abs(dx);
  enemy.fleeCd = (enemy.fleeCd ?? 2.8) - dt;
  if (enemy.fleeCd <= 0 && dist < 160 && dist > 70 && Math.abs(dy) < 36) {
    enemy.fleeCd = 5.2;
    enemy.fleeT = 0.22;
    enemy.state = "run";
    return;
  }
  if (enemy.attackCd <= 0 && Math.abs(dy) < 40 && dist < 380 && dist > 48) {
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  if (enemy.attackCd <= 0 && Math.abs(dy) < 34 && dist < 400 && dist > 80) {
    enemy.state = "windup";
    enemy.stateT = 0;
    return;
  }
  // Keep room for the sombrero during recovery instead of walking through
  // the player and becoming trapped inside the throw's minimum range.
  if (dist < 120 && Math.abs(dy) < 40) {
    enemy.state = "walk";
    enemy.vx = -enemy.facing * enemy.speed * 0.65;
    enemy.vy = 0;
    enemy.x += enemy.vx * dt;
    return;
  }
  approach(enemy, player, dt, enemy.speed * 1.45);
}

function updateThrower(enemy, game, dt) {
  const player = game.player;
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  face(enemy, player);
  const dist = Math.abs(dx);
  let speed = enemy.speed;
  if (dist < 180) enemy.vx = -enemy.facing * speed;
  else if (dist > 300) enemy.vx = enemy.facing * speed;
  else enemy.vx = 0;
  enemy.vy = Math.abs(dy) > 16 ? Math.sign(dy) * speed * 0.75 : 0;
  enemy.state = enemy.vx || enemy.vy ? "walk" : "idle";
  enemy.x += enemy.vx * dt;
  enemy.y = clampY(enemy.y + enemy.vy * dt);
  enemy.throwCd -= dt;
  if (enemy.throwCd <= 0 && Math.abs(dy) < 56 && dist > 110 && dist < 560) {
    enemy.throwCd = 1.55;
    spawnShot(game, enemy, {
      kind: "bottle",
      dmg: enemy.dmg,
      speed: 340,
      vz: 80,
      vy: Math.max(-150, Math.min(150, dy * 2)),
      life: 1.5,
    });
  }
}

function updateCrane(enemy, game, dt) {
  const player = game.player;
  if (enemy.state === "attack") {
    const high = enemy.swingHigh;
    const hitAt = high ? 0.62 : (enemy.phase2 ? 0.28 : 0.46);
    const endAt = high ? 1.05 : (enemy.phase2 ? 0.62 : 0.86);
    enemy.stateT += dt;
    if (!enemy.spawned && enemy.stateT >= hitAt) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg,
        kb: high ? 320 : 280,
        lift: high ? 80 : 40,
        reach: enemy.reach + (high ? 24 : 0),
        rx: enemy.reach * (high ? 0.48 : 0.62),
        ry: high ? 34 : 40,
        z: high ? 78 : undefined,
        rz: high ? 86 : undefined,
        low: !high,
        already: enemy.swingHits,
        kind: "heavy",
        hitstop: 0.07,
        shake: 8,
      });
    }
    if (enemy.stateT >= endAt) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = enemy.phase2 ? 0.45 : 0.7;
      enemy.swingHits = new Set();
    }
    return;
  }
  const dx = Math.abs(player.x - enemy.x);
  const dy = Math.abs(player.y - enemy.y);
  face(enemy, player);
  if (dx < enemy.reach + (enemy.swingHigh ? 24 : 0) && dy < 36 && enemy.attackCd <= 0) {
    enemy.swingN = (enemy.swingN || 0) + 1;
    enemy.swingHigh = enemy.swingN % 2 === 0;
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.spawned = false;
    enemy.swingHits = new Set();
    return;
  }
  approach(enemy, player, dt);
}

function updateMara(enemy, game, dt) {
  const player = game.player;
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  if (enemy.state === "grab") {
    updateEnemyGrab(enemy, game, dt);
    return;
  }
  if (enemy.state === "throw") {
    enemy.stateT += dt;
    if (enemy.stateT >= 0.35) {
      enemy.state = "idle";
      enemy.attackCd = 1.2;
    }
    return;
  }
  face(enemy, player);
  if (enemy.state === "charge") {
    enemy.stateT += dt;
    enemy.vx = enemy.facing * 280;
    enemy.x += enemy.vx * dt;
    melee(game, enemy, {
      dmg: 14,
      kb: 220,
      lift: 20,
      reach: 70,
      already: enemy.swingHits,
      kind: "heavy",
    });
    if (enemy.stateT >= 0.32) {
      enemy.state = "idle";
      enemy.dashCd = 2.4;
      enemy.swingHits = new Set();
    }
    return;
  }
  const dist = Math.abs(dx);
  if (dist < 86 && enemy.attackCd <= 0 && tryEnemyGrab(enemy, game)) {
    enemy.attackCd = 1.5;
    return;
  }
  if (dist < 200) enemy.vx = -enemy.facing * enemy.speed;
  else if (dist > 340) enemy.vx = enemy.facing * enemy.speed;
  else enemy.vx = 0;
  enemy.vy = Math.abs(dy) > 18 ? Math.sign(dy) * enemy.speed * 0.7 : 0;
  enemy.state = enemy.vx || enemy.vy ? "walk" : "idle";
  enemy.x += enemy.vx * dt;
  enemy.y = clampY(enemy.y + enemy.vy * dt);
  enemy.throwCd -= dt;
  enemy.dashCd -= dt;
  if (enemy.phase2 && enemy.dashCd <= 0 && dist > 80 && dist < 460) {
    enemy.state = "charge";
    enemy.stateT = 0;
    enemy.swingHits = new Set();
    return;
  }
  if (enemy.throwCd <= 0 && Math.abs(dy) < 70 && dist > 140 && dist < 620) {
    enemy.throwCd = enemy.phase2 ? 0.82 : 1.4;
    spawnShot(game, enemy, {
      kind: "bottle",
      dmg: enemy.dmg,
      speed: enemy.phase2 ? 420 : 340,
      vz: 90,
      vy: Math.max(-160, Math.min(160, dy * 2.1)),
      life: 1.6,
    });
  }
}

function updateSignal(enemy, game, dt) {
  const player = game.player;
  face(enemy, player);
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    if (!enemy.hit1 && enemy.stateT >= 0.14) {
      enemy.hit1 = true;
      melee(game, enemy, {
        dmg: enemy.dmg,
        kb: 120,
        lift: 0,
        reach: enemy.reach,
        already: enemy.swingHits,
        kind: "light",
      });
    }
    if (!enemy.hit2 && enemy.stateT >= 0.38) {
      enemy.hit2 = true;
      melee(game, enemy, {
        dmg: enemy.dmg + 2,
        kb: 240,
        lift: 70,
        reach: enemy.reach + 8,
        already: new Set(),
        kind: "heavy",
      });
    }
    if (enemy.stateT >= 0.68) {
      enemy.state = "idle";
      enemy.attackCd = 0.48;
      enemy.hit1 = false;
      enemy.hit2 = false;
      enemy.swingHits = new Set();
    }
    return;
  }
  const dx = Math.abs(player.x - enemy.x);
  const dy = Math.abs(player.y - enemy.y);
  if (dx < enemy.reach && dy < 32 && enemy.attackCd <= 0) {
    enemy.state = "attack";
    enemy.stateT = 0;
    enemy.hit1 = false;
    enemy.hit2 = false;
    enemy.swingHits = new Set();
    return;
  }
  approach(enemy, player, dt, enemy.phase2 ? enemy.speed * 1.15 : enemy.speed);
}

export function updateEnemy(enemy, game, dt) {
  enemy.anim += dt;
  if (enemy.kind === "greene") enemy.laserCd = Math.max(0, (enemy.laserCd ?? 0.45) - dt);
  if (enemy.attackCd > 0) enemy.attackCd -= dt;
  if (updateBody(enemy, dt)) {
    if (enemy.state !== "attack" && enemy.state !== "charge") release(game, enemy);
    return;
  }
  if (!game.player?.alive) {
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.state = "idle";
    release(game, enemy);
    return;
  }
  checkPhase(enemy, game);
  if (enemy.kind === "greene") updateGreene(enemy, game, dt);
  else if (enemy.kind === "grunt") updateGrunt(enemy, game, dt);
  else if (enemy.kind === "cruz") updateCruz(enemy, game, dt);
  else if (enemy.kind === "rusher") updateRusher(enemy, game, dt);
  else if (enemy.kind === "thrower") updateThrower(enemy, game, dt);
  else if (enemy.kind === "trump") updateTrump(enemy, game, dt);
  else if (enemy.kind === "crane") updateCrane(enemy, game, dt);
  else if (enemy.kind === "vance") updateVance(enemy, game, dt);
  else if (enemy.kind === "mara") updateMara(enemy, game, dt);
  else if (enemy.kind === "signal") updateSignal(enemy, game, dt);
}
