let ctx;

export function unlock() {
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
}

function tone(freq, dur, type, gain, delay = 0) {
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

export function play(name, combo = 1) {
  if (!ctx) return;
  if (name === "hit") {
    tone(160 + combo * 18, 0.06, "square", 0.045);
    tone(80, 0.08, "sawtooth", 0.04);
  } else if (name === "heavy") {
    tone(110, 0.1, "sawtooth", 0.06);
    tone(220, 0.08, "square", 0.04);
  } else if (name === "special") {
    tone(320, 0.16, "sawtooth", 0.05);
    tone(180, 0.22, "triangle", 0.04);
    tone(90, 0.28, "square", 0.04, 0.05);
  } else if (name === "jump") {
    tone(420, 0.08, "square", 0.03);
  } else if (name === "pickup") {
    tone(520, 0.07, "triangle", 0.04);
    tone(740, 0.08, "triangle", 0.03, 0.06);
  } else if (name === "hurt") {
    tone(140, 0.1, "sawtooth", 0.05);
    tone(70, 0.14, "square", 0.04);
  } else if (name === "ko") {
    tone(90, 0.25, "sawtooth", 0.06);
    tone(50, 0.35, "triangle", 0.05, 0.08);
  } else if (name === "throw") {
    tone(240, 0.09, "square", 0.04);
    tone(120, 0.12, "sawtooth", 0.04);
  } else if (name === "boss") {
    tone(98, 0.2, "square", 0.05);
    tone(73, 0.28, "sawtooth", 0.04, 0.12);
  } else if (name === "clear") {
    tone(523, 0.12, "triangle", 0.04);
    tone(659, 0.14, "triangle", 0.04, 0.1);
    tone(784, 0.18, "triangle", 0.04, 0.2);
  } else if (name === "ui") {
    tone(660, 0.06, "square", 0.03);
  } else if (name === "break") {
    tone(180, 0.08, "square", 0.04);
    tone(90, 0.1, "sawtooth", 0.04, 0.04);
  } else if (name === "dash") {
    tone(300, 0.07, "sawtooth", 0.03);
  }
}
