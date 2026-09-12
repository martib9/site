import { protect } from "../../../lib/recipes/auth";
import { mutate, readState, clientState } from "../../../lib/recipes/db";
import { applyAction } from "../../../lib/recipes/model.mjs";
export const config = { api: { bodyParser: { sizeLimit: "512kb" } } };
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
    const { state } = await mutate((s) => {
      if (s.applied.includes(action.actionId)) return;
      applyAction(s, action);
      s.applied.push(action.actionId);
      s.applied = s.applied.slice(-2000);
    });
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
