export const WORLD = {
  viewW: 1280,
  viewH: 720,
  floorTop: 450,
  floorBottom: 650,
  gravity: 2100,
};

const dock = {
  id: "dock",
  name: "Dock",
  line: "Night shift on the loading dock.",
  clear: "The dock is quiet. The market is not.",
  length: 4200,
  sky0: "#1b2436",
  sky1: "#44556f",
  ground: "#3c4452",
  groundEdge: "#2a303b",
  accent: "#e0a45a",
  building: "#232a38",
  trim: "#8ea0b8",
  waves: [
    {
      at: 640,
      group: [
        { kind: "grunt", dx: 40, y: 490 },
        { kind: "grunt", dx: 160, y: 570 },
        { kind: "grunt", dx: 110, y: 640 },
      ],
    },
    {
      at: 1560,
      group: [
        { kind: "grunt", dx: 20, y: 500 },
        { kind: "rusher", dx: 180, y: 560 },
        { kind: "rusher", dx: 90, y: 630 },
        { kind: "grunt", dx: 240, y: 520 },
      ],
    },
    {
      at: 2580,
      boss: true,
      bossName: "Crane",
      group: [{ kind: "crane", dx: 180, y: 560 }],
    },
  ],
  pickups: [
    { kind: "pipe", x: 460, y: 540 },
    { kind: "pipe", x: 1280, y: 600 },
  ],
  props: [
    { x: 280, y: 500, w: 70, h: 48 },
    { x: 980, y: 520, w: 90, h: 40 },
    { x: 2100, y: 490, w: 64, h: 54 },
  ],
};

const market = {
  id: "market",
  name: "Market",
  line: "The night market keeps its own rules.",
  clear: "Stalls closed. The roof is the last handoff.",
  length: 4200,
  sky0: "#2a1c2e",
  sky1: "#6a3a48",
  ground: "#4a3b34",
  groundEdge: "#2e241f",
  accent: "#f0c14a",
  building: "#3a2430",
  trim: "#e7d2a8",
  waves: [
    {
      at: 620,
      group: [
        { kind: "grunt", dx: 30, y: 500 },
        { kind: "thrower", dx: 220, y: 560 },
        { kind: "grunt", dx: 100, y: 630 },
      ],
    },
    {
      at: 1580,
      group: [
        { kind: "thrower", dx: 200, y: 490 },
        { kind: "rusher", dx: 40, y: 560 },
        { kind: "thrower", dx: 260, y: 630 },
        { kind: "rusher", dx: 120, y: 520 },
      ],
    },
    {
      at: 2600,
      boss: true,
      bossName: "Mara",
      group: [{ kind: "mara", dx: 220, y: 560 }],
    },
  ],
  pickups: [
    { kind: "bottle", x: 420, y: 520 },
    { kind: "pipe", x: 1100, y: 600 },
    { kind: "bottle", x: 1960, y: 500 },
  ],
  props: [
    { x: 360, y: 480, w: 110, h: 36 },
    { x: 1500, y: 500, w: 120, h: 34 },
    { x: 2300, y: 610, w: 80, h: 36 },
  ],
};

const roof = {
  id: "roof",
  name: "Roof",
  line: "Last handoff is on the roof.",
  clear: "The bag is on the far ledge.",
  length: 4200,
  sky0: "#101622",
  sky1: "#24344a",
  ground: "#2c3340",
  groundEdge: "#1a202b",
  accent: "#7ee0c6",
  building: "#1a2230",
  trim: "#9fb0c4",
  waves: [
    {
      at: 700,
      group: [
        { kind: "rusher", dx: 30, y: 500 },
        { kind: "grunt", dx: 140, y: 570 },
        { kind: "rusher", dx: 220, y: 630 },
        { kind: "grunt", dx: 80, y: 530 },
      ],
    },
    {
      at: 1680,
      group: [
        { kind: "thrower", dx: 240, y: 490 },
        { kind: "grunt", dx: 40, y: 560 },
        { kind: "thrower", dx: 180, y: 640 },
        { kind: "rusher", dx: 100, y: 520 },
      ],
    },
    {
      at: 2680,
      boss: true,
      bossName: "Signal",
      group: [{ kind: "signal", dx: 200, y: 560 }],
    },
  ],
  pickups: [
    { kind: "pipe", x: 480, y: 560 },
    { kind: "pipe", x: 1320, y: 500 },
  ],
  props: [
    { x: 300, y: 470, w: 54, h: 70 },
    { x: 1200, y: 480, w: 48, h: 80 },
    { x: 2200, y: 500, w: 60, h: 64 },
  ],
};

export const STAGES = [dock, market, roof];

export function cloneStage(index) {
  const src = STAGES[index];
  return {
    ...src,
    waves: src.waves.map((wave) => ({
      ...wave,
      spawned: false,
      group: wave.group.map((member) => ({ ...member })),
    })),
    pickups: src.pickups.map((pickup) => ({ ...pickup, taken: false })),
    props: src.props.map((prop) => ({ ...prop })),
  };
}
