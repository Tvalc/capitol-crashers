const CLIPS = {
  zohran: ["idle", "walk", "run", "jump", "attack", "hit", "death", "cast", "grab", "throw", "lunge", "reversal"],
  abdul: ["idle", "walk", "run", "jump", "attack", "hit", "death", "cast", "grab", "throw", "lunge"],
  trump: ["idle", "walk", "run", "attack", "hit", "death", "cast"],
  vance: ["idle", "walk", "run", "attack", "hit", "death", "cast", "grab"],
  greene: ["idle", "run", "attack", "hit", "death"],
  cruz: ["idle", "walk", "run", "attack", "hit", "death"],
};

const FILE = {
  zohran: "zohran_mamdani",
  abdul: "abdul_el_sayed",
  trump: "donald_trump",
  vance: "jd_vance",
  greene: "marjorie_taylor_greene",
  cruz: "ted_cruz",
};

const FALLBACK = {
  idle: ["idle", "walk", "run"],
  walk: ["walk", "idle"],
  run: ["run", "walk", "idle"],
  jump: ["jump", "idle"],
  attack: ["attack", "idle"],
  hit: ["hit", "idle"],
  death: ["death", "hit", "idle"],
  cast: ["cast", "attack", "idle"],
  lunge: ["lunge", "attack", "idle"],
  reversal: ["reversal", "attack", "idle"],
  throw: ["throw", "attack", "idle"],
  backstep: ["backstep", "hit", "idle"],
  grab: ["grab", "attack", "idle"],
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
  return Promise.all(jobs).then(() => {
    if (sheets.has("greene:run") && !sheets.has("greene:walk")) {
      sheets.set("greene:walk", sheets.get("greene:run"));
    }
  });
}

function loadOne(sprite, clip, name) {
  const image = new Image();
  const dataPromise = fetch(`assets/sprites/${name}.json?v=moves`).then((res) => res.json());
  const imagePromise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = `assets/sprites/${name}.webp?v=moves`;
  });
  return Promise.all([dataPromise, imagePromise]).then(([data, img]) => {
    const frames = Object.values(data.frames).sort((a, b) => a.frame.x - b.frame.x);
    sheets.set(clipKey(sprite, clip), {
      image: img,
      frames,
      anchor: data.meta?.anchor || { x: frames[0].sourceSize.w / 2, y: frames[0].sourceSize.h },
    });
  }).catch(() => {});
}

export function actorSprite(ent) {
  if (ent.team === "player") return ent.fighter?.sprite || ent.kind;
  return ent.sprite || ent.kind;
}

export function clipFor(state) {
  if (state === "walk") return "walk";
  if (state === "dash" || state === "charge") return "run";
  if (state === "jump" || state === "jatk") return "jump";
  if (state === "backstep") return "backstep";
  if (state === "lunge") return "lunge";
  if (state === "reversal") return "reversal";
  if (state === "throw") return "throw";
  if (state === "grab") return "grab";
  if (state === "grabbed") return "hit";
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
  for (const name of FALLBACK[clip] || ["idle"]) {
    const sheet = sheets.get(clipKey(sprite, name));
    if (sheet) return { sheet, clip: name };
  }
  return null;
}

function attackWindow(ent) {
  if (ent.team === "player" && (ent.kind === "abdul" || ent.kind === "sayed")) {
    const link = ent.fighter?.comboWindow || 0.2;
    if (ent.state === "special") return { startup: 0.1, active: 0.08, total: 0.58 };
    if (ent.state === "lunge") return { startup: 0.06, active: 0.07, total: 0.31 };
    if (ent.state === "reversal") return { startup: 0.05, active: 0.07, total: 0.32 };
    if (ent.state === "heavy") return { startup: 0.1, active: 0.08, total: 0.36 };
    if (ent.state === "dashatk") return { startup: 0.07, active: 0.07, total: 0.3 };
    if (ent.state === "jatk") return { startup: 0.08, active: 0.07, total: 0.28 };
    if (ent.combo === 2) return { startup: 0.1, active: 0.08, total: 0.18 + link };
    if (ent.combo === 1) return { startup: 0.07, active: 0.07, total: 0.14 + link };
    return { startup: 0.08, active: 0.07, total: 0.15 + link };
  }
  if (ent.team === "player") {
    const link = ent.fighter?.comboWindow || 0.34;
    if (ent.state === "heavy") return { startup: 0.28, active: 0.14, total: 0.8 };
    if (ent.state === "dashatk") return { startup: 0.14, active: 0.12, total: 0.54 };
    if (ent.state === "special") return { startup: 0.14, active: 0.12, total: 0.68 };
    if (ent.state === "lunge") return { startup: 0.18, active: 0.12, total: 0.62 };
    if (ent.state === "reversal") return { startup: 0.12, active: 0.1, total: 0.5 };
    if (ent.state === "jatk") return { startup: 0.12, active: 0.12, total: 0.4 };
    if (ent.state === "throw" || ent.state === "grab") return { startup: 0.16, active: 0.14, total: 0.56 };
    if (ent.combo === 2) return { startup: 0.24, active: 0.14, total: 0.38 + link };
    if (ent.combo === 1) return { startup: 0.18, active: 0.12, total: 0.3 + link };
    return { startup: 0.2, active: 0.12, total: 0.32 + link };
  }
  if (ent.kind === "trump") {
    if (ent.swingHigh) return { startup: 0.62, active: 0.12, total: 1.05 };
    const late = ent.phase2 ? 0.28 : 0.46;
    return { startup: late, active: 0.1, total: ent.phase2 ? 0.62 : 0.86 };
  }
  if (ent.kind === "greene") return { startup: 0.4, active: 0.12, total: 0.72 };
  if (ent.kind === "cruz" && ent.state === "windup") return { startup: 0.28, active: 0.04, total: 0.32 };
  if (ent.kind === "vance") return { startup: 0.08, active: 0.16, total: 0.32 };
  return { startup: 0.18, active: 0.08, total: 0.48 };
}

function contactAt(ent, count) {
  let frac = 0.42;
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

function poseIndex(ent, count, clip) {
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
  trump: { walk: 0.095, run: 0.062 },
  vance: { walk: 0.11, run: 0.068 },
  cruz: { walk: 0.088, run: 0.06 },
  greene: { walk: 0.09, run: 0.07 },
};

function gaitIndex(ent, count, clip) {
  const step = STEP[actorSprite(ent)]?.[clip] || (clip === "run" ? 0.055 : 0.08);
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

export function drawSprite(ctx, ent, sx, sc) {
  const sprite = actorSprite(ent);
  const wanted = clipFor(ent.state);
  const resolved = resolveSheet(sprite, wanted);
  if (!resolved) return false;
  const { sheet, clip } = resolved;
  const count = sheet.frames.length;
  const once = ONCE.has(clip);
  let index;
  if (clip === "idle") {
    const step = sprite === "zohran" ? 0.14 : sprite === "abdul" ? 0.2 : 0;
    index = step ? Math.floor((ent.anim || 0) / step) % count : 0;
  }
  else if (clip === "hit") index = flinchIndex(ent, count);
  else if (clip === "cast") {
    const u = Math.min(0.999, (ent.stateT || 0) / 0.48);
    index = Math.min(count - 1, Math.floor(u * count));
  }
  else if (clip === "walk" || clip === "run") index = gaitIndex(ent, count, clip);
  else if (once) index = poseIndex(ent, count, clip);
  else index = Math.floor((ent.anim || 0) / 0.1) % count;
  if (index < 0) index = 0;
  const frame = sheet.frames[index];
  const cell = frame.frame;
  ctx.save();
  ctx.translate(sx, ent.y - (ent.z || 0));
  ctx.scale(sc * (ent.facing || 1), sc);
  if (ent.flash > 0) ctx.filter = "brightness(3)";
  ctx.drawImage(
    sheet.image,
    cell.x, cell.y, cell.w, cell.h,
    -sheet.anchor.x, -sheet.anchor.y, cell.w, cell.h,
  );
  ctx.restore();
  return true;
}
