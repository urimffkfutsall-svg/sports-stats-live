// ============================================================
// Skuadrat favorite (❤️) — ruhen lokalisht ne shfletuesin e
// tifozit (nuk kemi account system per tifozet, sic e kerkon
// specifikimi #25 "FAVORITES").
// ============================================================

const FAVORITES_KEY = 'ffk_favorite_teams';
export const FAVORITES_EVENT = 'ffk-favorites-changed';

export function getFavoriteTeamIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveFavoriteTeamIds(ids: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  } catch (e) {
    // localStorage mund te mos jete i disponueshem (p.sh. private mode) —
    // heshtazi injorojme, favoritet thjesht nuk do te ruhen.
  }
}

export function isFavoriteTeam(teamId: string): boolean {
  return getFavoriteTeamIds().includes(teamId);
}

export function toggleFavoriteTeam(teamId: string): boolean {
  const ids = getFavoriteTeamIds();
  const idx = ids.indexOf(teamId);
  let nowFavorite: boolean;
  if (idx === -1) {
    ids.push(teamId);
    nowFavorite = true;
  } else {
    ids.splice(idx, 1);
    nowFavorite = false;
  }
  saveFavoriteTeamIds(ids);
  return nowFavorite;
}
