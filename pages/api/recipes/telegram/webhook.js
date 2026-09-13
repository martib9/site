import { waitUntil } from '@vercel/functions';
import { equal } from '../../../../lib/recipes/auth';
import { mutate, rateLimit, readState } from '../../../../lib/recipes/db';
import { applyTelegramUpdate, messageLink } from '../../../../lib/recipes/telegram-model.mjs';
import { sendTelegram, telegramConfigured, webhookSecret } from '../../../../lib/recipes/telegram';
import { runJob } from '../../../../lib/recipes/agent';
export const config = { maxDuration: 60, api: { bodyParser: { sizeLimit: '64kb' } } };
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).end();
  if (!telegramConfigured() || !equal(req.headers['x-telegram-bot-api-secret-token'], webhookSecret())) return res.status(401).end();
  try {
    const update = req.body, m = update?.message;
    const state = await readState();
    const known = m?.chat?.type === 'private' && state.telegram?.users.some(u => u.id === String(m.from?.id));
    const fresh = !state.telegram?.receipts.includes(update?.update_id);
    const allowImport = known && fresh && messageLink(m).url ? await rateLimit('agent:household',30,86400000) : false;
    const { result } = await mutate(s => applyTelegramUpdate(s, update || {}, { allowImport, configured: Boolean(process.env.OPENAI_API_KEY) }));
    if (result) waitUntil((async () => {
      // Import and acknowledgement run together, leaving the full function budget for parsing.
      await Promise.allSettled([sendTelegram(result.chatId,result.reply), result.jobId ? runJob(result.jobId) : Promise.resolve()]);
    })());
    res.status(200).json({ok:true});
  } catch { res.status(503).json({ok:false}); }
}
