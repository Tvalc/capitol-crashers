export const WORLD = {
  viewW: 1280,
  viewH: 720,
  floorTop: 450,
  floorBottom: 650,
  gravity: 2100,
};

const dock = {
  id: "rally",
  name: "Street rally",
  line: "Night fight on the rally street.",
  clear: "The rally breaks. The studio is next.",
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
        { kind: "greene", dx: 40, y: 520 },
        { kind: "cruz", dx: 180, y: 600 },
      ],
    },
    {
      at: 1560,
      group: [
        { kind: "vance", dx: 80, y: 560 },
      ],
    },
    {
      at: 2580,
      boss: true,
      bossName: "Donald Trump",
      group: [{ kind: "trump", dx: 180, y: 560 }],
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
  id: "studio",
  name: "Cable studio",
  line: "The studio lights stay on.",
  clear: "The set goes dark. The capitol is last.",
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
        { kind: "cruz", dx: 40, y: 520 },
        { kind: "greene", dx: 200, y: 600 },
      ],
    },
    {
      at: 1580,
      group: [
        { kind: "greene", dx: 60, y: 540 },
        { kind: "cruz", dx: 200, y: 610 },
      ],
    },
    {
      at: 2600,
      boss: true,
      bossName: "JD Vance",
      group: [{ kind: "vance", dx: 200, y: 560 }],
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
  id: "capitol",
  name: "Capitol approach",
  line: "The last fight is on the capitol approach.",
  clear: "The approach is clear.",
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
        { kind: "greene", dx: 40, y: 520 },
        { kind: "cruz", dx: 190, y: 600 },
      ],
    },
    {
      at: 1680,
      group: [
        { kind: "cruz", dx: 50, y: 540 },
        { kind: "greene", dx: 210, y: 610 },
      ],
    },
    {
      at: 2680,
      boss: true,
      bossName: "Ted Cruz",
      group: [{ kind: "cruz", dx: 180, y: 560 }],
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
