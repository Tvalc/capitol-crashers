import { melee, updateBody } from "./combat.js";
import { WORLD } from "./stages.js";
import { spawnShot } from "./weapons.js";

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
    name: "Crane",
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
    name: "Mara",
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
    name: "Signal",
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
};

let seq = 1;

export function makeEnemy(kind, x, y) {
  const stats = KINDS[kind];
  return {
    id: `e${seq++}`,
    team: "enemy",
    kind,
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
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  face(enemy, player);
  if (enemy.state === "attack") {
    enemy.stateT += dt;
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.spawned && enemy.stateT >= 0.26) {
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
    if (enemy.stateT >= 0.58) {
      enemy.state = "idle";
      enemy.spawned = false;
      enemy.attackCd = 0.55;
      enemy.swingHits = new Set();
      release(game, enemy);
    }
    return;
  }
  if (Math.abs(dx) < enemy.reach && Math.abs(dy) < 30 && enemy.attackCd <= 0 && claim(game, enemy)) {
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
  if (enemy.attackCd <= 0 && Math.abs(dy) < 34 && Math.abs(dx) < 420 && Math.abs(dx) > 70) {
    enemy.state = "windup";
    enemy.stateT = 0;
    return;
  }
  approach(enemy, player, dt);
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
    const hitAt = enemy.phase2 ? 0.28 : 0.46;
    const endAt = enemy.phase2 ? 0.62 : 0.86;
    enemy.stateT += dt;
    if (!enemy.spawned && enemy.stateT >= hitAt) {
      enemy.spawned = true;
      melee(game, enemy, {
        dmg: enemy.dmg,
        kb: 280,
        lift: 40,
        reach: enemy.reach,
        rx: enemy.reach * 0.62,
        ry: 40,
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
  if (dx < enemy.reach && dy < 36 && enemy.attackCd <= 0) {
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
  if (enemy.kind === "grunt") updateGrunt(enemy, game, dt);
  else if (enemy.kind === "rusher") updateRusher(enemy, game, dt);
  else if (enemy.kind === "thrower") updateThrower(enemy, game, dt);
  else if (enemy.kind === "crane") updateCrane(enemy, game, dt);
  else if (enemy.kind === "mara") updateMara(enemy, game, dt);
  else if (enemy.kind === "signal") updateSignal(enemy, game, dt);
}
