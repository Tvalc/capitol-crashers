// Advance from resolved travel, after collisions and camera bounds.
export function advanceGait(ent, oldX, oldY) {
  if (ent.state === "idle" && ent.animationState !== "idle") ent.idleStartedAt = ent.anim || 0;
  ent.animationState = ent.state;
  const moving = ["walk", "run", "dash", "charge"].includes(ent.state);
  const clip = ent.state === "walk" ? "walk" : "run";
  if (!moving) { ent.gaitClip = null; ent.gaitDistance = 0; return; }
  if (ent.gaitClip !== clip || ent.gaitFacing !== ent.facing) ent.gaitDistance = 0;
  ent.gaitClip = clip;
  ent.gaitFacing = ent.facing;
  ent.gaitDistance = (ent.gaitDistance || 0) + Math.hypot(ent.x - oldX, (ent.y - oldY) / 0.72);
}
