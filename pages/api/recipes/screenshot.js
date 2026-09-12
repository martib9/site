import { protect } from "../../../lib/recipes/auth";
import { readScreenshot } from "../../../lib/recipes/db";

export default async function handler(req, res) {
  if (!protect(req, res)) return;
  if (req.method !== "GET") return res.status(405).end();
  if (typeof req.query.id !== "string" || !/^[a-z0-9-]{36}$/.test(req.query.id)) return res.status(400).end();
  try {
    const image = await readScreenshot(req.query.id);
    if (!image) return res.status(404).send("Screenshot expired or unavailable. Import again to capture the current page.");
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Disposition", 'inline; filename="recipe-source.jpg"');
    res.status(200).send(image);
  } catch { res.status(503).send("Screenshot temporarily unavailable."); }
}
