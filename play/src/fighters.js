export const FIGHTERS = {
  rook: {
    id: "rook",
    name: "Rook",
    blurb: "Long reach, heavy hits, slow feet.",
    hp: 100,
    speed: 188,
    comboWindow: 0.34,
    reach: 78,
    power: 1.22,
    specialCost: 18,
    body: "#3d5a80",
    trim: "#e2b657",
    skin: "#e4b48a",
    pants: "#1c2430",
    bag: "#c4a574",
    hat: "cap",
  },
  flick: {
    id: "flick",
    name: "Flick",
    blurb: "Fast feet, short combo window, lighter hits.",
    hp: 100,
    speed: 268,
    comboWindow: 0.2,
    reach: 52,
    power: 0.82,
    specialCost: 18,
    body: "#c4493a",
    trim: "#7ec8e3",
    skin: "#d39a6c",
    pants: "#241c30",
    bag: "#8d6a45",
    hat: "tail",
  },
};

export const FIGHTER_LIST = [FIGHTERS.rook, FIGHTERS.flick];

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
