import { propFootprints, collideProps, steerAroundProps } from "./prop-collision.js?v=grapple-release23";
import { play, unlock } from "./audio.js?v=chibi-site2";
import { separate, tickToss, wallBounce } from "./combat.js?v=grab27";
import { makeEnemy, updateEnemy } from "./enemies.js?v=grab27";
import { blankInput, createInput } from "./input.js?v=chibi-site2";
import { fighterById, makePlayer, updatePlayer, bufferPlayerInput } from "./player.js?v=grab27";
import { draw, loadEnvironment } from "./render.js?v=grip08b";
import { cloneStage, STAGES, WORLD } from "./stages.js?v=bench28";
import { updatePickups, updateProjectiles } from "./weapons.js?v=grab27";
import { loadSprites } from "./sprites.js?v=grip08b";
import { PAGES } from "../../story/panels.js";
import { followingWitness, makeCitizen, spawnCelebration, updateCitizens, witnessTestifies } from "./citizens.js?v=idle21";

// Comic panels that exist as short animated loops (OpenArt), shown between stages.
const MOTION = { p21: "../art/story/motion/p21.mp4", p27: "../art/story/motion/p27.mp4" };

const PANELS = Object.fromEntries(PAGES.flatMap((page) => page.panels).map((panel) => [panel.id, panel]));

export function createGame() {
  return {
    mode: "title",
    paused: false,
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
    citizens: [],
    helped: 0,
    stopped: 0,
    testified: 0,
    comboKind: "hit",
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
  game.practice = false;
  game.mode = "play";
  game.paused = false;
  game.fighterId = fighterId;
  game.stageIndex = 0;
  game.lives = 3;
  game.score = 0;
  game.combo = 0;
  game.comboT = 0;
  game.helped = 0;
  game.stopped = 0;
  game.testified = 0;
  game.hitstop = 0;
  game.shake = 0;
  game.player = makePlayer(fighterById(fighterId), 240, 560);
  startStage(game);
  showStory(game, game.player.fighter.story?.intro, "play");
}

export function beginPractice(game, fighterId, active = false, opponent = game.practiceEnemy || "cruz") {
  beginRun(game, fighterId);
  game.mode = "play";
  game.storyId = null;
  game.practice = true;
  game.practiceActive = active;
  game.practiceEnemy = ["cruz", "pete", "vance", "greene", "trump"].includes(opponent) ? opponent : "cruz";
  game.introT = 0;
  game.stage.props = [];
  game.stage.pickups = [];
  game.citizens = [];
  game.player.x = 420;
  game.enemies = [makeEnemy(game.practiceEnemy, 510, 560)];
  game.enemies[0].facing = -1;
  game.banner = "Practice · G grab · J strike · K throw";
  game.bannerT = 3;
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
  game.citizens = (game.stage.citizens || []).map((cit) => makeCitizen(cit.kind, cit.x, cit.y));
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
  if (game.paused) return;
  game.time += dt;
  if (game.mode !== "play") return;

  game.shake *= Math.exp(-10 * dt);
  if (game.bannerT > 0) game.bannerT = Math.max(0, game.bannerT - dt);
  if (game.comboT > 0) {
    game.comboT -= dt;
    if (game.comboT <= 0) game.combo = 0;
  }

  if (game.hitstop > 0) {
    bufferPlayerInput(game.player, input);
    game.hitstop = Math.max(0, game.hitstop - dt);
    return;
  }

  if (game.introT > 0) {
    game.introT -= dt;
    if (game.player) game.player.anim += dt;
    return;
  }

  if (game.clearT > 0) {
    game.clearT -= dt;
    updateCitizens(game, dt);
    for (const fx of game.fx) fx.t += dt;
    game.fx = game.fx.filter((fx) => fx.t < fx.life);
    if (game.clearT <= 0) advance(game);
    return;
  }

  const propBefore = [game.player, ...game.enemies, ...game.citizens].map(ent => ({ent,x:ent.x,y:ent.y}));
  const gaitBefore = [game.player, ...game.enemies].map(ent => ({ ent, x: ent.x, y: ent.y }));
  updatePlayer(game.player, game, input, dt);
  if (game.mode !== "play") return;

  for (const enemy of game.enemies) {
    if (game.practice && !game.practiceActive && ["idle", "walk", "run"].includes(enemy.state)) {
      enemy.state = "idle";
      enemy.vx = enemy.vy = 0;
      enemy.anim += dt;
      enemy.invuln = Math.max(0, enemy.invuln - dt);
      enemy.flash = Math.max(0, enemy.flash - dt);
    } else updateEnemy(enemy, game, dt);
  }
  tickToss(game, dt);
  wallBounce(game);
  if (game.pending.length) {
    game.enemies.push(...game.pending);
    game.pending.length = 0;
  }
  separate(game.enemies);
  updateCitizens(game, dt);
  const footprints = propFootprints(game.stage);
  for (const before of propBefore) {
    steerAroundProps(before.ent, before, footprints, dt, WORLD.floorTop, WORLD.floorBottom);
    collideProps(before.ent, before, footprints);
  }
  updatePickups(game);
  updateProjectiles(game, dt);
  updateWaves(game);
  // A witness who makes it to the boss puts the receipts on the record.
  const bossNow = game.enemies.find((enemy) => enemy.isBoss && enemy.alive);
  const witness = followingWitness(game);
  if (bossNow && witness && Math.abs(witness.x - bossNow.x) < 420) witnessTestifies(game, bossNow);
  updateCamera(game);
  for (const before of gaitBefore) advanceGait(before.ent, before.x, before.y);
  for (const fx of game.fx) fx.t += dt;
  game.fx = game.fx.filter((fx) => fx.t < fx.life);
  game.enemies = game.enemies.filter((enemy) => !(enemy.state === "dead" && enemy.deadT <= 0));
}

import { advanceGait } from "./animation-clock.js?v=chibi-site2";
export { advanceGait };

function advance(game) {
  const story = game.player.fighter.story || {};
  const wonPanel = game.stage.panel;
  if (game.stageIndex >= STAGES.length - 1) {
    showStory(game, story.end, "ending");
    return;
  }
  game.stageIndex += 1;
  startStage(game);
  // The policy panel for the block you just won, else the fighter's own beat.
  showStory(game, wonPanel || story.beats?.[game.stageIndex - 1], "play");
}

function updateWaves(game) {
  if (game.practice) return;
  const waves = game.stage.waves;
  if (game.waveIndex >= waves.length) {
    if (game.enemies.every((enemy) => !enemy.alive) && game.clearT <= 0 && game.mode === "play") {
      // The policy wins: banner, the street changes, the block comes out to cheer.
      game.clearT = 4.2;
      game.stage.won = true;
      game.banner = game.stage.policy || `${game.stage.name} clear`;
      game.bannerT = 4.2;
      spawnCelebration(game, 4);
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
        enemy.title = wave.bossName;
        enemy.hp = Math.max(enemy.hp, 220);
        enemy.hpMax = enemy.hp;
      }
      game.enemies.push(enemy);
    }
    if (wave.boss) {
      game.banner = wave.bossName;
      game.bannerT = 1.6;
      play("boss");
    } else if (wave.hint) {
      game.banner = wave.hint;
      game.bannerT = 2.2;
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
  // The game draws in a fixed 1280×720 space. The backing store used to be exactly that,
  // so on a 2560-wide window at 150% scaling the browser stretched every pixel 3× and the
  // whole street went soft. Size the store to what is actually on screen and scale the
  // context so nothing else in the renderer has to know.
  let pixelScale = 1;
  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // object-fit: contain letterboxes inside the element, so use the smaller fit.
    const shown = Math.min(rect.width / WORLD.viewW, rect.height / WORLD.viewH);
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const scale = Math.min(3, Math.max(1, shown * dpr));
    const w = Math.round(WORLD.viewW * scale), h = Math.round(WORLD.viewH * scale);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    pixelScale = scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }
  fitCanvas();
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(fitCanvas).observe(canvas);
  window.addEventListener("resize", fitCanvas);
  document.addEventListener("fullscreenchange", () => requestAnimationFrame(fitCanvas));
  let dprSeen = window.devicePixelRatio;
  const input = createInput();
  const game = createGame();
  if (typeof window !== "undefined") window.__cc = game; // debug/automation hook
  const practiceRequested = new URLSearchParams(window.location.search).has("practice");
  let assetsReady = false;
  const startButton = document.getElementById("start");
  const assetStatus = document.createElement("p");
  assetStatus.setAttribute("role", "status");
  startButton.before(assetStatus);
  async function prepareSprites() {
    startButton.disabled = true;
    assetStatus.textContent = "Loading fighters and animations…";
    try {
      await Promise.all([loadSprites(), loadEnvironment()]);
      assetsReady = true;
      assetStatus.textContent = "Ready to play.";
      startButton.textContent = "Step in";
      if (practiceRequested && game.mode === "title") beginPractice(game, "mamdani");
    } catch (error) {
      assetStatus.textContent = "Some animations could not load. Check your connection and retry.";
      startButton.textContent = "Retry loading";
      console.error(error);
    }
    startButton.disabled = false;
  }
  prepareSprites();
  const titlePanel = document.getElementById("title-panel");
  const selectPanel = document.getElementById("select-panel");
  const clearPanel = document.getElementById("clear-panel");
  const endPanel = document.getElementById("end-panel");
  const overPanel = document.getElementById("over-panel");
  const storyPanel = document.getElementById("story-panel");
  let shownStory = null;
  const pausePanel = document.getElementById("pause-panel");
  const pauseToggle = document.getElementById("pause-toggle");
  function setPaused(value) {
    if (game.mode !== "play") return;
    game.paused = value;
    input.clear();
    sync();
    if (value) document.getElementById("resume").focus();
    else canvas.focus({ preventScroll: true });
  }
  pauseToggle.addEventListener("click", () => setPaused(!game.paused));
  document.getElementById("resume").addEventListener("click", () => setPaused(false));
  function restartCurrent() {
    input.clear();
    if (game.practice) beginPractice(game, game.fighterId, game.practiceActive);
    else beginRun(game, game.fighterId);
    canvas.focus({ preventScroll: true });
  }
  document.getElementById("restart-run").addEventListener("click", restartCurrent);
  document.getElementById("practice-reset").addEventListener("click", restartCurrent);
  document.getElementById("practice-opponent").addEventListener("click", () => {
    input.clear(); beginPractice(game, game.fighterId, !game.practiceActive); canvas.focus({ preventScroll: true });
  });
  document.getElementById("practice-enemy").addEventListener("change", (event) => {
    input.clear(); beginPractice(game, game.fighterId, game.practiceActive, event.target.value); canvas.focus({ preventScroll: true });
  });
  for (const id of ["mamdani", "sayed"]) document.getElementById(`practice-${id}`).addEventListener("click", () => {
    input.clear(); beginPractice(game, id, game.practiceActive); canvas.focus({ preventScroll: true });
  });
  document.getElementById("practice-start").addEventListener("click", () => {
    unlock(); input.clear(); beginPractice(game, game.fighterId); canvas.focus({ preventScroll: true });
  });
  document.getElementById("choose-again").addEventListener("click", () => { input.clear(); game.paused = false; game.mode = "select"; canvas.focus({ preventScroll: true }); });
  const stage = document.querySelector(".stage");
  const fullscreenButton = document.getElementById("fullscreen");
  const stagePause = document.getElementById("stage-pause");
  let ignoreBlur = false;
  function fullscreenOn() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.documentElement.classList.contains("is-fullscreen"));
  }
  function syncFullscreen() {
    fullscreenButton.textContent = fullscreenOn() ? "Exit fullscreen" : "Fullscreen";
  }
  function toggleFullscreen() {
    ignoreBlur = true;
    setTimeout(() => { ignoreBlur = false; }, 700);
    if (fullscreenOn()) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if ((document.fullscreenElement || document.webkitFullscreenElement) && exit) exit.call(document).catch(() => {});
      document.documentElement.classList.remove("is-fullscreen");
      syncFullscreen();
      return;
    }
    const req = stage.requestFullscreen || stage.webkitRequestFullscreen;
    if (!req) {
      document.documentElement.classList.add("is-fullscreen");
      syncFullscreen();
      return;
    }
    req.call(stage).then(syncFullscreen).catch(() => {
      document.documentElement.classList.add("is-fullscreen");
      syncFullscreen();
    });
  }
  fullscreenButton.addEventListener("click", toggleFullscreen);
  stagePause.addEventListener("click", () => setPaused(true));
  document.addEventListener("fullscreenchange", syncFullscreen);
  document.addEventListener("webkitfullscreenchange", syncFullscreen);
  window.addEventListener("blur", () => { if (!ignoreBlur) setPaused(true); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) setPaused(true); });
  window.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    const typing = e.target?.closest?.("input, textarea, select, [contenteditable]");
    if (!typing && e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "f") {
      e.preventDefault();
      toggleFullscreen();
      return;
    }
    if (e.key === "Escape" && game.mode === "play") {
      if (document.fullscreenElement || document.webkitFullscreenElement) return;
      if (document.documentElement.classList.contains("is-fullscreen")) {
        e.preventDefault();
        document.documentElement.classList.remove("is-fullscreen");
        syncFullscreen();
        return;
      }
      e.preventDefault();
      setPaused(!game.paused);
    }
  }, true);
  document.querySelectorAll(".fighter").forEach(button => {
    button.querySelector("span").textContent = fighterById(button.dataset.id).blurb;
  });

  function renderStory(panel) {
    const frame = document.getElementById("story-frame");
    frame.className = `story-frame ${panel.where}`;
    frame.replaceChildren();
    if (MOTION[panel.id]) {
      const video = document.createElement("video");
      video.src = MOTION[panel.id];
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("aria-label", panel.alt || panel.scene);
      if (panel.art) video.poster = `../art/story/chibi/${panel.art}`;
      frame.append(video);
      video.play?.().catch(() => {});
    } else if (panel.art) {
      const img = document.createElement("img");
      img.src = `../art/story/chibi/${panel.art}`;
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
    pausePanel.hidden = !game.paused;
    pauseToggle.hidden = game.mode !== "play";
    pauseToggle.textContent = game.paused ? "Resume · Esc" : "Pause · Esc";
    stagePause.hidden = game.mode !== "play" || game.paused;
    document.getElementById("practice-controls").hidden = !game.practice;
    document.getElementById("practice-opponent").textContent = game.practiceActive ? "Opponent: active" : "Opponent: stationary";
    document.getElementById("practice-enemy").value = game.practiceEnemy || "cruz";
    for (const id of ["mamdani", "sayed"]) document.getElementById(`practice-${id}`).setAttribute("aria-pressed", String(game.fighterId === id));
    titlePanel.hidden = game.mode !== "title";
    selectPanel.hidden = game.mode !== "select";
    clearPanel.hidden = !(game.mode === "play" && game.clearT > 0);
    endPanel.hidden = game.mode !== "ending";
    overPanel.hidden = game.mode !== "gameover";
    storyPanel.hidden = game.mode !== "story";
    touchBar?.classList.toggle("idle", game.mode !== "play" || game.paused);
    if (game.mode === "story" && shownStory !== game.storyId) {
      shownStory = game.storyId;
      renderStory(PANELS[game.storyId]);
    }
    if (game.mode !== "story") shownStory = null;
    document.querySelectorAll(".fighter").forEach((button) => {
      button.classList.toggle("on", button.dataset.id === game.fighterId);
    });
    if (game.mode === "play" && game.clearT > 0) {
      document.getElementById("clear-title").textContent = game.stage.policy || `${game.stage.name} clear`;
      document.getElementById("clear-copy").textContent = `${game.stage.clear} Helped ${game.helped} so far.`;
    }
    if (game.mode === "ending") {
      document.getElementById("end-copy").textContent =
        `${game.player?.name || "You"} made it to the Capitol. Helped ${game.helped}, stopped ${game.stopped}, ${game.testified} on the record. Score ${game.score}.`;
    }
    if (game.mode === "gameover") {
      document.getElementById("over-copy").textContent = `Helped ${game.helped}. Score ${game.score}. Get up. The block still needs you.`;
    }
  }

  document.getElementById("start").addEventListener("click", () => {
    if (!assetsReady) { prepareSprites(); return; }
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
      { label: "Grab", key: "g", code: "KeyG", tone: "gold" },
      { label: "Special", key: "l", code: "KeyL", tone: "blue" },
      { label: "Jump", key: " ", code: "Space", tone: "cream wide" },
    ],
  });

  let last = performance.now();
  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;
    const snap = input.snapshot();
    if (snap.light || snap.heavy || snap.special || snap.grab || snap.jump || snap.confirm || snap.x || snap.y) unlock();
    if (game.mode === "title" && snap.confirm && assetsReady) {
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
    if (window.devicePixelRatio !== dprSeen) { dprSeen = window.devicePixelRatio; fitCanvas(); }
    if (assetsReady) {
      updateGame(game, game.mode === "play" ? snap : blankInput(), dt);
      ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
      draw(ctx, game);
    }
    sync();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (typeof document !== "undefined") boot();

export { blankInput };







