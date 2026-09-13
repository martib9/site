import { randomBytes } from 'node:crypto';
import { protect } from '../../../../lib/recipes/auth';
import { mutate, readState, rateLimit } from '../../../../lib/recipes/db';
import { telegramState, pairingHash } from '../../../../lib/recipes/telegram-model.mjs';
import { telegramApi, telegramConfigured, webhookSecret } from '../../../../lib/recipes/telegram';
export default async function handler(req,res) {
  if (!protect(req,res)) return;
  if (req.method === 'GET') {
    const s = await readState();
    return res.json({ configured:telegramConfigured(), users:s.telegram?.users || [] });
  }
  if (req.method !== 'POST') return res.status(405).end();
  try {
    if (req.body.action === 'disconnect') {
      await mutate(s => { const t=telegramState(s); t.users=t.users.filter(u=>u.id!==String(req.body.id)); t.pairing=[]; });
      return res.json({ok:true});
    }
    if (!telegramConfigured()) return res.status(503).json({error:'Add TELEGRAM_BOT_TOKEN in Vercel Production, then redeploy to connect the bot.'});
    if (!(await rateLimit('telegram:pairing',20,3600000))) return res.status(429).json({error:'Too many connection requests. Try later.'});
    const bot = await telegramApi('getMe');
    await telegramApi('setWebhook',{url:'https://www.martib.app/api/recipes/telegram/webhook',secret_token:webhookSecret(),allowed_updates:['message'],max_connections:2});
    const code=randomBytes(24).toString('hex');
    await mutate(s=>{ const t=telegramState(s); t.pairing=t.pairing.filter(p=>p.expires>Date.now()).slice(-3); t.pairing.push({hash:pairingHash(code),expires:Date.now()+15*60000}); });
    res.json({url:`https://t.me/${bot.username}?start=${code}`,username:bot.username});
  } catch(e) { res.status(503).json({error:e.message==='Telegram is not configured.'?e.message:'Could not connect to Telegram. Check the bot token and try again.'}); }
}
