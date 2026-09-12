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
  } catch {
    return res
      .status(503)
      .json({
        error: "The household database is unavailable. Please try again.",
      });
  }
}
