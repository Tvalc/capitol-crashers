import { play, unlock } from "./audio.js";
import { separate, tickToss, wallBounce } from "./combat.js?v=fight2";
import { makeEnemy, updateEnemy } from "./enemies.js?v=gap2";
import { blankInput, createInput } from "./input.js";
import { fighterById, makePlayer, updatePlayer } from "./player.js?v=gap2";
import { draw } from "./render.js?v=gap2";
import { cloneStage, STAGES, WORLD } from "./stages.js?v=art";
import { updatePickups, updateProjectiles } from "./weapons.js?v=fight2";
import { loadSprites } from "./sprites.js?v=gap2";
import { PAGES } from "../../story/panels.js";

const PANELS = Object.fromEntries(PAGES.flatMap((page) => page.panels).map((panel) => [panel.id, panel]));

export function createGame() {
  return {
    mode: "title",
    fighterId: "mamdani",
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
    storyId: null,
    storyThen: null,
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
  showStory(game, game.player.fighter.story?.intro, "play");
}

// Pause on a comic panel from the story, then switch to `then` on continue.
export function showStory(game, id, then) {
  if (!id || !PANELS[id]) {
    game.mode = then;
    return;
  }
  game.mode = "story";
  game.storyId = id;
  game.storyThen = then;
}

export function continueStory(game) {
  if (game.mode !== "story") return;
  game.mode = game.storyThen;
  game.storyId = null;
  game.storyThen = null;
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
  tickToss(game, dt);
  wallBounce(game);
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
  const story = game.player.fighter.story || {};
  if (game.stageIndex >= STAGES.length - 1) {
    showStory(game, story.end, "ending");
    return;
  }
  game.stageIndex += 1;
  startStage(game);
  showStory(game, story.beats?.[game.stageIndex - 1], "play");
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
      const enemy = makeEnemy(member.kind, base + member.dx, member.y);
      if (wave.boss) {
        enemy.isBoss = true;
        enemy.hp = Math.max(enemy.hp, 220);
        enemy.hpMax = enemy.hp;
      }
      game.enemies.push(enemy);
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
  loadSprites();
  const titlePanel = document.getElementById("title-panel");
  const selectPanel = document.getElementById("select-panel");
  const clearPanel = document.getElementById("clear-panel");
  const endPanel = document.getElementById("end-panel");
  const overPanel = document.getElementById("over-panel");
  const storyPanel = document.getElementById("story-panel");
  let shownStory = null;

  function renderStory(panel) {
    const frame = document.getElementById("story-frame");
    frame.className = `story-frame ${panel.where}`;
    frame.replaceChildren();
    if (panel.art) {
      const img = document.createElement("img");
      img.src = `../art/story/${panel.art}`;
      img.alt = panel.alt || panel.scene;
      frame.append(img);
    } else {
      const scene = document.createElement("b");
      scene.textContent = panel.scene;
      scene.setAttribute("role", "img");
      scene.setAttribute("aria-label", panel.alt || panel.scene);
      frame.append(scene);
    }
    const tag = document.createElement("span");
    tag.className = "story-tag";
    tag.textContent = panel.tag;
    frame.append(tag);
    const copy = document.getElementById("story-copy");
    copy.replaceChildren();
    for (const cap of panel.captions || []) {
      const line = document.createElement("p");
      line.textContent = cap.text;
      copy.append(line);
    }
    for (const bubble of panel.bubbles || []) {
      const quote = document.createElement("p");
      quote.className = "story-quote";
      quote.textContent = `${bubble.who ? `${bubble.who}: ` : ""}“${bubble.text}”`;
      copy.append(quote);
    }
    document.getElementById("story-more").href = `../story/#${panel.id}`;
  }

  function sync() {
    titlePanel.hidden = game.mode !== "title";
    selectPanel.hidden = game.mode !== "select";
    clearPanel.hidden = !(game.mode === "play" && game.clearT > 0);
    endPanel.hidden = game.mode !== "ending";
    overPanel.hidden = game.mode !== "gameover";
    storyPanel.hidden = game.mode !== "story";
    touchBar?.classList.toggle("idle", game.mode !== "play");
    if (game.mode === "story" && shownStory !== game.storyId) {
      shownStory = game.storyId;
      renderStory(PANELS[game.storyId]);
    }
    if (game.mode !== "story") shownStory = null;
    document.querySelectorAll(".fighter").forEach((button) => {
      button.classList.toggle("on", button.dataset.id === game.fighterId);
    });
    if (game.mode === "play" && game.clearT > 0) {
      document.getElementById("clear-title").textContent = `${game.stage.name} clear`;
      document.getElementById("clear-copy").textContent = game.stage.clear;
    }
    if (game.mode === "ending") {
      document.getElementById("end-copy").textContent =
        `${game.player?.name || "You"} made it to the Capitol. Score ${game.score}.`;
    }
    if (game.mode === "gameover") {
      document.getElementById("over-copy").textContent = `Score ${game.score}. Get up. The Capitol is still there.`;
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
  document.getElementById("story-next").addEventListener("click", () => {
    unlock();
    play("ui");
    continueStory(game);
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

  const touchBar = window.mountTouchControls?.(document.querySelector(".stage"), {
    pad: {
      left: { key: "ArrowLeft", code: "ArrowLeft" },
      right: { key: "ArrowRight", code: "ArrowRight" },
      up: { key: "ArrowUp", code: "ArrowUp" },
      down: { key: "ArrowDown", code: "ArrowDown" },
    },
    buttons: [
      { label: "Light", key: "j", code: "KeyJ", tone: "pink" },
      { label: "Heavy", key: "k", code: "KeyK", tone: "gold" },
      { label: "Special", key: "l", code: "KeyL", tone: "blue" },
      { label: "Jump", key: " ", code: "Space", tone: "cream" },
    ],
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
      const order = ["mamdani", "sayed"];
      let index = order.indexOf(game.fighterId);
      if (snap.justLeft) index = (index + order.length - 1) % order.length;
      if (snap.justRight) index = (index + 1) % order.length;
      game.fighterId = order[index];
      if (snap.confirm) beginRun(game, game.fighterId);
    } else if (game.mode === "story" && snap.confirm) {
      play("ui");
      continueStory(game);
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
