export const WORLD = {
  viewW: 1280,
  viewH: 720,
  floorTop: 450,
  floorBottom: 650,
  gravity: 2100,
};

// Words the street carries: sign posts, plane banners, policy wins. Pulled from
// the songs and the comic so the game, the music and the strip say one thing.
export const SLOGANS = [
  "FREEZE THE RENT",
  "HEALTHCARE FOR ALL",
  "MONEY OUT OF POLITICS",
  "MONEY IN YOUR POCKET",
  "FREE BUSES",
  "TOWN HALL",
  "I'VE GOT RECEIPTS",
  "THIS CITY BELONGS TO YOU",
  "HOPE IS ALIVE",
  "TURN THE VOLUME UP",
];

// Stage 1 — Freeze the Rent. The block is hungry and getting evicted; the
// Landlord waits at the end of the street.
const rally = {
  id: "rally",
  name: "Freeze the Rent",
  policy: "RENT FROZEN",
  line: "Feed the block. Freeze the rent. The Landlord is at the end of the street.",
  clear: "The rent is frozen on this block. The clinic is next.",
  panel: "p27",
  length: 3600,
  sky0: "#1b2436",
  sky1: "#44556f",
  ground: "#3c4452",
  groundEdge: "#2a303b",
  accent: "#e0a45a",
  building: "#232a38",
  trim: "#8ea0b8",
  layers: [
    { name: "sky", speed: 0.04 },
    { name: "skyline", speed: 0.18 },
    { name: "blocks", speed: 1 },
  ],
  scenery: [
    {art:'nyc-lamp',x:80,y:459,w:82,h:330},
    {art:'nyc-lamp',x:1710,y:459,w:82,h:330},
    {art:'nyc-lamp',x:2820,y:459,w:82,h:330},
    {art:'scenery-pantry-night',x:305,y:459,w:195,h:218},
    {art:'scenery-kiosk-night',x:700,y:459,w:175,h:210},
    {art:'scenery-bus-stop-night',x:1430,y:459,w:280,h:280},
    {art:'scenery-planter-night',x:1960,y:459,w:165,h:150},
    {art:'scenery-planter-night',x:3180,y:459,w:165,h:150}
  ],
  signs: [],
  planes: [
    { text: "FREEZE THE RENT", y: 92, speed: 68, start: 0 },
    { text: "I'VE GOT RECEIPTS", y: 150, speed: 50, start: 1900 },
  ],
  citizens: [
    { kind: "hungry", x: 300, y: 610 },
    { kind: "evicted", x: 640, y: 500 },
    { kind: "hungry", x: 1150, y: 625 },
    { kind: "witness", x: 1340, y: 560 },
    { kind: "sick", x: 1860, y: 600 },
    { kind: "evicted", x: 2080, y: 500 },
    { kind: "worker", x: 2300, y: 625 },
  ],
  waves: [
    {
      at: 420,
      hint: "Neighbors in need: walk up and press J to help.",
      group: [{ kind: "cruz", dx: 20, y: 560 }, { kind: "pete", dx: 240, y: 600 }],
    },
    {
      at: 1020,
      hint: "Step out of his charge, then hit back.",
      group: [{ kind: "vance", dx: 80, y: 560 }],
    },
    {
      at: 1640,
      hint: "Keep the witness standing.",
      group: [{ kind: "greene", dx: 30, y: 510 }, { kind: "cruz", dx: 210, y: 610 }],
    },
    {
      at: 2560,
      boss: true,
      bossName: "The Landlord",
      group: [{ kind: "trump", dx: 180, y: 560 }],
    },
  ],
  pickups: [
    { kind: "pipe", x: 900, y: 600 },
  ],
  props: [
    { x: 420, y: 500, w: 70, h: 48 },
    { x: 980, y: 520, w: 90, h: 40 },
    { x: 1980, y: 490, w: 64, h: 54 },
  ],
};

// Stage 2 placeholder until the clinic block lands: Money Out of Politics in the studio.
const studio = {
  id: "studio",
  name: "Money Out of Politics",
  policy: "MONEY OUT",
  line: "The studio lights stay on. The Lobbyist runs the room.",
  clear: "The set goes dark. The capitol is last.",
  panel: "p37",
  length: 4200,
  sky0: "#2a1c2e",
  sky1: "#6a3a48",
  ground: "#4a3b34",
  groundEdge: "#2e241f",
  accent: "#f0c14a",
  building: "#3a2430",
  trim: "#e7d2a8",
  layers: [],
  signs: [],
  planes: [{ text: "MONEY OUT OF POLITICS", y: 100, speed: 60, start: 400 }],
  citizens: [
    { kind: "worker", x: 460, y: 600 },
    { kind: "witness", x: 1200, y: 560 },
    { kind: "sick", x: 1960, y: 620 },
    { kind: "hungry", x: 2400, y: 520 },
  ],
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
    { at: 2140, group: [{kind: "rogers", dx: 220, y: 560}] },
    {
      at: 3000,
      boss: true,
      bossName: "The Lobbyist",
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

const capitol = {
  id: "capitol",
  name: "Accountability",
  policy: "ON THE RECORD",
  line: "The Capitol approach. Bring the witnesses.",
  clear: "The approach is clear.",
  panel: null,
  length: 4200,
  sky0: "#101622",
  sky1: "#24344a",
  ground: "#2c3340",
  groundEdge: "#1a202b",
  accent: "#7ee0c6",
  building: "#1a2230",
  trim: "#9fb0c4",
  layers: [],
  scenery: [
    {art:'scenery-planter',x:460,y:459,w:170,h:160},
    {art:'scenery-bench',x:1160,y:459,w:180,h:133},
    {art:'scenery-planter',x:2170,y:459,w:170,h:160},
    {art:'scenery-bench',x:2880,y:680,w:180,h:133}
  ],
  signs: [],
  planes: [{ text: "I'VE GOT RECEIPTS", y: 96, speed: 72, start: 0 }],
  citizens: [
    { kind: "witness", x: 520, y: 560 },
    { kind: "hungry", x: 1000, y: 620 },
    { kind: "witness", x: 1500, y: 540 },
    { kind: "evicted", x: 2100, y: 500 },
    { kind: "witness", x: 2450, y: 580 },
  ],
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
      bossName: "The Insurance Exec",
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

export const STAGES = [rally, studio, capitol];

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
    citizens: (src.citizens || []).map((cit) => ({ ...cit })),
    scenery: (src.scenery || []).map(prop=>({...prop})),
    signs: (src.signs || []).map((sign) => ({ ...sign })),
    planes: (src.planes || []).map((plane) => ({ ...plane })),
    layers: (src.layers || []).map((layer) => ({ ...layer })),
    marks: [],
    won: false,
  };
}
