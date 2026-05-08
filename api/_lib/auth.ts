import jwt from "jsonwebtoken";
import type { VercelRequest } from "@vercel/node";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(payload: any, expiresIn: string = "7d"): string {
  return jwt.sign(payload, SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): any {
  try { return jwt.verify(token, SECRET); } catch { return null; }
}

export function getAuthFromReq(req: VercelRequest): any | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return verifyToken(auth.slice(7));
}
