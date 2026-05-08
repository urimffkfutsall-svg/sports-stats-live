import dns from "dns";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { MongoClient, Db } from "mongodb";

if (process.env.NODE_ENV !== "production") {
  try { dns.setServers(["1.1.1.1", "8.8.8.8"]); } catch {}

  if (!process.env.MONGODB_URI) {
    const cwd = process.cwd();
    const tried: string[] = [];
    let dir = cwd;
    let found: string | null = null;
    for (let i = 0; i < 12; i++) {
      const candidate = path.join(dir, ".env.local");
      tried.push(candidate);
      if (fs.existsSync(candidate)) { found = candidate; break; }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    if (found) {
      dotenv.config({ path: found });
      console.log("[mongo.ts] Loaded env from:", found);
    } else {
      console.error("[mongo.ts] .env.local NUK u gjet. cwd:", cwd, "Tried:", tried);
    }
  }
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "sportsstats";
  if (!uri) throw new Error("MONGODB_URI not set (cwd: " + process.cwd() + ")");
  cachedClient = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await cachedClient.connect();
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}