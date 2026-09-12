import { waitUntil } from "@vercel/functions";
import { protect } from "../../../lib/recipes/auth";
import { rateLimit, readState } from "../../../lib/recipes/db";
import { enqueue, runJob } from "../../../lib/recipes/agent";
export const config = {
  maxDuration: 60,
  api: { bodyParser: { sizeLimit: "32kb" } },
};
export default async function handler(req, res) {
  if (!protect(req, res)) return;
  if (req.method !== "POST") return res.status(405).end();
  if (!process.env.OPENAI_API_KEY)
    return res
      .status(503)
      .json({
        error:
          "The recipe agent is awaiting its AI connection. You can still add ingredients manually.",
      });
  try {
    if (!(await rateLimit("agent:household", 30, 86400000)))
      return res
        .status(429)
        .json({ error: "Daily limit reached (30 agent jobs). Try tomorrow." });
    let id = req.body.retryId;
    if (id) {
      const s = await readState();
      const j = s.jobs.find((x) => x.id === id);
      if (!j || j.status === "done" || j.attempts >= 3)
        return res
          .status(400)
          .json({ error: "This job cannot be retried. Start a new import." });
    } else {
      if (!["import", "match"].includes(req.body.kind))
        return res.status(400).end();
      id = await enqueue(req.body.kind, req.body.recipeId, req.body.caption);
    }
    waitUntil(runJob(id));
    res.status(202).json({ id });
  } catch {
    res.status(400).json({ error: "Could not start the job. Please retry." });
  }
}
