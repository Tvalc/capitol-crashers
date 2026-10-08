import { registerHelpAction } from "./help-actions.js?v=idle21";
import { playerMoveWindow } from "./player.js?v=grab26";

const CLIPS = {
  zohran: ["idle", "walk", "run", "jump", "attack", "hit", "death", "cast", "grab", "throw", "lunge", "reversal"],
  abdul: ["idle", "walk", "run", "jump", "attack", "hit", "death", "cast", "grab", "throw", "lunge"],
  trump: ["idle", "walk", "run", "attack", "hit", "death", "cast"],
  vance: ["idle", "walk", "run", "attack", "hit", "death", "cast", "grab"],
  greene: ["idle", "run", "attack", "hit", "death", "jump", "cast"],
  cruz: ["idle", "walk", "run", "attack", "hit", "death"],
  pete: ["idle", "walk", "attack", "hit", "death"],
  pete_ww: ["idle", "walk", "attack", "hit", "death"],
  vance_worried: ["idle", "walk", "attack", "hit", "death", "cast"],
};

// Grab / grabbed sheets are still being made in Makko. These slots load when a sheet exists
// and are skipped quietly when it does not, so new sheets can be dropped in without code changes.
const SOFT_CLIPS = {
  zohran: ["grabbed"],
  abdul: ["grabbed"],
  trump: ["grab", "grabbed"],
  vance: ["grabbed"],
  greene: ["grab", "grabbed"],
  cruz: ["grab", "grabbed"],
  pete: ["grab", "grabbed", "change"],
  pete_ww: ["grab", "grabbed"],
  vance_worried: ["grab", "grabbed"],
};

const FILE = {
  zohran: "chibi/zohran_mamdani",
  abdul: "chibi/abdul_el_sayed",
  trump: "chibi/donald_trump",
  vance: "chibi/jd_vance",
  greene: "chibi/marjorie_greene",
  cruz: "chibi/ted_cruz",
  pete: "chibi/pete_hegseth",
  pete_ww: "chibi/pete_hegseth_ww",
  vance_worried: "chibi/jd_vance_worried",
};

// All citizen artwork is authored in Makko and required at startup.
const OPTIONAL_CLIPS = {
  citizen_hungry: ["idle", "cheer", "walk", "depart"],
  citizen_sick: ["idle", "cheer", "walk", "depart"],
  citizen_evicted: ["idle", "cheer", "walk", "depart"],
  citizen_worker: ["idle", "cheer", "walk", "depart"],
  citizen_witness: ["idle", "cheer", "walk", "hit", "depart"],
};
const OPTIONAL_FILE = {
  citizen_hungry: "chibi/citizens/hungry",
  citizen_sick: "chibi/citizens/sick",
  citizen_evicted: "chibi/citizens/evicted",
  citizen_worker: "chibi/citizens/worker",
  citizen_witness: "chibi/citizens/witness",
};

const FALLBACK = {
  depart: ["depart", "walk", "idle"],
  cheer: ["cheer", "idle"],
  idle: ["idle", "walk", "run"],
  walk: ["walk", "idle"],
  run: ["run", "walk", "idle"],
  jump: ["jump", "run", "idle"],
  attack: ["attack", "idle"],
  hit: ["hit", "idle"],
  death: ["death", "hit", "idle"],
  cast: ["cast", "attack", "idle"],
  lunge: ["lunge", "attack", "idle"],
  reversal: ["reversal", "attack", "idle"],
  throw: ["throw", "attack", "idle"],
  backstep: ["backstep", "hit", "idle"],
  grab: ["grab", "attack", "idle"],
  grabbed: ["grabbed", "hit", "idle"],
  change: ["change", "hit", "idle"],
};

const ONCE = new Set(["attack", "hit", "death", "cast", "jump", "lunge", "reversal", "throw", "backstep", "grab"]);

const sheets = new Map();

function clipKey(sprite, clip) {
  return `${sprite}:${clip}`;
}

export function loadSprites() {
  const jobs = [];
  for (const [sprite, clips] of Object.entries(CLIPS)) {
    for (const clip of clips) {
      const name = `${FILE[sprite]}_${clip}`;
      jobs.push(loadOne(sprite, clip, name));
    }
  }
  for (const sprite of ["zohran", "abdul"]) {
    for (const kind of ["hungry", "sick", "evicted", "worker", "witness", "rescue"]) jobs.push(loadOne(sprite, `help_${kind}`, `${FILE[sprite]}_help_${kind}`));
  }
  const soft = [];
  for (const [sprite, clips] of Object.entries(SOFT_CLIPS)) {
    for (const clip of clips) soft.push(loadSoft(sprite, clip, `${FILE[sprite]}_${clip}`));
  }
  const optional = [];
  for (const [sprite, clips] of Object.entries(OPTIONAL_CLIPS)) {
    for (const clip of clips) if(clip !== "depart") optional.push(loadOne(sprite, clip, `${OPTIONAL_FILE[sprite]}_${clip}`));
  }
  return Promise.allSettled([...jobs, ...optional, ...soft]).then((results) => {
    for(const sprite of Object.keys(OPTIONAL_CLIPS)) {
      if(sheets.has(`${sprite}:walk`)) sheets.set(`${sprite}:depart`,sheets.get(`${sprite}:walk`));
    }
    if (sheets.has("greene:run") && !sheets.has("greene:walk")) {
      sheets.set("greene:walk", sheets.get("greene:run"));
    }
      const failures = results.filter(result => result.status === "rejected");
    if (failures.length) throw new Error(`${failures.length} animation sheets failed to load: ${failures.map(result => result.reason?.message || result.reason).join("; ")}`);
  });
}

// Arrays carry explicit playback order. Named atlas frames carry sequence numbers;
// geometry alone cannot recover playback order from a packed multi-row atlas.
export function readFrames(data, width, height) {
  let frames;
  if (Array.isArray(data.frames)) frames = [...data.frames];
  else {
    const entries = Object.entries(data.frames || {});
    const numbered = entries.every(([name]) => /\d+(?:\.[^.]+)?$/.test(name));
    entries.sort(numbered
      ? ([a], [b]) => a.localeCompare(b, "en", { numeric: true })
      : ([, a], [, b]) => a.frame.y - b.frame.y || a.frame.x - b.frame.x);
    frames = entries.map(([, frame]) => frame);
  }
  if (!frames.length) throw new Error("Animation has no frames.");
  for (const item of frames) {
    const cell = item.frame;
    if (!cell || ![cell.x, cell.y, cell.w, cell.h].every(Number.isFinite) ||
        cell.x < 0 || cell.y < 0 || cell.w <= 0 || cell.h <= 0 ||
        cell.x + cell.w > width || cell.y + cell.h > height || item.rotated) {
      throw new Error("Animation contains an invalid or rotated frame.");
    }
  }
  return frames;
}

function loadOne(sprite, clip, name) {
  const image = new Image();
  const version = /chibi\/(zohran_mamdani|abdul_el_sayed)_grab$/.test(name) ? "grab25" : name === "chibi/jd_vance_worried_death" ? "chibi-death24" : "hd5";
  const dataPromise = fetch(`assets/sprites/${name}.json?v=${version}`).then((res) => {
    if (!res.ok) throw new Error(`Could not load ${name}: ${res.status}`);
    return res.json();
  });
  const imagePromise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = `assets/sprites/${name}.webp?v=${version}`;
  });
  return Promise.all([dataPromise, imagePromise]).then(([data, img]) => {
    const frames = readFrames(data, img.naturalWidth, img.naturalHeight);
    if (data.meta?.helpAction) registerHelpAction(sprite, clip.slice(5), data.meta.helpAction);
    sheets.set(clipKey(sprite, clip), {
      image: img,
      frames,
      fps: data.meta?.playbackFps,
      frameDurations: data.meta?.useFrameDurations ? frames.map(frame => frame.duration) : null,
      bodyScale: data.meta?.bodyScale || 1,
      anchor: data.meta?.anchor || { x: (frames[0].sourceSize?.w || frames[0].frame.w) / 2, y: frames[0].sourceSize?.h || frames[0].frame.h },
    });
  });
}

// Missing sheet = 404 on the JSON, nothing else requested, never an error.
function loadSoft(sprite, clip, name) {
  const version = /chibi\/(zohran_mamdani|abdul_el_sayed)_grab$/.test(name) ? "grab25" : name === "chibi/jd_vance_worried_death" ? "chibi-death24" : "hd5";
  return fetch(`assets/sprites/${name}.json?v=${version}`, { method: "HEAD" })
    .then((res) => (res.ok ? loadOne(sprite, clip, name) : null))
    .catch(() => null);
}

export function hasSheet(sprite, clip = "idle") {
  return sheets.has(clipKey(sprite, clip));
}

export function actorSprite(ent) {
  if (ent.team === "player") return ent.fighter?.sprite || ent.kind;
  return ent.sprite || ent.kind;
}

export function clipFor(state) {
  if (state === "help") return "grab";
  if (state === "need") return "idle";
  if (state === "helped" || state === "testified") return "cheer";
  if (state === "leaving") return "depart";
  if (state === "follow") return "walk";
  if (state === "walk") return "walk";
  if (state === "run" || state === "dash" || state === "charge") return "run";
  if (state === "jump" || state === "jatk" || state === "leap") return "jump";
  if (state === "doze") return "walk";
  if (state === "backstep") return "backstep";
  if (state === "lunge") return "lunge";
  if (state === "reversal") return "reversal";
  if (state === "throw") return "throw";
  if (state === "grab") return "grab";
  if (state === "grabbed") return "grabbed";
  if (state === "transform") return "change";
  if (state === "dashatk") return "lunge";
  if (state === "hurt" || state === "air" || state === "getup") return "hit";
  if (state === "down" || state === "dead") return "death";
  if (state === "special") return "cast";
  if (
    state === "light" || state === "heavy" || state === "attack" ||
    state === "dashatk" || state === "lunge" || state === "reversal" ||
    state === "grab" || state === "throw" || state === "windup"
  ) return "attack";
  return "idle";
}

function resolveSheet(sprite, clip) {
  for (const name of FALLBACK[clip] || [clip]) {
    const sheet = sheets.get(clipKey(sprite, name));
    if (sheet) return { sheet, clip: name };
  }
  return null;
}

function attackWindow(ent) {
  if (ent.team === "player") {
    const move = playerMoveWindow(ent);
    if (move) return move;
    // Grab and airborne states still need their dedicated asset/event pass.
    if (ent.state === "grab") return { startup: 0.16, active: 0.14, total: 0.56 };
    if (ent.state === "help") return { startup: 0.2, active: 0.1, total: 0.62 };
  }
  if (ent.kind === "trump") return { startup: 0.34, active: 0.12, total: 0.72 };
  if (ent.kind === "greene") {
    if (ent.state === "special") return { startup: 0.15, active: 0.2, total: 1.6 };
    return { startup: 0.22, active: 0.12, total: 0.55 };
  }
  if (ent.kind === "cruz" && ent.state === "windup") return { startup: 0.28, active: 0.04, total: 0.32 };
  if (ent.kind === "cruz" && ent.state === "attack") return { startup: 0.72, active: 0.12, total: 1.05 };
  if (ent.kind === "vance") return { startup: 0.28, active: 0.14, total: 0.7 };
  if (ent.kind === "pete") return { startup: 0.38, active: 0.08, total: 0.72 };
  return { startup: 0.18, active: 0.08, total: 0.48 };
}

function contactAt(ent, count) {
  let frac = 0.42;
  if (ent.kind === "trump" && ent.state === "attack") frac = 0.72;
  if (ent.kind === "cruz" && ent.state === "attack") frac = 0.78;
  if (ent.state === "dashatk" || ent.state === "lunge") frac = 0.55;
  else if (ent.state === "heavy") frac = 0.62;
  else if (ent.state === "reversal") frac = 0.8;
  else if (ent.state === "throw") frac = 0.78;
  else if (ent.state === "grab") frac = 0.16;
  else if (ent.state === "light") {
    if (ent.combo === 2) frac = 0.7;
    else if (ent.combo === 1) frac = 0.5;
    else frac = 0.32;
  }
  return Math.min(count - 2, Math.max(1, Math.round(count * frac)));
}

export function poseIndex(ent, count, clip) {
  if (count <= 1) return 0;
  if (clip === "grab" && ent.team === "player") {
    const contact = Math.min(count - 1, actorSprite(ent) === "abdul" ? 7 : 6);
    if (ent.state === "help") {
      // Reach out, hold the hand-off, then settle back.
      const t = Math.max(0, ent.stateT || 0);
      if (t < 0.2) return Math.min(contact, Math.floor(t / 0.2 * contact));
      if (t < 0.36) return contact;
      return Math.min(count - 1, contact + Math.floor((t - 0.36) / 0.26 * (count - contact)));
    }
    // Return to the extended grip after each punch.
    return 0;
  }
  if (clip === "grab" && ent.team !== "player") {
    return Math.min(count - 1, Math.floor(Math.max(0, ent.stateT || 0) / 0.28 * (count - 1)));
  }
  if (clip === "death" && actorSprite(ent) === "vance_worried") {
    return Math.min(count - 1, Math.floor(Math.max(0, 0.9 - (ent.deadT ?? 0.9)) / 0.75 * count));
  }
  if (clip === "death" && ent.team === "player" && count === 12) {
    if (ent.state === "down") return 8;
    return Math.min(8, Math.floor(Math.max(0, 0.9 - (ent.deadT ?? 0.9)) / 0.5 * 9));
  }
  if (clip === "jump") {
    const height = Math.max(0, Math.min(1, (ent.z || 0) / 170));
    const rising = (ent.vz || 0) >= 0;
    if (rising) return Math.min(count - 1, Math.floor(height * count * 0.45));
    return Math.min(count - 1, Math.floor(count * 0.45 + (1 - height) * count * 0.55));
  }
  const t = ent.state === "dead" ? Math.max(0, 0.9 - (ent.deadT ?? 0.9)) : (ent.stateT || 0);
  let window;
  if (clip === "hit") window = { startup: 0.08, active: 0.16, total: 0.5 };
  else if (clip === "death") window = { startup: 0.06, active: 0.14, total: 0.9 };
  else if (clip === "cast") window = attackWindow({ ...ent, state: ent.state === "special" ? "special" : ent.state });
  else window = attackWindow(ent);
  const contact = contactAt(ent, count);
  if (t <= window.startup) {
    const u = window.startup <= 0 ? 1 : t / window.startup;
    return Math.max(0, Math.min(contact, Math.floor(u * contact)));
  }
  if (t <= window.startup + window.active) return contact;
  const recover = Math.max(0.05, window.total - window.startup - window.active);
  const u = Math.min(1, (t - window.startup - window.active) / recover);
  return Math.min(count - 1, contact + Math.floor(u * (count - contact)));
}

const STEP = {
  zohran: { walk: 0.12, run: 0.055 },
  abdul: { walk: 0.14, run: 0.06 },
  trump: { walk: 0.18, run: 0.14 },
  vance: { walk: 0.125, run: 0.075 },
  cruz: { walk: 0.1, run: 0.08 },
  greene: { walk: 0.055, run: 0.055 },
};

// Authored holds are part of the gesture: a uniform FPS loop removes its rests.
export function timedLoopIndex(seconds, durations) {
  const ms = durations.map(duration => Number.isFinite(duration) && duration > 0 ? duration : 100);
  const total = ms.reduce((sum, duration) => sum + duration, 0);
  if (!total) return 0;
  let phase = Math.max(0, Number.isFinite(seconds) ? seconds : 0) * 1000 % total;
  for (let index = 0; index < ms.length; index++) {
    if (phase < ms[index]) return index;
    phase -= ms[index];
  }
  return 0;
}

function gaitIndex(ent, count, clip, fps) {
  const step = fps > 0 ? 1 / fps : STEP[actorSprite(ent)]?.[clip] || (clip === "run" ? 0.055 : 0.08);
  if (Number.isFinite(ent.gaitDistance)) {
    const speed = ent.fighter?.speed || ent.speed || 188;
    const stride = Math.max(12, speed * (clip === "run" ? 2.35 : 1) * step);
    return Math.floor(ent.gaitDistance / stride) % count;
  }
  const t = Math.max(0, ent.anim || 0);
  return Math.floor(t / step) % count;
}

function flinchIndex(ent, count) {
  const deep = Math.max(1, Math.min(3, count - 1));
  const t = ent.stateT || 0;
  if (ent.state === "backstep") {
    const u = Math.min(1, (ent.stateT || 0) / 0.22);
    return Math.min(2, Math.floor(u * 3));
  }
  if (ent.state === "getup") {
    const u = Math.min(1, t / 0.34);
    return Math.min(count - 1, deep + Math.floor(u * (count - deep)));
  }
  const u = Math.min(1, t / 0.1);
  return Math.min(deep, Math.floor(u * (deep + 0.99)));
}

// These exports were normalized to their whole action bounding box, rather
// than the character's body. Calibrate once per clip, never once per frame.
export const SPRITE_BODY_SCALE = {};

export function drawSprite(ctx, ent, sx, sc) {
  const sprite = actorSprite(ent);
  let wanted = clipFor(ent.state);
  const grabPunch = ent.team === "player" && ent.state === "grab" && ent.grabStrikeT > 0;
  if (grabPunch) wanted = "attack";
  if (ent.state === "help" && ent.helpAction) wanted = ent.stateT < ent.helpAction.approach ? "walk" : `help_${ent.helpKind}`;
  if (sprite === "cruz" && ent.state === "windup") wanted = "attack";
  const resolved = resolveSheet(sprite, wanted);
  if (!resolved) return false;
  const { sheet, clip } = resolved;
  sc *= sheet.bodyScale * (SPRITE_BODY_SCALE[sprite]?.[clip] || 1);
  const count = sheet.frames.length;
  const once = ONCE.has(clip);
  let index;
  if (grabPunch && clip === "attack") {
    const phase = Math.max(0, Math.min(1, 1 - ent.grabStrikeT / .24));
    const punchFrames = sprite === "zohran" ? [0, 1, 2, 3, 4, 9, 10, 11] : [0, 1, 2, 3, 8, 9, 10, 11];
    index = Math.min(count - 1, punchFrames[Math.min(punchFrames.length - 1, Math.floor(phase * punchFrames.length))]);
  }
  else if (clip.startsWith("help_")) index = Math.min(count - 1, Math.floor(Math.max(0, ent.stateT - ent.helpAction.approach) / ent.helpAction.total * count));
  else if (clip === "idle") {
    const step = sheet.fps > 0 ? 1 / sheet.fps : sprite === "zohran" ? 0.14 : sprite === "abdul" ? 1 / 24 : sprite === "vance" ? 1 / 3 : sprite === "cruz" || sprite === "greene" ? 0.16 : 0;
    const idleTime = Math.max(0, (ent.anim || 0) - (ent.idleStartedAt || 0));
    index = sheet.frameDurations ? timedLoopIndex(idleTime, sheet.frameDurations) : step ? Math.floor(idleTime / step) % count : 0;
  }
  else if (ent.team === "citizen" && (clip === "cheer" || clip === "hit")) {
    // Citizens play these from the moment they trigger: cheer runs once and holds the last
    // frame; a knocked-down witness holds the kneeling midpoint until someone helps them up.
    const fps = sheet.fps > 0 ? sheet.fps : 12;
    const at = Math.floor(Math.max(0, ent.stateT || 0) * fps);
    index = clip === "hit" ? Math.min(at, Math.floor(count * 0.5)) : Math.min(at, count - 1);
  }
  else if (clip === "depart") index = Math.floor(Math.max(0, ent.stateT || 0) * (sheet.fps || 12)) % count;
  else if (clip === "change") index = Math.min(count - 1, Math.floor(Math.max(0, ent.stateT || 0) / (ent.transformDur || 1.2) * count));
  else if (clip === "grabbed") index = Math.floor(Math.max(0, ent.stateT || 0) * (sheet.fps > 0 ? sheet.fps : 8)) % count;
  else if (clip === "hit") index = flinchIndex(ent, count);
  else if (sprite === "vance_worried" && clip === "cast") index = Math.min(count - 1, Math.floor(Math.max(0, ent.stateT || 0) / 1.2 * count));
  else if (clip === "cast") index = poseIndex(ent, count, clip);
  else if (clip === "walk" || clip === "run") index = gaitIndex(ent, count, clip, sheet.fps);
  else if (once) index = poseIndex(ent, count, clip);
  else index = Math.floor((ent.anim || 0) / 0.1) % count;
  if (sprite === "cruz" && ent.state === "windup") index = 0;
  if (index < 0) index = 0;
  const frame = sheet.frames[index];
  const cell = frame.frame;
  const offset = frame.trimmed ? frame.spriteSourceSize : null;
  const anchorY = !(ent.z > 0) ? (frame.groundAnchorY ?? sheet.anchor.y) : sheet.anchor.y;
  ctx.save();
  ctx.translate(sx, ent.y - (ent.z || 0));
  const facing = ent.state === "help" && ent.helpAction && ent.stateT < ent.helpAction.approach ? Math.sign(ent.helpAction.targetX - ent.helpAction.fromX) || ent.facing : ent.facing;
  ctx.scale(sc * (facing || 1), sc);
  if (ent.flash > 0) ctx.filter = "brightness(3)";
  ctx.drawImage(
    sheet.image,
    cell.x, cell.y, cell.w, cell.h,
    -(frame.anchorX ?? sheet.anchor.x) + (offset?.x || 0), -anchorY + (offset?.y || 0), cell.w, cell.h,
  );
  ctx.restore();
  return true;
}









