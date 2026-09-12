import { protect } from "../../../lib/recipes/auth";
import { mutate, readState, clientState, rateLimit } from "../../../lib/recipes/db";
import { waitUntil } from "@vercel/functions";
import { applyActionWithImport, wantsAutomaticImport } from "../../../lib/recipes/job-model.mjs";
import { runJob } from "../../../lib/recipes/agent";
export const config = { maxDuration: 60, api: { bodyParser: { sizeLimit: "512kb" } } };
export default async function handler(req, res) {
  if (!protect(req, res)) return;
  try {
    if (req.method === "GET")
      return res.json({
        state: clientState(await readState()),
        agent: Boolean(process.env.OPENAI_API_KEY),
      });
    if (req.method !== "POST") return res.status(405).end();
    const action = req.body;
    if (
      !action ||
      typeof action.actionId !== "string" ||
      action.actionId.length > 100
    )
      return res.status(400).json({ error: "Missing action ID." });
    const automatic = action.type === "save" && wantsAutomaticImport(await readState(), action);
    const importAllowed = automatic && Boolean(process.env.OPENAI_API_KEY) && await rateLimit("agent:household", 30, 86400000);
    const { state, result } = await mutate((s) => applyActionWithImport(s, action, {importAllowed, agentConfigured:Boolean(process.env.OPENAI_API_KEY)}));
    if (result?.jobId) waitUntil(runJob(result.jobId));
    res.json({ state: clientState(state) });
  } catch (e) {
    res
      .status(400)
      .json({
        error: /database|connect|relation|password|timeout/i.test(e.message)
          ? "Could not save. Please retry."
          : e.message,
      });
  }
}
