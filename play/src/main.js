import { play, unlock } from "./audio.js";
import { separate } from "./combat.js";
import { makeEnemy, updateEnemy } from "./enemies.js";
import { blankInput, createInput } from "./input.js";
import { fighterById, makePlayer, updatePlayer } from "./player.js";
import { draw } from "./render.js";
import { cloneStage, STAGES, WORLD } from "./stages.js";
import { updatePickups, updateProjectiles } from "./weapons.js";

export function createGame() {
  return {
    mode: "title",
    fighterId: "rook",
    stageIndex: 0,
    stage: cloneStage(0),
    lives: 3,
    score: 0,
    combo: 0,
    comboT: 0,
    hitstop: 0,
    shake: 0,
    time: 0,
    cameraX: 0,
    lockCam: null,
    waveIndex: 0,
    enemies: [],
    projectiles: [],
    fx: [],
    pending: [],
    attackSlot: null,
    player: null,
    introT: 0,
    clearT: 0,
    banner: "",
    bannerT: 0,
  };
}

export function beginRun(game, fighterId) {
  game.mode = "play";
  game.fighterId = fighterId;
  game.stageIndex = 0;
  game.lives = 3;
  game.score = 0;
  game.combo = 0;
  game.comboT = 0;
  game.hitstop = 0;
  game.shake = 0;
  game.player = makePlayer(fighterById(fighterId), 240, 560);
  startStage(game);
}

export function startStage(game) {
  const fighter = game.player.fighter;
  game.stage = cloneStage(game.stageIndex);
  game.cameraX = 0;
  game.lockCam = null;
  game.waveIndex = 0;
  game.enemies = [];
  game.projectiles = [];
  game.fx = [];
  game.pending = [];
  game.attackSlot = null;
  game.introT = 1.35;
  game.clearT = 0;
  game.banner = game.stage.name;
  game.bannerT = 1.35;
  game.player = makePlayer(fighter, 240, 560);
}

export function updateGame(game, input, dt) {
  dt = Math.min(0.034, Math.max(0, dt) || 0);
  game.time += dt;
  if (game.mode !== "play") return;

  game.shake *= Math.exp(-10 * dt);
  if (game.bannerT > 0) game.bannerT = Math.max(0, game.bannerT - dt);
  if (game.comboT > 0) {
    game.comboT -= dt;
    if (game.comboT <= 0) game.combo = 0;
  }

  if (game.hitstop > 0) {
    game.hitstop -= dt;
    return;
  }

  if (game.introT > 0) {
    game.introT -= dt;
    if (game.player) game.player.anim += dt;
    return;
  }

  if (game.clearT > 0) {
    game.clearT -= dt;
    if (game.clearT <= 0) advance(game);
    return;
  }

  updatePlayer(game.player, game, input, dt);
  if (game.mode !== "play") return;

  for (const enemy of game.enemies) updateEnemy(enemy, game, dt);
  if (game.pending.length) {
    game.enemies.push(...game.pending);
    game.pending.length = 0;
  }
  separate(game.enemies);
  updatePickups(game);
  updateProjectiles(game, dt);
  updateWaves(game);
  updateCamera(game);
  for (const fx of game.fx) fx.t += dt;
  game.fx = game.fx.filter((fx) => fx.t < fx.life);
  game.enemies = game.enemies.filter((enemy) => !(enemy.state === "dead" && enemy.deadT <= 0));
}

function advance(game) {
  if (game.stageIndex >= STAGES.length - 1) {
    game.mode = "ending";
    return;
  }
  game.stageIndex += 1;
  startStage(game);
}

function updateWaves(game) {
  const waves = game.stage.waves;
  if (game.waveIndex >= waves.length) {
    if (game.enemies.every((enemy) => !enemy.alive) && game.clearT <= 0 && game.mode === "play") {
      game.clearT = 2.3;
      game.banner = `${game.stage.name} clear`;
      game.bannerT = 2.3;
      play("clear");
    }
    return;
  }

  const wave = waves[game.waveIndex];
  if (!wave.spawned && game.player.alive && game.player.x >= wave.at) {
    wave.spawned = true;
    const maxCam = Math.max(0, game.stage.length - WORLD.viewW);
    const desired = Math.max(0, Math.min(maxCam, game.player.x - 480));
    game.lockCam = desired;
    const base = desired + 760;
    for (const member of wave.group) {
      game.enemies.push(makeEnemy(member.kind, base + member.dx, member.y));
    }
    if (wave.boss) {
      game.banner = wave.bossName;
      game.bannerT = 1.6;
      play("boss");
    }
  }

  if (wave.spawned && game.enemies.every((enemy) => !enemy.alive)) {
    game.waveIndex += 1;
    game.lockCam = null;
    game.attackSlot = null;
  }
}

function updateCamera(game) {
  if (game.lockCam != null) game.cameraX = game.lockCam;
  else {
    const maxCam = Math.max(0, game.stage.length - WORLD.viewW);
    game.cameraX = Math.max(0, Math.min(maxCam, game.player.x - 480));
  }
  const minX = game.cameraX + 40;
  const maxX = game.cameraX + WORLD.viewW - 56;
  const clampX = (ent) => {
    if (ent.x < minX) ent.x = minX;
    if (ent.x > maxX) ent.x = maxX;
  };
  clampX(game.player);
  for (const enemy of game.enemies) clampX(enemy);
}

function boot() {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const input = createInput();
  const game = createGame();
  const titlePanel = document.getElementById("title-panel");
  const selectPanel = document.getElementById("select-panel");
  const clearPanel = document.getElementById("clear-panel");
  const endPanel = document.getElementById("end-panel");
  const overPanel = document.getElementById("over-panel");

  function sync() {
    titlePanel.hidden = game.mode !== "title";
    selectPanel.hidden = game.mode !== "select";
    clearPanel.hidden = !(game.mode === "play" && game.clearT > 0);
    endPanel.hidden = game.mode !== "ending";
    overPanel.hidden = game.mode !== "gameover";
    document.querySelectorAll(".fighter").forEach((button) => {
      button.classList.toggle("on", button.dataset.id === game.fighterId);
    });
    if (game.mode === "play" && game.clearT > 0) {
      document.getElementById("clear-title").textContent = `${game.stage.name} clear`;
      document.getElementById("clear-copy").textContent = game.stage.clear;
    }
    if (game.mode === "ending") {
      document.getElementById("end-copy").textContent =
        `${game.player?.name || "The courier"} got the bag across. Score ${game.score}.`;
    }
    if (game.mode === "gameover") {
      document.getElementById("over-copy").textContent = `Score ${game.score}. The alley keeps the bag.`;
    }
  }

  document.getElementById("start").addEventListener("click", () => {
    unlock();
    play("ui");
    game.mode = "select";
  });
  document.querySelectorAll(".fighter").forEach((button) => {
    button.addEventListener("click", () => {
      unlock();
      game.fighterId = button.dataset.id;
      play("ui");
    });
  });
  document.getElementById("run").addEventListener("click", () => {
    unlock();
    beginRun(game, game.fighterId);
  });
  document.getElementById("end-again").addEventListener("click", () => {
    game.mode = "title";
    game.stage = cloneStage(0);
    game.player = null;
    game.enemies = [];
  });
  document.getElementById("over-again").addEventListener("click", () => {
    game.mode = "title";
    game.stage = cloneStage(0);
    game.player = null;
    game.enemies = [];
  });

  let last = performance.now();
  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;
    const snap = input.snapshot();
    if (snap.light || snap.heavy || snap.special || snap.jump || snap.confirm || snap.x || snap.y) unlock();
    if (game.mode === "title" && snap.confirm) {
      play("ui");
      game.mode = "select";
    } else if (game.mode === "select") {
      const order = ["rook", "flick"];
      let index = order.indexOf(game.fighterId);
      if (snap.justLeft) index = (index + order.length - 1) % order.length;
      if (snap.justRight) index = (index + 1) % order.length;
      game.fighterId = order[index];
      if (snap.confirm) beginRun(game, game.fighterId);
    } else if ((game.mode === "ending" || game.mode === "gameover") && snap.confirm) {
      game.mode = "title";
      game.stage = cloneStage(0);
      game.player = null;
      game.enemies = [];
    }
    updateGame(game, game.mode === "play" ? snap : blankInput(), dt);
    draw(ctx, game);
    sync();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (typeof document !== "undefined") boot();

export { blankInput };
