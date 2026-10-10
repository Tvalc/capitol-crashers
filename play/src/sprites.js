import { registerHelpAction } from "./help-actions.js?v=encounter38";
import { playerMoveWindow } from "./player.js?v=encounter38";
import { WORLD } from "./stages.js?v=encounter38";

const CLIPS = {
  rogers_vacation: ["idle","walk","run","attack","special","bill","hit","death","change"],
  rogers_tropical: ["idle","walk","run","attack","special","bill","hit","death","change","grabbed","grab_flinch"],
  rogers: ["idle","walk","orders","run","bill","hit","death"],
  zohran: ["idle", "walk", "run", "jump", "attack", "hit", "death", "cast", "grab", "throw", "lunge", "reversal"],
  abdul: ["idle", "walk", "run", "jump", "attack", "hit", "death", "cast", "grab", "throw", "lunge"],
  trump: ["idle", "walk", "run", "attack", "hit", "death", "cast"],
  vance: ["idle", "walk", "run", "attack", "hit", "death", "cast", "grab"],
  greene: ["idle", "run", "attack", "cast"],
  cruz: ["idle", "walk", "run", "attack", "hit", "death"],
  pete: ["idle", "walk", "attack", "hit", "death"],
  pete_ww: ["idle", "walk", "attack", "hit", "death"],
  vance_worried: ["idle", "walk", "attack", "hit", "death", "cast"],
};

// Grab / grabbed sheets are still being made in Makko. These slots load when a sheet exists
// and are skipped quietly when it does not, so new sheets can be dropped in without code changes.
const SOFT_CLIPS = {
  zohran: ["grabbed", "grab_strike"],
  abdul: ["grabbed", "grab_strike"],
  trump: ["grab", "grabbed"],
  vance: ["grabbed"],

  cruz: ["grab", "grabbed"],
  pete: ["grab", "grabbed", "change"],
  pete_ww: ["grab", "grabbed"],
  vance_worried: ["grab", "grabbed"],
};

const FILE = {
  rogers_vacation: "chibi/mike_rogers_vacation",
  rogers_tropical: "chibi/mike_rogers_tropical",
  rogers: "chibi/mike_rogers",
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
  grab_strike: ["grab_strike", "attack"],
  grab_flinch: ["grab_flinch", "grabbed", "hit"],
  change: ["change", "hit", "idle"],
};

const ONCE = new Set(["attack", "hit", "death", "cast", "jump", "lunge", "reversal", "throw", "backstep", "grab"]);

const sheets = new Map();
// Only reviewed candidates are registered. Load the active matchup, not the
// whole cast's paired atlases at startup.
const GRAPPLE_PAIRS = {
  zohran: new Set(["rogers", "rogers_vacation", "rogers_tropical", "cruz", "mcconnell", "trump", "vance_worried", "pete_ww", "pete"]),
  abdul: new Set(["rogers", "rogers_vacation", "rogers_tropical", "cruz", "trump", "beck", "vance_worried", "pete_ww", "pete"]),
};
const pairLoads = new Map();
export function ensureGrapplePair(hero, enemy) {
  const sprite = actorSprite(hero), opponent = actorSprite(enemy);
  if (!GRAPPLE_PAIRS[sprite]?.has(opponent)) return Promise.resolve(false);
  const clip = `grapple_${opponent}_strike`, key = clipKey(sprite, clip);
  if (!pairLoads.has(key)) {
    pairLoads.set(key, loadOne(sprite, clip, `${FILE[sprite]}_${clip}`)
      .then(() => true).catch(() => false));
  }
  return pairLoads.get(key);
}

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
    if (item.grappleScale !== undefined && (!Number.isFinite(item.grappleScale) || item.grappleScale <= 0 || item.grappleScale > 2)) throw new Error("Animation contains an invalid grapple scale.");
    const cell = item.frame;
    if (!cell || ![cell.x, cell.y, cell.w, cell.h].every(Number.isFinite) ||
        cell.x < 0 || cell.y < 0 || cell.w <= 0 || cell.h <= 0 ||
        cell.x + cell.w > width || cell.y + cell.h > height || item.rotated) {
      throw new Error("Animation contains an invalid or rotated frame.");
    }
  }
  return frames;
}

function assetRoot(name) { if(name.includes("mike_rogers") || name.includes("_grapple_rogers")) return "qa-rogers25/assets/sprites"; return ["chibi/zohran_mamdani_grab", "chibi/ted_cruz_grabbed"].includes(name) ? "qa-grapple09/assets/sprites" : "assets/sprites"; }

function loadOne(sprite, clip, name) {
  const image = new Image();
  const extension = /^chibi\/mike_rogers_(idle|walk|orders|run|bill|hit|death)$/.test(name) ? "png" : "webp";
  const version = name.includes("rogers") ? "encounter38" : name.includes("_grapple_") ? "laser22" : /chibi\/(zohran_mamdani|abdul_el_sayed)_grab$/.test(name) ? "grip08b" : name === "chibi/jd_vance_worried_death" ? "chibi-death24" : "hd5";
  const dataPromise = fetch(`${assetRoot(name)}/${name}.json?v=${version}`).then((res) => {
    if (!res.ok) throw new Error(`Could not load ${name}: ${res.status}`);
    return res.json();
  });
  const imagePromise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    let retried = false;
    image.onerror = () => {
      if (!retried) {
        retried = true;
        image.src = `${assetRoot(name)}/${name}.${extension}?v=${version}&retry=1`;
        return;
      }
      reject(new Error(`Could not load sprite image: ${name}`));
    };
    image.src = `${assetRoot(name)}/${name}.${extension}?v=${version}`;
  });
  return Promise.all([dataPromise, imagePromise]).then(([data, img]) => {
    const frames = readFrames(data, img.naturalWidth, img.naturalHeight);
    if (clip.startsWith("grapple_")) {
      const meta = data.meta || {};
      if (frames.length > 12 || meta.nativePixels !== true || /^reject/i.test(meta.reviewStatus || "")) {
        throw new Error(`Unreviewable paired animation: ${name}`);
      }
      if (![meta.anchor?.x, meta.anchor?.y, meta.pairedEnemyRoot?.x, meta.pairedEnemyRoot?.y, meta.bodyScale].every(Number.isFinite) || meta.bodyScale <= 0) {
        throw new Error(`Missing paired alignment: ${name}`);
      }
      const hold = meta.holdFrame ?? 0;
      if (!Number.isInteger(hold) || hold < 0 || hold >= frames.length) {
        throw new Error(`Invalid paired hold frame: ${name}`);
      }
      const sequence = meta.playbackSequence || frames.map((_, i) => i);
      if (!sequence.length || sequence.some(i => !Number.isInteger(i) || i < 0 || i >= frames.length) || !sequence.includes(meta.contactFrame)) {
        throw new Error(`Invalid paired contact sequence: ${name}`);
      }
    }
    if (data.meta?.helpAction) registerHelpAction(sprite, clip.slice(5), data.meta.helpAction);
    sheets.set(clipKey(sprite, clip), {
      image: img,
      frames,
      fps: data.meta?.playbackFps,
      strikeDuration: data.meta?.strikeDuration,
      holdFrame: data.meta?.holdFrame,
      pairedEnemyRoot: data.meta?.pairedEnemyRoot,
      playbackSequence: data.meta?.playbackSequence,
      contactFrame: data.meta?.contactFrame,
      impactZ: data.meta?.impactZ,
      impactXOffset: data.meta?.impactXOffset,
      frameDurations: data.meta?.useFrameDurations ? frames.map(frame => frame.duration) : null,
      bodyScale: data.meta?.bodyScale || 1,
      anchor: data.meta?.anchor || { x: (frames[0].sourceSize?.w || frames[0].frame.w) / 2, y: frames[0].sourceSize?.h || frames[0].frame.h },
    });
  });
}

// Missing sheet = 404 on the JSON, nothing else requested, never an error.
function loadSoft(sprite, clip, name) {
  const version = name.includes("rogers") ? "encounter38" : name.includes("_grapple_") ? "correction19" : /chibi\/(zohran_mamdani|abdul_el_sayed)_grab$/.test(name) ? "grip08b" : name === "chibi/jd_vance_worried_death" ? "chibi-death24" : "hd5";
  return fetch(`${assetRoot(name)}/${name}.json?v=${version}`, { method: "HEAD" })
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
    // The new six-frame collar hold settles on its fourth frame.
    return actorSprite(ent) === "abdul" && count === 6 ? 3 : 0;
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

// One paired grapple interaction supplies its restrained rest pose, pummel,
// reaction and recovery. It never replaces a normal attack or throw.
export function hasGrapplePair(hero, enemy) {
  if (hero.state === "grab" && hero.grapplePairLocked === false) return false;
  return !!enemy && hasSheet(actorSprite(hero), `grapple_${actorSprite(enemy)}_strike`);
}

export function grapplePairDistance(hero, enemy) {
  const sheet = sheets.get(clipKey(actorSprite(hero), `grapple_${actorSprite(enemy)}_strike`));
  const depth = .86 + (hero.y - WORLD.floorTop) / (WORLD.floorBottom - WORLD.floorTop) * .2;
  return (sheet.pairedEnemyRoot.x - sheet.anchor.x) * sheet.bodyScale * (hero.scale || 1) * depth * 1.05;
}

export function grapplePairDuration(hero, enemy) {
  return sheets.get(clipKey(actorSprite(hero), `grapple_${actorSprite(enemy)}_strike`))?.strikeDuration || .32;
}
function pairIndex(sheet, phase) {
  const sequence=sheet.playbackSequence || sheet.frames.map((_,i)=>i);
  if (!sheet.strikeDuration) return sequence[Math.min(sequence.length-1,Math.floor(phase*sequence.length))];
  const durations=sequence.map(i=>sheet.frames[i].duration || 100),total=durations.reduce((a,b)=>a+b,0);
  let t=phase*total;
  for(let i=0;i<sequence.length;i++){if(t<durations[i])return sequence[i];t-=durations[i];}
  return sequence.at(-1);
}
export function drawGrapplePair(ctx, hero, enemy, sx, scale) {
  if (!hasGrapplePair(hero, enemy)) return false;
  const strike = hero.grabStrikeT > 0;
  const sheet = sheets.get(clipKey(actorSprite(hero), `grapple_${actorSprite(enemy)}_strike`));
  const phase = Math.max(0, Math.min(1, 1 - (hero.grabStrikeT || 0) / grapplePairDuration(hero, enemy)));
  const sequence = sheet.playbackSequence || sheet.frames.map((_,i)=>i);
  const index = strike ? pairIndex(sheet, phase) : (sheet.holdFrame ?? 0);
  const frame = sheet.frames[index], cell = frame.frame;
  ctx.save();
  ctx.translate(sx, hero.y);
  const frameScale = frame.grappleScale ?? 1;
  ctx.scale(scale * sheet.bodyScale * frameScale * hero.facing, scale * sheet.bodyScale * frameScale);
  const offset = frame.trimmed ? frame.spriteSourceSize : null;
  ctx.drawImage(sheet.image, cell.x, cell.y, cell.w, cell.h, -sheet.anchor.x + (offset?.x || 0), -(frame.groundAnchorY ?? sheet.anchor.y) + (offset?.y || 0), cell.w, cell.h);
  ctx.restore();
  return true;
}

export function grapplePairImpact(hero, enemy) {
  const sheet = sheets.get(clipKey(actorSprite(hero), `grapple_${actorSprite(enemy)}_strike`));
  return { impactX: enemy.x - hero.facing * (sheet?.impactXOffset ?? 18), impactZ: sheet?.impactZ ?? 148 };
}

export function grapplePairContactRemaining(hero, enemy) {
  const sheet = sheets.get(clipKey(actorSprite(hero), `grapple_${actorSprite(enemy)}_strike`));
  if (!sheet) return .16;
  const sequence = sheet.playbackSequence || sheet.frames.map((_,i)=>i);
  const contact = Math.max(0, sequence.indexOf(sheet.contactFrame ?? 3));
  if (sheet.strikeDuration) {
    const times=sequence.map(i=>sheet.frames[i].duration||100), total=times.reduce((a,b)=>a+b,0);
    return sheet.strikeDuration*(1-times.slice(0,contact).reduce((a,b)=>a+b,0)/total);
  }
  return .32 * (1 - contact / sequence.length);
}

export function drawSprite(ctx, ent, sx, sc) {
  const sprite = actorSprite(ent);
  let wanted = clipFor(ent.state);
  if (sprite.startsWith("rogers")) { if (["orders","bill"].includes(ent.state)) wanted=ent.state; if(ent.state==="vacationSpecial") wanted="special"; }
  const grabbedFlinch = ent.state === "grabbed" && ent.grabFlinchT > 0;
  if (grabbedFlinch && hasSheet(sprite, "grab_flinch")) wanted = "grab_flinch";
  const grabPunch = ent.team === "player" && ent.state === "grab" && ent.grabStrikeT > 0;
  if (grabPunch) wanted = "grab_strike";
  if (ent.state === "help" && ent.helpAction) wanted = ent.stateT < ent.helpAction.approach ? "walk" : `help_${ent.helpKind}`;
  if (sprite === "cruz" && ent.state === "windup") wanted = "attack";
  const resolved = resolveSheet(sprite, wanted);
  if (!resolved) return false;
  const { sheet, clip } = resolved;
  sc *= sheet.bodyScale * (SPRITE_BODY_SCALE[sprite]?.[clip] || 1);
  const count = sheet.frames.length;
  const once = ONCE.has(clip) || clip === "special";
  let index;
  if (grabPunch && (clip === "attack" || clip === "grab_strike")) {
    const phase = Math.max(0, Math.min(1, 1 - ent.grabStrikeT / .32));
    const punchFrames = clip === "grab_strike" ? Array.from({length:count}, (_,i)=>i) : sprite === "zohran" ? [0, 1, 2, 3, 4, 9, 10, 11] : [0, 1, 2, 3, 8, 9, 10, 11];
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
  else if (clip === "hit") index = flinchIndex(grabbedFlinch ? { ...ent, state: "hurt", stateT: 0.22 - ent.grabFlinchT } : ent, count);
  else if (sprite === "vance_worried" && clip === "cast") index = Math.min(count - 1, Math.floor(Math.max(0, ent.stateT || 0) / 1.2 * count));
  else if (clip === "cast") index = poseIndex(ent, count, clip);
  else if (clip === "walk" || clip === "run") index = gaitIndex(ent, count, clip, sheet.fps);
  else if (once) index = poseIndex(ent, count, clip);
  else index = Math.floor((ent.anim || 0) / 0.1) % count;
  if (clip === "grab" && ent.team === "player" && Number.isInteger(sheet.holdFrame)) index = Math.min(sheet.holdFrame, Math.floor(Math.max(0, ent.stateT || 0) / .24 * (sheet.holdFrame + 1)));
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
  if (grabbedFlinch && !hasSheet(sprite, "grab_flinch")) {
    const recoil = Math.sin(Math.PI * (1 - ent.grabFlinchT / .22));
    ctx.translate(-5 * recoil, 0);
    ctx.rotate(-.035 * recoil);
  }
  if (ent.flash > 0) ctx.filter = ent.state === "grabbed" ? "brightness(1.35)" : "brightness(3)";
  ctx.drawImage(
    sheet.image,
    cell.x, cell.y, cell.w, cell.h,
    -(frame.anchorX ?? sheet.anchor.x) + (offset?.x || 0), -anchorY + (offset?.y || 0), cell.w, cell.h,
  );
  ctx.restore();
  return true;
}

