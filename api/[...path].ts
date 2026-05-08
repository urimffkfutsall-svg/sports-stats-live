import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { put } from "@vercel/blob";
import { getDb } from "./_lib/mongo";
import { toSnake, toCamel, mapRows } from "./_lib/casing";
import { signToken, getAuthFromReq } from "./_lib/auth";

const COLLECTIONS = new Set([
  "seasons","competitions","teams","players","matches","goals","scorers",
  "player_of_week","users","app_settings","decisions","national_team_players",
  "national_team_matches","videos","news","visitors","national_players",
  "national_matches","national_staff","nt_competitions","nt_groups",
  "nt_group_teams","nt_group_matches","nt_activities","ffk_moments",
  "live_streams","playoff_series","playoff_matches"
]);

const ORDER_BY: Record<string, [string, 1 | -1]> = {
  seasons: ["created_at", -1], competitions: ["created_at", 1],
  teams: ["name", 1], players: ["last_name", 1],
  matches: ["created_at", 1], goals: ["minute", 1],
  scorers: ["goals", -1], player_of_week: ["week", -1],
  decisions: ["week", -1], national_team_players: ["last_name", 1],
  national_team_matches: ["date", -1], videos: ["created_at", -1],
  news: ["created_at", -1], visitors: ["visited_at", -1],
  national_players: ["number", 1], national_matches: ["date", -1],
  national_staff: ["name", 1], nt_competitions: ["year", -1],
  nt_groups: ["name", 1], nt_group_teams: ["team_name", 1],
  nt_group_matches: ["date", 1], nt_activities: ["created_at", -1],
  ffk_moments: ["sort_order", 1], live_streams: ["created_at", -1],
  playoff_series: ["created_at", 1], playoff_matches: ["match_number", 1],
};

async function touchChange(coll: string) {
  const db = await getDb();
  await db.collection("_changes").updateOne(
    { collection: coll },
    { $set: { collection: coll, updated_at: new Date().toISOString() } },
    { upsert: true }
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    let segs: string[] = [];
    if (Array.isArray(req.query.path)) segs = req.query.path as string[];
    else if (typeof req.query.path === "string") segs = (req.query.path as string).split("/").filter(Boolean);
    else {
      const u = (req.url || "").split("?")[0].replace(/^\/api\/?/, "");
      segs = u.split("/").filter(Boolean);
    }
    const [a, b] = segs;

    if (a === "auth" && b === "login" && req.method === "POST") return handleLogin(req, res);
    if (a === "auth" && b === "me" && req.method === "GET") return res.json({ user: getAuthFromReq(req) });
    if (a === "all-data" && req.method === "GET") return handleAllData(req, res);
    if (a === "changes" && req.method === "GET") return handleChanges(req, res);
    if (a === "upload" && req.method === "POST") return handleUpload(req, res);
    if (a === "visitors" && b === "track" && req.method === "POST") return handleTrackVisitor(req, res);
    if (a === "visitors" && b === "stats" && req.method === "GET") return handleVisitorStats(req, res);
    if (a === "seasons" && b === "deactivate-all" && req.method === "POST") return handleDeactivateSeasons(req, res);
    if (a === "settings" && req.method === "POST") return handleUpsertSettings(req, res);

    if (a && COLLECTIONS.has(a)) {
      if (!b) {
        if (req.method === "GET") return handleList(a, req, res);
        if (req.method === "POST") return handleInsert(a, req, res);
      } else {
        if (req.method === "GET") return handleGetOne(a, b, req, res);
        if (req.method === "PUT") return handleUpdate(a, b, req, res);
        if (req.method === "DELETE") return handleDelete(a, b, req, res);
      }
    }

    return res.status(404).json({ error: "Not found", path: segs });
  } catch (err: any) {
    console.error("API error:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function handleList(coll: string, req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const limit = parseInt((req.query.limit as string) || "0") || 0;
  const ord = ORDER_BY[coll];
  let cursor = db.collection(coll).find({}, { projection: { _id: 0 } });
  if (ord) cursor = cursor.sort({ [ord[0]]: ord[1] });
  if (limit) cursor = cursor.limit(limit);
  const rows = await cursor.toArray();
  return res.json(rows.map(toCamel));
}

async function handleGetOne(coll: string, id: string, _req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const doc = await db.collection(coll).findOne({ id }, { projection: { _id: 0 } });
  if (!doc) return res.status(404).json({ error: "Not found" });
  return res.json(toCamel(doc));
}

async function handleInsert(coll: string, req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const isUpsert = req.query.upsert === "true";
  const data = toSnake(req.body || {});
  if (!data.id) data.id = randomUUID();
  data.updated_at = new Date().toISOString();

  if (coll === "users" && data.password && !data.password_hash) {
    data.password_hash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }

  if (isUpsert) {
    await db.collection(coll).updateOne(
      { id: data.id },
      { $set: data, $setOnInsert: { created_at: new Date().toISOString() } },
      { upsert: true }
    );
  } else {
    if (!data.created_at) data.created_at = new Date().toISOString();
    await db.collection(coll).insertOne(data);
  }

  await touchChange(coll);
  const doc = await db.collection(coll).findOne({ id: data.id }, { projection: { _id: 0 } });
  return res.json(toCamel(doc));
}

async function handleUpdate(coll: string, id: string, req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const data = toSnake(req.body || {});
  delete data.id;
  data.updated_at = new Date().toISOString();

  if (coll === "users" && data.password) {
    data.password_hash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }

  await db.collection(coll).updateOne({ id }, { $set: data });
  await touchChange(coll);
  return res.json({ ok: true });
}

async function handleDelete(coll: string, id: string, _req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  await db.collection(coll).deleteOne({ id });
  await touchChange(coll);
  return res.json({ ok: true });
}

async function handleAllData(_req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const fetch = (c: string, sortField?: string, sortDir: 1|-1 = 1) =>
    sortField
      ? db.collection(c).find({}, { projection: { _id: 0 } }).sort({ [sortField]: sortDir }).toArray()
      : db.collection(c).find({}, { projection: { _id: 0 } }).toArray();

  const [seasons, competitions, teams, players, matches, goals, scorers, pow,
         users, settings, decisions, nationalPlayers, nationalMatches] = await Promise.all([
    fetch("seasons", "created_at", -1),
    fetch("competitions", "created_at", 1),
    fetch("teams", "name", 1),
    fetch("players", "last_name", 1),
    fetch("matches", "created_at", 1),
    fetch("goals", "minute", 1),
    fetch("scorers", "goals", -1),
    fetch("player_of_week", "week", -1),
    fetch("users"),
    fetch("app_settings"),
    fetch("decisions", "week", -1),
    fetch("national_team_players", "last_name", 1),
    fetch("national_team_matches", "date", -1),
  ]);

  const settingsObj: any = {
    appName: "FFK Futsall",
    logo: "https://d64gsuwffb70l.cloudfront.net/69b1c5d3aa33715dda5ad3a9_1773258315744_b173e8af.png",
    contact: "info@ffk-futsall.com",
  };
  for (const s of settings) {
    if (s.key === "appName") settingsObj.appName = s.value;
    if (s.key === "logo") settingsObj.logo = s.value;
    if (s.key === "contact") settingsObj.contact = s.value;
  }

  return res.json({
    seasons: mapRows(seasons), competitions: mapRows(competitions),
    teams: mapRows(teams), players: mapRows(players),
    matches: mapRows(matches), goals: mapRows(goals),
    scorers: mapRows(scorers), playersOfWeek: mapRows(pow),
    users: mapRows(users).map((u: any) => { delete u.passwordHash; delete u.password; return u; }),
    decisions: mapRows(decisions), settings: settingsObj,
    nationalPlayers: mapRows(nationalPlayers),
    nationalMatches: mapRows(nationalMatches),
  });
}

async function handleChanges(_req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const changes = await db.collection("_changes").find({}, { projection: { _id: 0 } }).toArray();
  const result: Record<string, string> = {};
  for (const c of changes) result[c.collection] = c.updated_at;
  return res.json(result);
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
  const db = await getDb();
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  let valid = false;
  if (user.password_hash) {
    valid = await bcrypt.compare(password, user.password_hash);
  } else if (user.password) {
    valid = user.password === password;
    if (valid) {
      const hash = await bcrypt.hash(password, 10);
      await db.collection("users").updateOne(
        { id: user.id },
        { $set: { password_hash: hash }, $unset: { password: "" } }
      );
    }
  }
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const safe: any = toCamel(user);
  delete safe.password; delete safe.passwordHash;
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.json({ token, user: safe });
}

async function handleUpload(req: VercelRequest, res: VercelResponse) {
  const folder = (req.query.folder as string) || "misc";
  const filename = (req.query.filename as string) || ("file-" + Date.now());
  const allowed = ["team-logos", "player-photos", "news-photos", "misc"];
  if (!allowed.includes(folder)) return res.status(400).json({ error: "Invalid folder" });

  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(chunk as Buffer);
  const body = Buffer.concat(chunks);

  const blob = await put(folder + "/" + filename, body, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
    contentType: req.headers["content-type"] as string,
  });
  return res.json({ url: blob.url });
}

async function handleTrackVisitor(req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const { ip, city, region, country, userAgent } = req.body || {};
  await db.collection("visitors").insertOne({
    id: randomUUID(),
    ip: ip || "unknown",
    city: city || "unknown",
    region: region || "",
    country: country || "",
    visited_at: new Date().toISOString(),
    user_agent: (userAgent || "").substring(0, 200),
    created_at: new Date().toISOString(),
  });
  return res.json({ ok: true });
}

async function handleVisitorStats(_req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const all = await db.collection("visitors").find({}, { projection: { _id: 0 } })
    .sort({ visited_at: -1 }).toArray();
  const today = new Date().toISOString().split("T")[0];
  const todayVisitors = all.filter((v: any) => v.visited_at && v.visited_at.startsWith(today));
  const uniqueIPs = new Set(all.map((v: any) => v.ip));
  const uniqueToday = new Set(todayVisitors.map((v: any) => v.ip));
  return res.json({
    total: all.length,
    unique: uniqueIPs.size,
    today: todayVisitors.length,
    uniqueToday: uniqueToday.size,
    recent: all.slice(0, 50).map(toCamel),
  });
}

async function handleDeactivateSeasons(_req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  await db.collection("seasons").updateMany({ is_active: true }, { $set: { is_active: false } });
  await touchChange("seasons");
  return res.json({ ok: true });
}

async function handleUpsertSettings(req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const { appName, logo, contact } = req.body || {};
  const entries = [
    { key: "appName", value: appName },
    { key: "logo", value: logo },
    { key: "contact", value: contact },
  ];
  for (const e of entries) {
    if (e.value === undefined) continue;
    await db.collection("app_settings").updateOne(
      { key: e.key },
      { $set: { key: e.key, value: e.value, updated_at: new Date().toISOString() } },
      { upsert: true }
    );
  }
  await touchChange("app_settings");
  return res.json({ ok: true });
}
