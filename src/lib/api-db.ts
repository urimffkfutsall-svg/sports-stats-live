// Drop-in replacement for supabase-db.ts using MongoDB API + Vercel Blob
// Same exports, same signatures.

const API_BASE = "/api";

// ---------- HTTP helpers ----------
function getAuthHeader(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(API_BASE + path, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function apiPost<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

async function apiPut<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`PUT ${path} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await fetch(API_BASE + path, { method: "DELETE", headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(`DELETE ${path} -> ${res.status}`);
  return res.json();
}

// ---------- fetchAllData ----------
export async function fetchAllData() {
  return apiGet("/all-data");
}

// ---------- Generic CRUD factory ----------
function makeCrud(collection: string) {
  return {
    getAll: () => apiGet(`/${collection}`),
    add: (data: any) => apiPost(`/${collection}`, data),
    update: (id: string, data: any) => apiPut(`/${collection}/${id}`, data),
    delete: (id: string) => apiDelete(`/${collection}/${id}`),
    upsert: (data: any) => apiPost(`/${collection}?upsert=true`, data),
    remove: (id: string) => apiDelete(`/${collection}/${id}`),
  };
}

// ---------- Domain CRUDs ----------
const seasonsCrud = makeCrud("seasons");
export const dbSeasons = {
  add: seasonsCrud.add,
  update: seasonsCrud.update,
  delete: seasonsCrud.delete,
  deactivateAll: () => apiPost("/seasons/deactivate-all"),
};

export const dbCompetitions = {
  add: makeCrud("competitions").add,
  update: makeCrud("competitions").update,
  delete: makeCrud("competitions").delete,
};

export const dbTeams = {
  add: makeCrud("teams").add,
  update: makeCrud("teams").update,
  delete: makeCrud("teams").delete,
};

export const dbPlayers = {
  add: makeCrud("players").add,
  update: makeCrud("players").update,
  delete: makeCrud("players").delete,
};

export const dbMatches = {
  add: makeCrud("matches").add,
  update: makeCrud("matches").update,
  delete: makeCrud("matches").delete,
};

export const dbGoals = {
  add: makeCrud("goals").add,
  delete: makeCrud("goals").delete,
};

export const dbScorers = makeCrud("scorers");
export const dbPlayerOfWeek = makeCrud("player_of_week");
export const dbUsers = makeCrud("users");
export const dbDecisions = makeCrud("decisions");

export const dbSettings = {
  update: (settings: { appName?: string; logo?: string; contact?: string }) =>
    apiPost("/settings", settings),
};

// ---------- Generic getAll/upsert/remove for "managed" collections ----------
export const dbVideos = makeCrud("videos");
export const dbNews = makeCrud("news");
export const dbNationalPlayers = makeCrud("national_team_players");
export const dbNationalMatches = makeCrud("national_team_matches");
export const dbNationalStaff = makeCrud("national_staff");
export const dbNtCompetitions = makeCrud("nt_competitions");
export const dbNtGroups = makeCrud("nt_groups");
export const dbNtGroupTeams = makeCrud("nt_group_teams");
export const dbNtGroupMatches = makeCrud("nt_group_matches");
export const dbNtActivities = makeCrud("nt_activities");
export const dbFfkMoments = makeCrud("ffk_moments");
export const dbLiveStreams = makeCrud("live_streams");
export const dbPlayoffSeries = makeCrud("playoff_series");
export const dbPlayoffMatches = makeCrud("playoff_matches");

// ---------- Visitors (special: track / getAll / getStats) ----------
export const dbVisitors = {
  track: async (info: { ip?: string; city?: string; region?: string; country?: string; userAgent?: string }) => {
    try { return await apiPost("/visitors/track", info); } catch { return null; }
  },
  getAll: () => apiGet("/visitors"),
  getStats: () => apiGet("/visitors/stats"),
};

// ---------- File uploads (Vercel Blob via /api/upload) ----------
export async function uploadFile(folder: string, file: File, filename: string): Promise<string> {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const finalName = `${safe}-${Date.now()}.${ext}`;
  const url = `${API_BASE}/upload?folder=${encodeURIComponent(folder)}&filename=${encodeURIComponent(finalName)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream", ...getAuthHeader() },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  // Cache buster (matches old supabase behavior with ?t=...)
  return `${data.url}?t=${Date.now()}`;
}

export async function uploadTeamLogo(file: File, teamId: string): Promise<string> {
  return uploadFile("team-logos", file, teamId);
}

export async function uploadPlayerPhoto(file: File, playerId: string): Promise<string> {
  return uploadFile("player-photos", file, playerId);
}

// ---------- Realtime substitute via polling /api/changes ----------
type ChangeListener = () => void;
const tableListeners: Map<string, Set<ChangeListener>> = new Map();
let lastChanges: Record<string, string> = {};
let pollingStarted = false;
let pollingTimer: any = null;

function startPolling() {
  if (pollingStarted) return;
  pollingStarted = true;
  const tick = async () => {
    try {
      const changes: Record<string, string> = await apiGet("/changes");
      for (const [coll, updatedAt] of Object.entries(changes)) {
        if (lastChanges[coll] && lastChanges[coll] !== updatedAt) {
          const subs = tableListeners.get(coll);
          if (subs) subs.forEach((cb) => { try { cb(); } catch (e) { console.error(e); } });
        }
        lastChanges[coll] = updatedAt;
      }
    } catch (e) {
      // Silent fail - try again next tick
    }
  };
  // Initialize lastChanges first, then start polling
  tick().finally(() => { pollingTimer = setInterval(tick, 8000); });
}

function subscribeToTableInternal(table: string, callback: ChangeListener) {
  if (!tableListeners.has(table)) tableListeners.set(table, new Set());
  tableListeners.get(table)!.add(callback);
  startPolling();
  return {
    unsubscribe: () => {
      tableListeners.get(table)?.delete(callback);
    },
  };
}

// Old supabase signatures returned a "channel" object
export function subscribeToMatches(callback: () => void) {
  return subscribeToTableInternal("matches", callback);
}

export function subscribeToGoals(callback: () => void) {
  return subscribeToTableInternal("goals", callback);
}

export function subscribeToTable(table: string, callback: () => void) {
  return subscribeToTableInternal(table, callback);
}

// ---------- Broadcast / notifications ----------
// Old supabase had a broadcast channel for cross-tab events.
// We implement with localStorage events + custom browser events.
const NOTIF_KEY = "ffk_notification_event";

export function getNotificationChannel() {
  return {
    send: (event: string, payload: any) => broadcastNotification(event, payload),
    on: (event: string, callback: (payload: any) => void) => onNotification(event, callback),
  };
}

export function broadcastNotification(event: string, payload: any) {
  if (typeof window === "undefined") return;
  const data = JSON.stringify({ event, payload, ts: Date.now() });
  // Trigger storage event in OTHER tabs
  localStorage.setItem(NOTIF_KEY, data);
  // Trigger in CURRENT tab via custom event
  window.dispatchEvent(new CustomEvent("ffk-notification", { detail: { event, payload } }));
}

export function onNotification(event: string, callback: (payload: any) => void) {
  if (typeof window === "undefined") return () => {};
  const storageHandler = (e: StorageEvent) => {
    if (e.key !== NOTIF_KEY || !e.newValue) return;
    try {
      const data = JSON.parse(e.newValue);
      if (data.event === event) callback(data.payload);
    } catch {}
  };
  const customHandler = (e: any) => {
    if (e.detail?.event === event) callback(e.detail.payload);
  };
  window.addEventListener("storage", storageHandler);
  window.addEventListener("ffk-notification", customHandler as any);
  return () => {
    window.removeEventListener("storage", storageHandler);
    window.removeEventListener("ffk-notification", customHandler as any);
  };
}

// ---------- Auth helpers (used by AuthContext) ----------
export async function loginUser(email: string, password: string) {
  const data = await apiPost("/auth/login", { email, password });
  if (data?.token) localStorage.setItem("auth_token", data.token);
  return data;
}

export function logoutUser() {
  localStorage.removeItem("auth_token");
}

export async function getCurrentUser() {
  try {
    const data = await apiGet("/auth/me");
    return data?.user ?? null;
  } catch { return null; }
}