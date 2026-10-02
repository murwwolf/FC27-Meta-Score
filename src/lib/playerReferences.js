export const FAVOURITES_STORAGE_KEY = "fc27-meta-score:favourites";
export const RECENT_STORAGE_KEY = "fc27-meta-score:recently-viewed";
export const RECENT_PLAYER_LIMIT = 8;

const getValidIdMap = (players) => new Map(
  players
    .filter((player) => player.id !== null && player.id !== undefined && String(player.id) !== "")
    .map((player) => [String(player.id), player.id])
);

export function readPlayerReferences(key, players, limit = Infinity) {
  const validIds = getValidIdMap(players);

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set();
    const ids = [];
    for (const value of parsed) {
      if (value === null || value === undefined || !["string", "number"].includes(typeof value)) continue;
      const idKey = String(value);
      if (!validIds.has(idKey) || seen.has(idKey)) continue;
      seen.add(idKey);
      ids.push(validIds.get(idKey));
      if (ids.length >= limit) break;
    }
    return ids;
  } catch {
    return [];
  }
}

export function writePlayerReferences(key, ids) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage may be unavailable or full; in-memory interactions remain usable.
  }
}

export function resolvePlayerReferences(ids, players, limit = Infinity) {
  const playersById = new Map(players.map((player) => [String(player.id), player]));
  const seen = new Set();
  const resolved = [];

  for (const id of ids) {
    const idKey = String(id);
    const player = playersById.get(idKey);
    if (!player || seen.has(idKey)) continue;
    seen.add(idKey);
    resolved.push(player);
    if (resolved.length >= limit) break;
  }
  return resolved;
}
