import { FIGHTERS } from './fighters.js?v=cast62';
import { makeEnemy } from './enemies.js?v=cast62';
import { loadSprites, ensureGrapplePair } from './sprites.js?v=load63';
import { loadEnvironment } from './render.js?v=load63';

export function sceneSprites(stage, fighterId, practiceEnemy = null) {
  const kinds = practiceEnemy ? [practiceEnemy] : stage.waves.flatMap(w => [
    ...w.group.map(e => e.kind), ...(w.support ? [w.support.kind] : [])
  ]);
  const sprites = new Set([FIGHTERS[fighterId].sprite]);
  for (const kind of kinds) {
    sprites.add(kind === 'greene' ? 'greene' : makeEnemy(kind, 0, 560).sprite);
    if (kind === 'pete' || kind === 'pete_ww') { sprites.add('pete'); sprites.add('pete_ww'); }
    if (kind === 'bovino') sprites.add('bovino_mini');
    if (kind === 'rogers') { sprites.add('rogers_vacation'); sprites.add('rogers_tropical'); }
  }
  return [...sprites];
}

// Foreground play joins the work already started by the menu or previous stage.
// A completed record makes the handoff synchronous: no one-frame loading flash.
export function createSceneAssetCache(load) {
  const records = new Map();
  return (stage, fighterId, practiceEnemy = null) => {
    const key = JSON.stringify([stage.stageKey, stage.id, fighterId, practiceEnemy]);
    if (!records.has(key)) {
      const record = { ready: false, done: 0, total: 0, promise: null };
      records.set(key, record);
      record.promise = load(stage, fighterId, practiceEnemy, (done, total) => {
        record.done = done; record.total = total;
      }).then(() => { record.ready = true; }).catch(error => {
        records.delete(key);
        throw error;
      });
    }
    return records.get(key);
  };
}

export const requestSceneAssets = createSceneAssetCache((stage, fighterId, practiceEnemy, onProgress) => {
  const sprites = sceneSprites(stage, fighterId, practiceEnemy);
  const hero = { team: 'player', fighter: FIGHTERS[fighterId] };
  return Promise.all([
    loadEnvironment(stage),
    loadSprites({ sprites, onProgress }),
    ...sprites.slice(1).map(sprite => ensureGrapplePair(hero, { sprite }))
  ]);
});

