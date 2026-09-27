// On-screen controls for touch screens. They send the same keydown and keyup
// events a keyboard would, so each game keeps its own input code.
//
//   mountTouchControls(host, {
//     pad: { left: key, right: key, up: key, down: key },
//     buttons: [{ label, key, tone }],
//   })
//
// A key is { key, code } as it would appear on a KeyboardEvent.
(function () {
  function send(type, k) {
    window.dispatchEvent(new KeyboardEvent(type, { key: k.key, code: k.code, bubbles: true }));
  }

  function makePad(keys) {
    const pad = document.createElement("div");
    pad.className = "touch-pad";
    pad.setAttribute("aria-label", "Movement stick");
    const nub = document.createElement("span");
    nub.className = "touch-nub";
    pad.append(nub);

    const held = new Set();
    let id = null;

    function setHeld(next) {
      for (const dir of held) if (!next.has(dir)) send("keyup", keys[dir]);
      for (const dir of next) if (!held.has(dir)) send("keydown", keys[dir]);
      held.clear();
      for (const dir of next) held.add(dir);
    }

    function aim(ev) {
      const box = pad.getBoundingClientRect();
      const r = box.width / 2;
      let dx = ev.clientX - (box.left + r);
      let dy = ev.clientY - (box.top + r);
      const dist = Math.hypot(dx, dy);
      if (dist > r) {
        dx = (dx / dist) * r;
        dy = (dy / dist) * r;
      }
      nub.style.transform = `translate(${dx * 0.6}px, ${dy * 0.6}px)`;
      const next = new Set();
      const dead = r * 0.28;
      if (dist > dead) {
        const angle = Math.atan2(dy, dx);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        if (cos > 0.38) next.add("right");
        if (cos < -0.38) next.add("left");
        if (sin > 0.38) next.add("down");
        if (sin < -0.38) next.add("up");
      }
      setHeld(next);
    }

    function end(ev) {
      if (ev.pointerId !== id) return;
      id = null;
      nub.style.transform = "";
      setHeld(new Set());
    }

    pad.addEventListener("pointerdown", (ev) => {
      if (id !== null) return;
      id = ev.pointerId;
      try { pad.setPointerCapture(id); } catch (err) { /* capture is optional */ }
      aim(ev);
      ev.preventDefault();
    });
    pad.addEventListener("pointermove", (ev) => {
      if (ev.pointerId === id) aim(ev);
    });
    pad.addEventListener("pointerup", end);
    pad.addEventListener("pointercancel", end);
    return pad;
  }

  function makeButton(def) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `touch-btn${def.tone ? ` ${def.tone}` : ""}`;
    btn.textContent = def.label;
    let id = null;
    btn.addEventListener("pointerdown", (ev) => {
      if (id !== null) return;
      id = ev.pointerId;
      try { btn.setPointerCapture(id); } catch (err) { /* capture is optional */ }
      btn.classList.add("down");
      send("keydown", def);
      ev.preventDefault();
    });
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      id = null;
      btn.classList.remove("down");
      send("keyup", def);
    };
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("contextmenu", (ev) => ev.preventDefault());
    return btn;
  }

  window.mountTouchControls = function (host, config) {
    const bar = document.createElement("div");
    bar.className = "touch";
    bar.hidden = true;
    bar.append(makePad(config.pad));
    const cluster = document.createElement("div");
    cluster.className = "touch-buttons";
    for (const def of config.buttons) cluster.append(makeButton(def));
    bar.append(cluster);
    host.append(bar);

    const coarse = window.matchMedia("(pointer: coarse)");
    const show = () => {
      bar.hidden = false;
      document.documentElement.classList.add("has-touch");
    };
    if (coarse.matches) show();
    window.addEventListener("touchstart", show, { once: true, passive: true });
    return bar;
  };
})();
