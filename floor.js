const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function play(name, id, fit) {
  const node = document.getElementById(id);
  if (!node || !window.lottie) return;
  const anim = window.lottie.loadAnimation({
    container: node,
    renderer: "svg",
    loop: !reduce,
    autoplay: !reduce,
    path: `art/${name}.json?v=arcade7`,
    rendererSettings: { preserveAspectRatio: fit },
  });
  if (reduce) {
    anim.addEventListener("DOMLoaded", () => anim.goToAndStop(48, true));
  }
}

async function boot() {
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (err) { /* still play */ }
  }
  play("attract", "attract", "xMidYMid slice");
  play("coin", "coin", "xMidYMid meet");
}

boot();
