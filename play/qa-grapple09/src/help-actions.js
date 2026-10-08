// Profiles come from reviewed paired Makko clips, not generic attack timing.
const profiles = new Map();
export function registerHelpAction(sprite, kind, profile) {
  profiles.set(`${sprite}:${kind}`, profile);
}
export function helpAction(player, kind) {
  return profiles.get(`${player.fighter?.sprite || player.kind}:${kind}`);
}
export function helpWindow(player) {
  const action = player.helpAction;
  return action ? { startup: action.approach + action.contact, active: .1, total: action.approach + action.total } : { startup: .2, active: .1, total: .62 };
}
