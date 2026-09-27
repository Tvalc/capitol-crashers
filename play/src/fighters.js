export const FIGHTERS = {
  mamdani: {
    id: "mamdani",
    name: "Mamdani",
    blurb: "Fast feet, short combo window, lighter hits. Walked the length of Manhattan in one night.",
    hp: 100,
    speed: 268,
    comboWindow: 0.2,
    reach: 52,
    power: 0.82,
    specialCost: 18,
    body: "#ffc61a",
    trim: "#1a1a1a",
    skin: "#c98f68",
    pants: "#1c1f26",
    bag: "#2a2a2a",
    hat: "hair",
    hair: "#17110d",
    story: { intro: "p08", beats: ["p15", "p21"], end: "p26" },
  },
  sayed: {
    id: "sayed",
    name: "El-Sayed",
    blurb: "Long reach, heavy hits, slow feet. Captained wrestling, football and lacrosse.",
    hp: 100,
    speed: 188,
    comboWindow: 0.34,
    reach: 78,
    power: 1.22,
    specialCost: 18,
    body: "#0076b6",
    trim: "#c8d0d8",
    skin: "#c68c62",
    pants: "#1c2430",
    bag: "#c8d0d8",
    hat: "hair",
    hair: "#17110d",
    story: { intro: "p09", beats: ["p12", "p25"], end: "p26" },
  },
};

export const FIGHTER_LIST = [FIGHTERS.mamdani, FIGHTERS.sayed];

export const POSES = {
  idle: { punch: 0, step: 0, lean: 0 },
  walkA: { punch: 0.08, step: 1, lean: 2 },
  walkB: { punch: 0, step: -1, lean: 2 },
  light1: { punch: 0.72, step: 0, lean: 4 },
  light2: { punch: 0.9, step: 0, lean: 6 },
  light3: { punch: 1, step: 0, lean: 10 },
  heavy: { punch: 1, step: 0, lean: 12 },
  jump: { punch: 0.15, step: -1, lean: 0, air: 1 },
  jatk: { punch: 0.85, step: -1, lean: 6, air: 1 },
  hurt: { punch: 0, step: 0, lean: -8, hurt: 1 },
  air: { punch: 0.2, step: -1, lean: -10, hurt: 1, air: 1 },
  down: { punch: 0, step: 0, lean: 0, down: 1 },
  getup: { punch: 0.2, step: 0, lean: -4 },
  special: { punch: 1, step: 0, lean: 0, special: 1 },
  dash: { punch: 0.35, step: 1, lean: 12 },
  dashatk: { punch: 1, step: 1, lean: 14 },
  grab: { punch: 0.45, step: 0, lean: 4 },
  throw: { punch: 1, step: 0, lean: 12 },
  attack: { punch: 0.8, step: 0, lean: 6 },
  charge: { punch: 0.6, step: 1, lean: 14 },
  windup: { punch: 0.15, step: 0, lean: -6 },
};

export function poseFor(ent) {
  if (ent.state === "walk") {
    return Math.sin(ent.anim * 10) > 0 ? POSES.walkA : POSES.walkB;
  }
  if (ent.state === "light") {
    return [POSES.light1, POSES.light2, POSES.light3][ent.combo] || POSES.light1;
  }
  return POSES[ent.state] || POSES.idle;
}
