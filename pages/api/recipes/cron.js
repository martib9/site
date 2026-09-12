import { readState } from "../../../lib/recipes/db";
import { runJob } from "../../../lib/recipes/agent";
import { equal } from "../../../lib/recipes/auth";
export const config = { maxDuration: 60 };
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (
    !process.env.CRON_SECRET ||
    !equal(req.headers.authorization, `Bearer ${process.env.CRON_SECRET}`)
  )
    return res.status(401).end();
  if (!process.env.OPENAI_API_KEY) return res.json({ processed: 0 });
  try {
    const s = await readState();
    const jobs = s.jobs
      .filter(
        (j) =>
          j.attempts < 3 &&
          (["queued", "failed"].includes(j.status) ||
            (j.status === "running" && Date.now() - j.started > 240000)),
      )
      .slice(0, 1);
    for (const job of jobs) await runJob(job.id);
    res.json({ processed: jobs.length });
  } catch {
    res.status(503).end();
  }
}
