import { readState } from "../../../lib/recipes/db";
import { notifyTelegramJob } from "../../../lib/recipes/telegram";
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
  try {
    const s = await readState();
    const jobs = s.jobs
      .filter(
        (j) =>
          (j.kind === "capture" || Boolean(process.env.OPENAI_API_KEY)) &&
          j.attempts < 3 &&
          (["queued", "failed"].includes(j.status) ||
            (j.status === "running" && Date.now() - j.started > 240000)),
      )
      .slice(0, 1);
    for (const job of jobs) await runJob(job.id);
    const pending = s.jobs.find(j=>j.telegramChatId&&!j.telegramNotified&&["done","failed"].includes(j.status));
    if(pending) await notifyTelegramJob(pending.id);
    res.json({ processed: jobs.length });
  } catch {
    res.status(503).end();
  }
}
