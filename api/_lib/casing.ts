const snakeMap: Record<string, string> = {
  startDate: "start_date", endDate: "end_date", isActive: "is_active",
  seasonId: "season_id", isActiveLanding: "is_active_landing",
  competitionId: "competition_id", foundedYear: "founded_year",
  teamId: "team_id", firstName: "first_name", lastName: "last_name",
  birthDate: "birth_date", homeTeamId: "home_team_id", awayTeamId: "away_team_id",
  homeScore: "home_score", awayScore: "away_score",
  isFeaturedLanding: "is_featured_landing", isFeatured: "is_featured",
  matchId: "match_id", groupId: "group_id", teamName: "team_name",
  teamLogo: "team_logo", isKosova: "is_kosova", opponentLogo: "opponent_logo",
  showOnHome: "show_on_home", sortOrder: "sort_order", streamUrl: "stream_url",
  isLive: "is_live", matchTitle: "match_title", thumbnailUrl: "thumbnail_url",
  expiresAt: "expires_at", team1Id: "team1_id", team2Id: "team2_id",
  team1Seed: "team1_seed", team2Seed: "team2_seed", winnerId: "winner_id",
  seriesId: "series_id", matchNumber: "match_number", playerId: "player_id",
  isOwnGoal: "is_own_goal", isManual: "is_manual", isScorer: "is_scorer",
  goalsCount: "goals_count", possessionHome: "possession_home",
  possessionAway: "possession_away", shotsHome: "shots_home", shotsAway: "shots_away",
  foulsHome: "fouls_home", foulsAway: "fouls_away", isHome: "is_home",
  liveUrl: "live_url", dayOfWeek: "day_of_week",
  videoUrl: "video_url", whatsappNumber: "whatsapp_number",
  isFeaturedSuperliga: "is_featured_superliga", isFeaturedLigaPare: "is_featured_liga_pare",
  passwordHash: "password_hash",
};

const camelMap: Record<string, string> = Object.fromEntries(
  Object.entries(snakeMap).map(([k, v]) => [v, k])
);

function autoSnake(s: string): string {
  return s.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
}
function autoCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toSnake(obj: any): any {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "_id") continue;
    const newKey = snakeMap[k] || (k.includes("_") ? k : autoSnake(k));
    out[newKey] = v;
  }
  return out;
}

export function toCamel(obj: any): any {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "_id") continue;
    const newKey = camelMap[k] || (/[A-Z]/.test(k) ? k : autoCamel(k));
    out[newKey] = v;
  }
  return out;
}

export function mapRows<T = any>(rows: any[]): T[] {
  return (rows || []).map(toCamel) as T[];
}
