(() => {
  const tracks = [
    '01-freeze-the-rent', '02-shouldnt-be-this-hard', '03-hope-is-alive',
    '04-this-city-belongs-to-you', '05-turn-the-volume-up', '06-town-hall',
    '07-never-taken-a-dime', '08-ive-got-receipts', '09-two-hundred',
    'freeze-the-rent-block-party', 'this-city-belongs-to-you-after-hours',
    'shouldnt-be-this-hard-soul-court'
  ];
  const audio = document.createElement('audio');
  audio.id = 'game-music';
  audio.preload = 'none';
  audio.volume = 0.45;
  document.body.appendChild(audio);
  let enabled = false, paused = false, bag = [], current = null;
  const failed = new Set();
  function next() {
    if (!bag.length) {
      bag = tracks.filter(track => !failed.has(track));
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.length > 1 && bag[bag.length - 1] === current) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
    }
    current = bag.pop();
    if (current) audio.src = `https://politicalarcades.com/horse/assets/music/${current}.mp3`;
    return Boolean(current);
  }
  function sync() {
    if (!enabled || paused || document.hidden) { audio.pause(); return; }
    if (!current && !next()) return;
    if (audio.paused) audio.play().catch(() => {});
  }
  audio.addEventListener('ended', () => { if (next()) sync(); });
  audio.addEventListener('error', () => {
    if (!current) return;
    failed.add(current);
    bag = bag.filter(track => !failed.has(track));
    if (next()) sync();
  });
  document.addEventListener('visibilitychange', sync);
  window.VoteMusic = { get enabled() { return enabled; }, get paused() { return paused || document.hidden; }, setState(on, stopped) { enabled = on; paused = stopped; sync(); } };
  if (document.currentScript?.hasAttribute('data-controls')) {
    const bar = document.createElement('div');
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Arcade soundtrack');
    bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px 0;position:relative;z-index:2';
    const toggle = document.createElement('button');
    const skip = document.createElement('button');
    for (const button of [toggle, skip]) {
      button.type = 'button';
      button.style.cssText = 'font:600 14px system-ui;min-height:44px;padding:10px 16px;border:1px solid #cbb886;border-radius:6px;background:#171b25;color:#fff;cursor:pointer';
      bar.appendChild(button);
    }
    function label() { toggle.textContent = enabled ? 'Music on · Mute' : 'Music off · Enable'; toggle.setAttribute('aria-pressed', String(enabled)); }
    label(); skip.textContent = 'Next song'; skip.setAttribute('aria-label', 'Play next song');
    toggle.addEventListener('click', () => { enabled = !enabled; label(); sync(); });
    skip.addEventListener('click', () => { enabled = true; label(); if (next()) sync(); });
    (document.querySelector('.topbar, .sign, header') || document.body).appendChild(bar);
    const panel = document.getElementById('pause-panel');
    if (panel) {
      const checkPause = () => { const value = !panel.hidden; if (paused !== value) { paused = value; sync(); } };
      new MutationObserver(checkPause).observe(panel, {attributes: true, attributeFilter:['hidden']});
      checkPause();
    }
  }
})();
