/*
 * Ads to Aid · ad module for Capitol Crashers.
 *
 * This is the only file in /play/ that talks to Google (adsbygoogle / adBreak)
 * or to the Playgama Bridge SDK. Game code makes five calls and nothing else:
 *
 *   A2A.ads.init({ game, pause, resume, flags })
 *   A2A.ads.preroll(cb)
 *   A2A.ads.break(kind, resume)          kind: 'match_end' | 'pause'
 *   A2A.ads.reward(kind, onGranted, onDismissed)   kind: 'revive'
 *   A2A.ads.surface(name)                 -> { kind, src, href, label, sponsor, image }
 *
 * Config: window.A2A_ADS = { enabled: false, stub: true } (the default: dark).
 * Full contract and the rules for editing this file: play/ads/CONTRACT.md.
 */
(function () {
  "use strict";

  const DEFAULTS = {
    enabled: false,          // true once AdSense says Ready and Tony flips it
    stub: true,              // resolve everything instantly, grant rewards, house creatives
    bridge: true,            // load the Playgama Bridge SDK (mock platform locally)
    client: "ca-pub-4762698707947194",
    frequencyHint: "180s",   // data-ad-frequency-hint for adBreak 'next'
    test: false,             // data-adbreak-test="on" while testing live Google ads
    rewardLimits: { revive: 1 },
    surfaceRotate: 90,       // seconds between creatives on a surface
  };
  const GOOGLE_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  const BRIDGE_SRC = "https://bridge.playgama.com/v2/stable/playgama-bridge.js";
  const BRIDGE_TIMEOUT = 8000;
  const GOOGLE_TIMEOUT = 8000;
  const BREAK_WATCHDOG = 12000;

  const cfg = Object.assign({}, DEFAULTS, window.A2A_ADS || {});
  const here = (document.currentScript && document.currentScript.src) || location.href;
  const noop = function () {};

  const state = {
    game: "crashers",
    pause: noop,
    resume: noop,
    flags: {},
    network: "stub",        // 'stub' | 'google' | 'bridge'
    bridge: null,            // the initialised bridge object, or null
    bridgeReady: null,       // promise
    googleReady: null,       // promise<boolean>
    holding: false,          // pause() has been called and resume() has not
    busy: false,             // an ad call is in flight
    prerollDone: false,
    rewardsUsed: {},
    sponsors: [],
    sponsorsReady: null,
    surfaceCache: {},
    musicWas: null,
  };

  // ---- events -------------------------------------------------------------

  function emit(type, surface, outcome) {
    try {
      window.dispatchEvent(new CustomEvent("a2a:ad", { detail: { type: type, surface: surface, outcome: outcome } }));
    } catch (error) { /* never let telemetry break the game */ }
  }

  // ---- pause / mute around an ad -------------------------------------------

  // The site soundtrack (soundtrack.js) exposes window.VoteMusic; sound effects
  // check the same object, so pausing it silences the whole game.
  function mute() {
    const music = window.VoteMusic;
    if (!music || state.musicWas !== null) return;
    try { state.musicWas = !!music.paused; music.setState(music.enabled, true); } catch (error) { state.musicWas = null; }
  }
  function unmute() {
    const music = window.VoteMusic;
    if (!music || state.musicWas === null) return;
    try { music.setState(music.enabled, state.musicWas); } catch (error) { /* ignore */ }
    state.musicWas = null;
  }
  function hold() {
    if (state.holding) return;
    state.holding = true;
    mute();
    try { state.pause(); } catch (error) { console.error("[a2a-ads] pause() threw", error); }
  }
  function release() {
    if (!state.holding) return;
    state.holding = false;
    unmute();
    try { state.resume(); } catch (error) { console.error("[a2a-ads] resume() threw", error); }
  }

  function once(fn) {
    let done = false;
    return function () { if (done) return; done = true; return fn.apply(null, arguments); };
  }

  // ---- Playgama Bridge SDK --------------------------------------------------

  function loadBridge() {
    if (state.bridgeReady) return state.bridgeReady;
    state.bridgeReady = new Promise(function (resolve) {
      if (cfg.bridge === false) return resolve(null);
      const finish = once(resolve);
      const timer = setTimeout(function () { finish(null); }, BRIDGE_TIMEOUT);
      function initialise() {
        const bridge = window.bridge;
        if (!bridge || typeof bridge.initialize !== "function") return finish(null);
        bridge.initialize().then(function () {
          clearTimeout(timer);
          subscribeBridge(bridge);
          finish(bridge);
        }).catch(function (error) {
          console.warn("[a2a-ads] Bridge failed to initialise, using mock-free fallback", error);
          finish(null);
        });
      }
      if (window.bridge) return initialise();
      const script = document.createElement("script");
      script.src = BRIDGE_SRC;
      script.async = true;
      script.onload = initialise;
      script.onerror = function () { finish(null); };
      document.head.appendChild(script);
    });
    return state.bridgeReady;
  }

  function subscribeBridge(bridge) {
    const names = bridge.EVENT_NAME || {};
    const platform = bridge.platform;
    if (!platform || typeof platform.on !== "function") return;
    try {
      platform.on(names.PAUSE_STATE_CHANGED || "pause_state_changed", function (isPaused) {
        if (isPaused) hold(); else release();
      });
      platform.on(names.AUDIO_STATE_CHANGED || "audio_state_changed", function (isEnabled) {
        if (isEnabled) unmute(); else mute();
      });
    } catch (error) { /* older SDK without these events */ }
  }

  function bridgePlatformId() {
    try { return state.bridge && state.bridge.platform && state.bridge.platform.id; } catch (error) { return null; }
  }

  function sendBridgeMessage(name) {
    const bridge = state.bridge;
    if (!bridge) return;
    try { bridge.platform.sendMessage(name); } catch (error) { /* ignore */ }
  }

  function bridgeInterstitial(placement, done) {
    const bridge = state.bridge;
    const ads = bridge && bridge.advertisement;
    if (!ads || ads.isInterstitialSupported === false) return done("unsupported");
    const names = bridge.EVENT_NAME || {};
    const finish = once(function (outcome) { off(); release(); done(outcome); });
    const handler = function (adState) {
      if (adState === "opened") { clearTimeout(watchdog); hold(); }
      else if (adState === "closed") finish("viewed");
      else if (adState === "failed") finish("failed");
    };
    const off = function () { try { if (typeof ads.off === "function") ads.off(names.INTERSTITIAL_STATE_CHANGED, handler); } catch (error) { /* ignore */ } };
    let watchdog = setTimeout(function () { finish("skipped"); }, 4000);
    try {
      ads.on(names.INTERSTITIAL_STATE_CHANGED || "interstitial_state_changed", handler);
      ads.showInterstitial(placement);
    } catch (error) { finish("failed"); }
  }

  function bridgeRewarded(placement, done) {
    const bridge = state.bridge;
    const ads = bridge && bridge.advertisement;
    if (!ads || ads.isRewardedSupported === false) return done(false, "unsupported");
    const names = bridge.EVENT_NAME || {};
    let granted = false;
    const finish = once(function (outcome) { off(); release(); done(granted, outcome); });
    const handler = function (adState) {
      if (adState === "opened") { clearTimeout(watchdog); hold(); }
      else if (adState === "rewarded") granted = true;        // the only state that grants
      else if (adState === "closed") finish(granted ? "viewed" : "dismissed");
      else if (adState === "failed") finish("failed");
    };
    const off = function () { try { if (typeof ads.off === "function") ads.off(names.REWARDED_STATE_CHANGED, handler); } catch (error) { /* ignore */ } };
    let watchdog = setTimeout(function () { finish("skipped"); }, 4000);
    try {
      ads.on(names.REWARDED_STATE_CHANGED || "rewarded_state_changed", handler);
      ads.showRewarded(placement);
    } catch (error) { finish("failed"); }
  }

  // ---- Google H5 Games Ads (adBreak) ---------------------------------------

  function loadGoogle() {
    if (state.googleReady) return state.googleReady;
    state.googleReady = new Promise(function (resolve) {
      const finish = once(resolve);
      const timer = setTimeout(function () { finish(false); }, GOOGLE_TIMEOUT);
      // The tag must live in the same document as the canvas, so it goes in this page's head.
      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = GOOGLE_SRC + "?client=" + encodeURIComponent(cfg.client);
      script.setAttribute("data-ad-frequency-hint", cfg.frequencyHint);
      if (cfg.test) script.setAttribute("data-adbreak-test", "on");
      script.onload = function () { clearTimeout(timer); finish(true); };
      script.onerror = function () { clearTimeout(timer); finish(false); };
      document.head.appendChild(script);
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({ preloadAdBreaks: "on", sound: "on" }); // adConfig
    });
    return state.googleReady;
  }

  function adBreak(options) {
    (window.adsbygoogle = window.adsbygoogle || []).push(options);
  }

  function googleBreak(type, name, done) {
    const finish = once(function (outcome) { clearTimeout(watchdog); release(); done(outcome); });
    const watchdog = setTimeout(function () { finish("timeout"); }, BREAK_WATCHDOG);
    adBreak({
      type: type,
      name: name,
      beforeAd: function () { clearTimeout(watchdog); hold(); },
      afterAd: function () { release(); },
      adBreakDone: function (info) { finish((info && info.breakStatus) || "done"); },
    });
  }

  function googleReward(name, done) {
    let granted = false;
    const finish = once(function (outcome) { clearTimeout(watchdog); release(); done(granted, outcome); });
    const watchdog = setTimeout(function () { finish("timeout"); }, BREAK_WATCHDOG);
    adBreak({
      type: "reward",
      name: name,
      beforeAd: function () { clearTimeout(watchdog); hold(); },
      afterAd: function () { release(); },
      beforeReward: function (showAdFn) { showAdFn(); },   // the player already pressed the button
      adViewed: function () { granted = true; },
      adDismissed: function () { granted = false; },
      adBreakDone: function (info) { finish((info && info.breakStatus) || "done"); },
    });
  }

  // ---- sponsors.json / surfaces --------------------------------------------

  function loadSponsors() {
    if (state.sponsorsReady) return state.sponsorsReady;
    state.sponsorsReady = fetch(new URL("sponsors.json", here).href, { cache: "no-cache" })
      .then(function (response) { return response.ok ? response.json() : []; })
      .then(function (rows) { state.sponsors = Array.isArray(rows) ? rows : (rows && rows.rows) || []; })
      .catch(function () { state.sponsors = []; });
    return state.sponsorsReady;
  }

  function activeRows(surface) {
    const now = Date.now();
    return state.sponsors.filter(function (row) {
      if (!row || row.surface !== surface || !row.src) return false;
      if (row.start && Date.parse(row.start) > now) return false;
      if (row.end && Date.parse(row.end) < now) return false;
      return true;
    });
  }

  function creative(row) {
    const src = new URL(row.src, here).href;
    const image = row.kind === "image" ? new Image() : null;
    if (image) { image.decoding = "async"; image.src = src; }
    return { kind: row.kind || "image", src: src, href: row.href || "", label: row.label || "", sponsor: row.sponsor || "", image: image };
  }

  // ---- the public API -------------------------------------------------------

  const api = {
    init: function (options) {
      options = options || {};
      state.game = options.game || state.game;
      state.pause = typeof options.pause === "function" ? options.pause : noop;
      state.resume = typeof options.resume === "function" ? options.resume : noop;
      state.flags = Object.assign({}, options.flags || {});
      if (state.flags.rewardLimits) cfg.rewardLimits = Object.assign({}, cfg.rewardLimits, state.flags.rewardLimits);
      loadSponsors();
      loadBridge().then(function (bridge) {
        state.bridge = bridge;
        const platformId = bridgePlatformId();
        if (bridge && platformId && platformId !== "mock") state.network = "bridge";
        else if (cfg.enabled && !cfg.stub) state.network = "google";
        else state.network = "stub";
        if (state.network === "google") loadGoogle();
        emit("init", platformId || "none", state.network);
      });
      return api;
    },

    // One per page load, before the title screen. Calls cb either way.
    preroll: function (cb) {
      cb = typeof cb === "function" ? cb : noop;
      const finish = once(function (outcome) {
        state.busy = false;
        emit("preroll", "page", outcome);
        cb();
        sendBridgeMessage("game_ready");   // the title is up and the player can interact
      });
      if (state.prerollDone) return finish("already");
      state.prerollDone = true;
      state.busy = true;
      loadBridge().then(function () {
        if (state.network === "google") {
          return loadGoogle().then(function (loaded) {
            if (!loaded) return finish("blocked");
            googleBreak("preroll", "crashers_preroll", finish);
          });
        }
        // Playgama shows its own preroll; stub resolves at once.
        finish(state.network === "bridge" ? "platform" : "stub");
      });
    },

    // 'match_end' at stage end, 'pause' when the pause menu opens. Calls resume either way.
    break: function (kind, resume) {
      resume = typeof resume === "function" ? resume : noop;
      const finish = once(function (outcome) { state.busy = false; emit("break", kind, outcome); resume(); });
      if (state.busy) return finish("busy");
      state.busy = true;
      if (state.network === "google") {
        loadGoogle().then(function (loaded) {
          if (!loaded) return finish("blocked");
          googleBreak(kind === "pause" ? "pause" : "next", "crashers_" + kind, finish);
        });
      } else if (state.network === "bridge") {
        if (kind === "pause") return finish("skipped");   // Bridge paces interstitials itself; match end is enough
        bridgeInterstitial(kind, finish);
      } else {
        finish("stub");
      }
    },

    // Player-initiated only. onGranted fires only when the network confirms the view.
    reward: function (kind, onGranted, onDismissed) {
      onGranted = typeof onGranted === "function" ? onGranted : noop;
      onDismissed = typeof onDismissed === "function" ? onDismissed : noop;
      const finish = once(function (granted, outcome) {
        state.busy = false;
        if (granted) state.rewardsUsed[kind] = (state.rewardsUsed[kind] || 0) + 1;
        emit("reward", kind, outcome);
        if (granted) onGranted(); else onDismissed();
      });
      const limit = cfg.rewardLimits[kind];
      if (limit != null && (state.rewardsUsed[kind] || 0) >= limit) return finish(false, "limit");
      if (state.busy) return finish(false, "busy");
      state.busy = true;
      if (state.network === "google") {
        loadGoogle().then(function (loaded) {
          if (!loaded) return finish(false, "blocked");
          googleReward("crashers_" + kind, finish);
        });
      } else if (state.network === "bridge") {
        bridgeRewarded(kind, finish);
      } else {
        finish(true, "stub");   // a rewarded button that does nothing is a policy violation
      }
    },

    // Synchronous. Returns the creative for a named in-world surface; the game draws it.
    surface: function (name) {
      const rows = activeRows(name);
      if (!rows.length) return { kind: "none", src: "", href: "", label: "", sponsor: "", image: null };
      const slot = Math.floor(Date.now() / 1000 / Math.max(1, cfg.surfaceRotate)) % rows.length;
      const row = rows[slot];
      const key = name + "|" + row.src;
      if (!state.surfaceCache[key]) {
        state.surfaceCache[key] = creative(row);
        emit("surface", name, row.sponsor || "house");
      }
      return state.surfaceCache[key];
    },
  };

  window.A2A = window.A2A || {};
  window.A2A.ads = api;
})();
