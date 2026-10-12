// Keep flyovers moving nose-first both on screen and against the scrolling street.
export function advanceFlyover(previous, time, cameraX, index, viewWidth) {
  const elapsed = time - (8 + index * 22);
  if (elapsed < 0) return null;
  const cycle = Math.floor(elapsed / 58);
  const phase = elapsed % 58;
  const speed = 165;
  let distance = phase * speed;
  if (previous && previous.cycle === cycle && time >= previous.time) {
    const dt = time - previous.time;
    // Forward scrolling must not overtake the plane. Backtracking must not
    // pull it tail-first; keep at least its own airspeed across the screen.
    distance = previous.distance + speed * dt + Math.max(0, cameraX - previous.cameraX);
  }
  return { cycle, time, cameraX, distance, x: viewWidth + 100 - distance };
}
