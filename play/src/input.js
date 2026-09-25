const LEFT = new Set(["ArrowLeft", "KeyA"]);
const RIGHT = new Set(["ArrowRight", "KeyD"]);
const UP = new Set(["ArrowUp", "KeyW"]);
const DOWN = new Set(["ArrowDown", "KeyS"]);
const BLOCK = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space",
]);

export function blankInput() {
  return {
    x: 0,
    y: 0,
    down: false,
    justLeft: false,
    justRight: false,
    light: false,
    heavy: false,
    special: false,
    jump: false,
    confirm: false,
  };
}

export function createInput() {
  const down = new Set();
  const just = new Set();

  function onDown(e) {
    if (BLOCK.has(e.code)) e.preventDefault();
    if (!down.has(e.code)) just.add(e.code);
    down.add(e.code);
  }

  function onUp(e) {
    down.delete(e.code);
  }

  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);

  return {
    snapshot() {
      const left = [...LEFT].some((c) => down.has(c));
      const right = [...RIGHT].some((c) => down.has(c));
      const up = [...UP].some((c) => down.has(c));
      const downKey = [...DOWN].some((c) => down.has(c));
      let x = 0;
      let y = 0;
      if (left && !right) x = -1;
      if (right && !left) x = 1;
      if (up && !downKey) y = -1;
      if (downKey && !up) y = 1;
      const snap = {
        x,
        y,
        down: downKey,
        justLeft: [...LEFT].some((c) => just.has(c)),
        justRight: [...RIGHT].some((c) => just.has(c)),
        light: just.has("KeyJ"),
        heavy: just.has("KeyK"),
        special: just.has("KeyL"),
        jump: just.has("Space"),
        confirm: just.has("Enter") || just.has("Space"),
      };
      just.clear();
      return snap;
    },
  };
}
