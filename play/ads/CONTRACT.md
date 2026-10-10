# Ads to Aid · ad contract for Capitol Crashers

One module owns every ad call: `play/ads/a2a-ads.js`. It exposes `window.A2A.ads`.
Game code makes the five calls below and nothing else. **No file under `/play/` other
than `ads/a2a-ads.js` may reference `adsbygoogle`, `adBreak`, Google ad tags, Playgama,
or `window.bridge`.** If you need something from an ad network, add it to the module
and extend this file.

The module is dark by default. Nothing shows a real ad until Tony flips the flag in
`play/index.html`.

## The five calls

```js
A2A.ads.init({ game: "crashers", pause, resume, flags })   // once, in boot(), before anything else
A2A.ads.preroll(cb)                                          // once per page load, before the title screen; cb runs either way
A2A.ads.break("match_end" | "pause", resume)                 // resume runs either way, after the ad or at once
A2A.ads.reward("revive", onGranted, onDismissed)             // player-initiated only; exactly one of the two callbacks runs
A2A.ads.surface("billboard_1")                               // synchronous; returns a creative for the game to draw
```

`surface()` returns `{ kind: "image" | "video" | "none", src, href, label, sponsor, image }`.
`image` is an `HTMLImageElement` that may still be loading; draw it only when
`image.naturalWidth` is non-zero. `kind: "none"` means draw nothing.

### Where the game calls them (current call sites)

| Call | File | Moment |
|---|---|---|
| `init` | `play/src/main.js`, top of `boot()` | page load |
| `preroll` | `play/src/main.js`, `showTitle()` | after assets load, before `game.mode = "title"` |
| `break("match_end")` | `play/src/main.js`, `advance()` | stage cleared, before the next street or the ending |
| `break("pause")` | `play/src/main.js`, `setPaused(true, byPlayer)` | the player opens the pause menu (Esc, Pause button); never on blur or tab switch |
| `reward("revive")` | `play/src/main.js`, the `#revive` button | the Knocked down panel, once per session, not in practice |
| `surface("billboard_1")` | `play/src/render.js`, `drawShelterAd()` | the poster frame on the rally stage's bus shelter |

Every call site is a few lines with a comment that points here. Move them if the game
changes shape, but keep the moments: breaks only at natural stops, never mid-wave.

## What the game must keep providing

- **`pause()` and `resume()`** passed to `init`. The module calls `pause()` before an ad
  opens and `resume()` after it closes (`beforeAd` / `afterAd` for Google, the
  `PAUSE_STATE_CHANGED` event for Playgama). Today `pause()` sets `adHold` in `main.js`
  so the loop stops calling `updateGame`, and `resume()` clears it. Rename anything you
  like inside the game as long as the two functions still freeze and unfreeze play.
- **Sound** is muted by the module through the site soundtrack object `window.VoteMusic`
  (`soundtrack.js`), which the sound effects in `audio.js` also respect. If the music
  API changes, update `mute()` / `unmute()` in the module.
- **The frame line** around the preroll is the game's own UI: the `#ad-frame` card
  before the preroll and the `.ad-line` hint on the title card after it. The only
  allowed wording is "Ads pay for this arcade. Half the profit goes to community
  programs." AdSense policy forbids asking for views or clicks anywhere except on the
  rewarded button the player chooses.
- **The Revive button** states the ad and the reward ("Watch an ad to revive") and only
  appears when a run ends. A rewarded button that does nothing is a policy violation,
  so the stub grants the reward.

## Flags

Set in `play/index.html` before the module loads:

```html
<script>window.A2A_ADS = { enabled: false, stub: true };</script>
```

| Key | Default | Meaning |
|---|---|---|
| `enabled` | `false` | `true` once AdSense says Ready. With `stub: false`, loads the Google tag and routes preroll / next / pause / reward through `adBreak()`. |
| `stub` | `true` | Every call resolves at once, rewards are granted, surfaces return house creatives, no ad-network script is loaded. |
| `bridge` | `true` | Load the Playgama Bridge SDK from the Playgama CDN and call `bridge.initialize()`. Locally this is the mock platform; on Playgama ads route through the Bridge instead of Google. `false` skips the SDK. |
| `google` | `true` | `false` never loads the Google tag whatever `enabled` and `stub` say. The Playgama build sets this. |
| `client` | `ca-pub-4762698707947194` | AdSense publisher id. |
| `frequencyHint` | `"180s"` | `data-ad-frequency-hint` on the Google tag; paces `next` breaks. |
| `test` | `false` | Adds `data-adbreak-test="on"` for testing live Google ads. |
| `rewardLimits` | `{ revive: 1 }` | Grants per session per reward kind. |
| `surfaceRotate` | `90` | Seconds between creatives on a surface with several rows. |

The `flags` object passed to `init` is reserved for per-game overrides; `flags.rewardLimits` merges into the limits above.

Mode is picked once at init: on a real Playgama platform (Bridge `platform.id` other than
`mock`) → Playgama; else `enabled && !stub` → Google; else stub.

## Events

The module dispatches `a2a:ad` `CustomEvent`s on `window` with
`detail = { type, surface, outcome }`:

- `type`: `init`, `preroll`, `break`, `reward`, `surface`
- `surface`: `page`, `match_end`, `pause`, `revive`, `billboard_1`, or the platform id for `init`
- `outcome`: `stub`, `viewed`, `dismissed`, `failed`, `blocked`, `timeout`, `busy`, `limit`, `skipped`, `platform`, or Google's `breakStatus`

Analytics and the ledger's impression count listen here; the module never calls GA itself.

## Adding a sponsor

Edit `play/ads/sponsors.json`. One row per creative:

```json
{ "surface": "billboard_1", "kind": "image", "src": "house/ads-to-aid-poster.svg",
  "href": "https://adstoaid.com/", "label": "Ads to Aid", "sponsor": "house",
  "start": "", "end": "" }
```

- `surface`: a name the game asks for. Today only `billboard_1` (the bus shelter poster, portrait, about 1:3.3).
- `kind`: `image` for now. `src` is relative to `play/ads/`.
- `start` / `end`: ISO dates, empty for always.
- Several rows on one surface rotate every `surfaceRotate` seconds.

No game code changes. House creatives live in `play/ads/house/`.

## Surfaces that are off limits

Never on the candidates, the villains, protest signs, the witness or the neighbors,
and nothing on the Capitol approach. In-world surfaces are for sponsor, house and
Playgama/Anzu intrinsic creatives only; Google creatives can never be drawn into the
canvas.

## Saves

Playgama wants progress in Bridge storage, never `localStorage`, loaded and saved in one
array-keyed call. The module exposes:

```js
A2A.saves.load()       // Promise<{ score, helped, fighter, stage, runs }>, defaults when empty
A2A.saves.save(obj)    // Promise; one bridge.storage.set(keys, values) call
```

Keys are `cc_score`, `cc_helped`, `cc_fighter`, `cc_stage`, `cc_runs`. The module falls back
to `localStorage` only when the Bridge is missing or its storage rejects, which never happens
on Playgama. The game (`play/src/main.js`, the `saved` object in `boot()`) loads once at boot,
saves when the furthest street or the fighter changes and once per run at Knocked down or
the ending, and offers "Continue · <street>" on the fighter card when a later street has been
reached. Reloading restores the fighter, the best score line and the Continue button.

## Playgama build

```
npm run build:playgama          # or: node tools/build-playgama.mjs [--music <dir>]
```

Writes `dist/playgama/` and `dist/capitol-crashers-playgama.zip` with `index.html` at the
archive root and every asset copied inside: sprites, environment and story art, the two
story clips, the house creatives, and the soundtrack when a music folder is found next to
this repo (`../political-arcades/horse/assets/music`). The build rewrites the `../` paths,
drops the Patreon, comic, footer and privacy links, sets `A2A_ADS` to
`{ enabled: false, stub: true, google: false, build: "playgama" }`, skips the optional
parallax loads, and fails if any file name is not Latin, any resource other than the Bridge
is external, any analytics or AdSense tag is present, or the archive passes 300 MB. `dist/`
is ignored by git. Uploading the zip is a separate step through Tony's Playgama account.

## Playgama

The module loads Bridge SDK JS Core (v2 stable, 2.3.0 at the time of writing) from
`https://bridge.playgama.com/v2/stable/playgama-bridge.js`, awaits `bridge.initialize()`,
subscribes to `PAUSE_STATE_CHANGED` and `AUDIO_STATE_CHANGED`, sends
`in_game_loading_started` at init and `in_game_loading_stopped` after the preroll, and sends
`platform.sendMessage("game_ready")` two animation frames later, once the title has been drawn.
Its config is `play/playgama-bridge-config.json` (must sit next to `index.html`).
On Playgama, `break("match_end")` is `showInterstitial("match_end")`, `reward("revive")`
is `showRewarded("revive")` granted only on the `rewarded` state, and `break("pause")`
is skipped because the Bridge paces interstitials itself. Publishing to Playgama is a
separate step and is not done from this repo.
