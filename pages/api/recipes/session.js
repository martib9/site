import { createHash } from "node:crypto";
import {
  authConfigured,
  authenticated,
  equal,
  sameOrigin,
  sessionCookie,
} from "../../../lib/recipes/auth";
import { configured, rateLimit } from "../../../lib/recipes/db";
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method === "GET")
    return res.json({
      authenticated: authenticated(req),
      configured: authConfigured() && configured(),
      agent: Boolean(process.env.OPENAI_API_KEY),
    });
  if (!["POST", "DELETE"].includes(req.method)) return res.status(405).end();
  if (!sameOrigin(req)) return res.status(403).end();
  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", sessionCookie(true));
    return res.json({ ok: true });
  }
  if (!authConfigured() || !configured())
    return res
      .status(503)
      .json({ error: "Private household access is awaiting setup." });
  try {
    const ip = process.env.VERCEL
      ? req.headers["x-vercel-forwarded-for"] || "unknown"
      : req.socket.remoteAddress;
    const key = createHash("sha256").update(String(ip)).digest("hex");
    if (!(await rateLimit(`login:${key}`, 10, 900000)))
      return res
        .status(429)
        .json({ error: "Too many attempts. Try again in 15 minutes." });
    if (!equal(req.body?.password, process.env.RECIPES_PASSWORD))
      return res.status(401).json({ error: "That password does not match." });
    res.setHeader("Set-Cookie", sessionCookie());
    return res.json({ ok: true });
  } catch (error) {
    // Log only a safe category and PostgreSQL/Node error code, never connection details.
    const message = String(error?.message || '');
    const category = /quota|compute time|usage limit|exceeded/i.test(message) ? 'provider_quota' : /password authentication|authentication failed/i.test(message) ? 'database_authentication' : /timeout|timed out/i.test(message) ? 'connection_timeout' : 'database_error';
    const code = typeof error?.code === 'string' && /^[A-Z0-9_]{1,24}$/.test(error.code) ? error.code : 'unknown';
    console.error('Recipe login database failure', { category, code });
    return res
      .status(503)
      .json({
        error: "The household database is unavailable. Please try again.",
      });
  }
}
