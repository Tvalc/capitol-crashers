import { helpAction } from "./help-actions.js?v=flight39b";
// Citizens are the people the fighters stop for. They never take damage and
// never deal it. Standing next to one and pressing strike helps them.
// Witnesses are the exception: once helped they follow the fighter to the boss,
// and villains can knock them down on the way.
import { play } from "./audio.js?v=flight39b";
import { WORLD } from "./stages.js?v=flight39b";

export const CITIZEN_KINDS = {
  hungry: {
    name: "Hungry neighbor",
    need: "No dinner tonight.",
    give: "Hot Meal and a Winter Coat",
    verb: "FED",
    points: 150,
    icon: "bowl",
    body: "#7a5a3a",
    trim: "#e8d9b8",
    skin: "#c98f68",
    pants: "#2c2622",
  },
  sick: {
    name: "Sick neighbor",
    need: "Can't afford the clinic.",
    give: "Care, no bill",
    verb: "TREATED",
    points: 180,
    icon: "cross",
    body: "#6b7f9a",
    trim: "#f1f1f1",
    skin: "#e0b088",
    pants: "#2a2f3a",
  },
  evicted: {
    name: "Evicted tenant",
    need: "Rent went up again.",
    give: "RENT FROZEN",
    verb: "HOUSED",
    points: 200,
    icon: "box",
    body: "#8a4a5a",
    trim: "#f0d0a0",
    skin: "#dbb08a",
    pants: "#241818",
    mark: "RENT FROZEN",
  },
  worker: {
    name: "Broke worker",
    need: "Two jobs, still short.",
    give: "A good job and a tax break",
    verb: "HIRED",
    points: 180,
    icon: "dollar",
    body: "#3a6a62",
    trim: "#e7d27a",
    skin: "#c68c62",
    pants: "#1c2422",
  },
  witness: {
    name: "Witness",
    need: "I've got receipts.",
    give: "A seat at the table",
    verb: "ON THE RECORD",
    points: 250,
    icon: "folder",
    body: "#2f3b55",
    trim: "#ffd23f",
    skin: "#e4b48a",
    pants: "#1a2030",
  },
};

let seq = 1;

export function makeCitizen(kind, x, y) {
  const stats = CITIZEN_KINDS[kind];
  return {
    id: `c${seq++}`,
    team: "citizen",
    kind,
    sprite: `citizen_${kind}`,
    name: stats.name,
    x,
    y: clampY(y),
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    facing: -1,
    w: 72,
    h: 190,
    // need -> helped -> leaving (all kinds)
    // witness: need -> follow -> (down -> need) -> testified -> leaving
    state: "need",
    stateT: 0,
    anim: Math.random() * 4,
    alive: true,
    scale: 1,
    isBoss: false,
    flash: 0,
    invuln: 0,
    colors: stats,
    verb: stats.verb,
    points: stats.points,
  };
}

function clampY(y) {
  return Math.max(WORLD.floorTop, Math.min(WORLD.floorBottom, y));
}

export function citizenInNeed(cit) {
  return cit.alive && (cit.state === "need" || cit.state === "down" && cit.stateT > 1.6);
}

// Nearest citizen the fighter can help from where they stand. Either side counts:
// you should never have to turn around to hand someone a meal.
export function helpTarget(game, player, reach = 78) {
  let best = null;
  let bestD = reach;
  for (const cit of game.citizens || []) {
    if (!citizenInNeed(cit)) continue;
    const dx = Math.abs(cit.x - player.x);
    const dy = Math.abs(cit.y - player.y);
    if (dx < bestD && dy < 36) {
      best = cit;
      bestD = dx;
    }
  }
  return best;
}

export function startHelp(game, player, cit) {
  player.state = "help";
  player.stateT = 0;
  player.spawned = false;
  player.helpId = cit.id;
  player.vx = 0;
  player.vy = 0;
  player.facing = cit.x >= player.x ? 1 : -1;
  cit.facing = -player.facing;
  player.helpKind = cit.state === "down" ? "rescue" : cit.kind;
  const action = helpAction(player, player.helpKind);
  if (action) {
    const depth = .86 + (cit.y - WORLD.floorTop) / (WORLD.floorBottom - WORLD.floorTop) * .2;
    const distance = action.offsetX * 1.05 * depth;
    if (cit.x - player.facing * distance < 30 || cit.x - player.facing * distance > game.stage.length - 30) player.facing *= -1;
    const targetX = cit.x - player.facing * distance;
    const targetY = clampY(cit.y - action.offsetY * 1.05 * depth);
    player.helpAction = { ...action, approach: Math.max(.18, Math.hypot(targetX - player.x, targetY - player.y) / 300), fromX: player.x, fromY: player.y, targetX, targetY };
    cit.helpDelivered = false;
    cit.facing = -player.facing;
    cit.helpPreviousState = cit.state;
    cit.helpOwner = player;
    cit.state = "receiving";
    cit.stateT = 0;
  }
}

export function finishHelp(game, player) {
  const cit = (game.citizens || []).find(c => c.id === player.helpId);
  if (cit?.helpOwner === player) {
    cit.state = player.spawned ? (cit.kind === "witness" ? "follow" : cit.kind === "hungry" ? "leaving" : "helped") : cit.helpPreviousState;
    cit.stateT = player.spawned ? 0 : cit.state === "down" ? 1.7 : 0;
    if (player.spawned && cit.kind === "hungry") {cit.facing=player.facing;cit.anim=0;}
    delete cit.helpOwner;
    delete cit.helpPreviousState;
    delete cit.helpDelivered;
  }
  player.helpId = null;
  player.helpAction = null;
}

// Called by the player state machine at the moment of the hand-off.
export function deliverHelp(game, player, cit) {
  if (!cit || !(citizenInNeed(cit) || cit.state === "receiving" && cit.helpOwner === player)) return false;
  if (cit.helpDelivered) return false;
  if (cit.helpOwner) cit.helpDelivered = true;
  const stats = CITIZEN_KINDS[cit.kind];
  cit.stateT = 0;
  cit.flash = 0;
  if (cit.kind === "witness") {
    cit.state = "follow";
    game.banner = "Witness joins you · keep them standing";
    game.bannerT = 1.6;
  } else {
    cit.state = cit.kind === "hungry" ? "leaving" : "helped";
    if(cit.kind === "hungry") {cit.facing=player.facing;cit.anim=0;}
    game.banner = stats.give;
    game.bannerT = 1.1;
  }
  if (cit.helpOwner) cit.state = "receiving";
  if (stats.mark) {
    game.stage.marks = game.stage.marks || [];
    game.stage.marks.push({ x: cit.x, y: WORLD.floorTop - 10, text: stats.mark, t: 0 });
  }
  game.helped = (game.helped || 0) + 1;
  if (game.comboKind !== "help") game.combo = 0;
  game.comboKind = "help";
  game.combo += 1;
  game.comboT = 2.6;
  game.score += Math.round(stats.points * (1 + (game.combo - 1) * 0.25));
  game.fx.push({ x: cit.x, y: cit.y, z: cit.h + 20, t: 0, life: 0.6, kind: "heart" });
  play("pickup");
  return true;
}

export function followingWitness(game) {
  return (game.citizens || []).find((cit) => cit.kind === "witness" && cit.state === "follow");
}

// Villains knock a following witness down. They are never damaged; they just
// drop their folder and need a moment (and a hand) to get back up.
export function knockWitness(game, cit, facing) {
  if (cit.state !== "follow") return;
  cit.state = "down";
  cit.stateT = 0;
  cit.vx = facing * 220;
  cit.vz = 240;
  game.banner = "Witness down · help them up";
  game.bannerT = 1.3;
  play("hurt");
}

// A following witness who reaches the boss arena puts the receipts on the record.
export function witnessTestifies(game, boss) {
  const cit = followingWitness(game);
  if (!cit || !boss) return false;
  const cut = Math.round(boss.hpMax / 3);
  boss.hp = Math.max(1, boss.hp - cut);
  boss.flash = 0.3;
  cit.state = "testified";
  cit.stateT = 0;
  game.testified = (game.testified || 0) + 1;
  game.score += 400;
  game.banner = `Receipts on the record · ${boss.name} loses a third`;
  game.bannerT = 2.2;
  game.fx.push({ x: boss.x, y: boss.y, z: boss.h + 10, t: 0, life: 0.5, kind: "receipts" });
  play("clear");
  return true;
}

export function updateCitizens(game, dt) {
  const player = game.player;
  for (const cit of game.citizens || []) {
    cit.anim += dt;
    cit.stateT += dt;
    if (cit.flash > 0) cit.flash = Math.max(0, cit.flash - dt);
    if (cit.state === "receiving") {
      cit.vx = cit.vy = 0;
      if (cit.helpOwner?.state !== "help" || !cit.helpOwner?.alive) finishHelp(game, cit.helpOwner);
      continue;
    }
    if (cit.state === "need") {
      if (player?.alive && Math.abs(player.x - cit.x) < 320) cit.facing = player.x >= cit.x ? 1 : -1;
      continue;
    }
    if (cit.state === "helped") {
      // A beat of relief, then they head off down the street.
      if (cit.stateT > 1.4) {
        cit.state = "leaving";
        cit.stateT = 0;
        cit.facing = Math.random() < 0.5 ? -1 : 1;
      }
      continue;
    }
    if (cit.state === "follow") {
      if (!player?.alive) continue;
      const goalX = player.x - player.facing * 74;
      const goalY = player.y + 12;
      const dx = goalX - cit.x;
      const dy = goalY - cit.y;
      const dist = Math.hypot(dx, dy);
      const speed = Math.min(300, Math.max(0, dist - 10) * 4);
      if (dist > 10) {
        cit.vx = (dx / dist) * speed;
        cit.vy = (dy / dist) * speed * 0.8;
        cit.x += cit.vx * dt;
        cit.y = clampY(cit.y + cit.vy * dt);
        cit.facing = dx >= 0 ? 1 : -1;
      } else {
        cit.vx = cit.vy = 0;
        cit.facing = player.facing;
      }
      continue;
    }
    if (cit.state === "down") {
      cit.z += cit.vz * dt;
      cit.vz -= WORLD.gravity * dt;
      if (cit.z <= 0) { cit.z = 0; cit.vz = 0; cit.vx *= Math.exp(-6 * dt); }
      cit.x += cit.vx * dt;
      continue;
    }
    if (cit.state === "testified") {
      if (cit.stateT > 1.2) {
        cit.state = "leaving";
        cit.stateT = 0;
        cit.facing = -1;
      }
      continue;
    }
    if (cit.state === "leaving") {
      cit.vx = cit.facing * 150;
      cit.x += cit.vx * dt;
      const cam = game.cameraX || 0;
      if (cit.x < cam - 120 || cit.x > cam + WORLD.viewW + 120) cit.alive = false;
    }
  }
  game.citizens = (game.citizens || []).filter((cit) => cit.alive);
  for (const mark of game.stage?.marks || []) mark.t += dt;
  if (game.stage) game.stage.marks = (game.stage.marks || []).filter(mark => mark.t < 3);
}

// After the policy wins, a few neighbors come out to celebrate on the block.
export function spawnCelebration(game, count = 4) {
  const kinds = Object.keys(CITIZEN_KINDS).filter((kind) => kind !== "witness");
  const cam = game.cameraX || 0;
  for (let i = 0; i < count; i++) {
    const cit = makeCitizen(kinds[i % kinds.length], cam + 160 + i * 230 + Math.random() * 60, WORLD.floorTop + 40 + Math.random() * 150);
    cit.state = "helped";
    cit.stateT = -0.4 * i;
    cit.facing = 1;
    cit.celebrating = true;
    game.citizens.push(cit);
  }
}
