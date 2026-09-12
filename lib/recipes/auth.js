import { createHmac, timingSafeEqual, createHash } from "node:crypto";
export const authConfigured = () =>
  Boolean(
    process.env.RECIPES_PASSWORD?.length >= 16 &&
    process.env.RECIPES_SESSION_SECRET?.length >= 32,
  );
const digest = (s) => createHash("sha256").update(String(s)).digest();
export const equal = (a, b) => timingSafeEqual(digest(a), digest(b));
const signature = (s) =>
  createHmac("sha256", process.env.RECIPES_SESSION_SECRET)
    .update(s)
    .digest("hex");
export function sessionCookie(logout = false) {
  const expiry = Date.now() + 30 * 86400000;
  return `martib_recipes=${logout ? "" : `${expiry}.${signature(String(expiry))}`}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${logout ? 0 : 30 * 86400}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export function authenticated(req) {
  if (!authConfigured()) return false;
  const raw =
    (req.headers.cookie || "")
      .split("; ")
      .find((x) => x.startsWith("martib_recipes="))
      ?.split("=")[1] || "";
  const [expiry, sig] = raw.split(".");
  return (
    Number(expiry) > Date.now() && Boolean(sig) && equal(signature(expiry), sig)
  );
}
export function sameOrigin(req) {
  try {
    return new URL(req.headers.origin).host === req.headers.host;
  } catch {
    return false;
  }
}
export function protect(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  if (!authenticated(req)) {
    res.status(401).json({ error: "Please sign in." });
    return false;
  }
  if (req.method !== "GET" && !sameOrigin(req)) {
    res.status(403).json({ error: "Invalid request origin." });
    return false;
  }
  return true;
}
export async function pageProps({ req, res }) {
  res.setHeader("Cache-Control", "private, no-store");
  if (!authenticated(req))
    return { redirect: { destination: "/recipes/login", permanent: false } };
  return { props: {} };
}
