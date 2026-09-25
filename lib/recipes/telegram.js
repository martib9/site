import { recipeUrl } from './experience.mjs';
import { createHmac } from 'node:crypto';
import { mutate } from './db';
export const telegramConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.RECIPES_SESSION_SECRET);
export const webhookSecret = () => createHmac('sha256', process.env.RECIPES_SESSION_SECRET).update('telegram-webhook-v1').digest('hex');
export async function telegramApi(method, payload = {}) {
  if (!telegramConfigured()) throw new Error('Telegram is not configured.');
  let response;
  try {
    response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, { method: 'POST', headers: payload instanceof FormData ? {} : { 'Content-Type': 'application/json' }, body: payload instanceof FormData ? payload : JSON.stringify(payload), signal: AbortSignal.timeout(6000) });
    const data = await response.json();
    if (response.ok && data.ok) return data.result;
  } catch {}
  throw new Error('Telegram could not complete the request. Check the bot connection and try again.');
}
export async function sendTelegram(chatId, message, recipeId) {
  try { const sent = await telegramApi('sendMessage', { chat_id: chatId, text: message.slice(0,4000), link_preview_options: { is_disabled: true } }); if(recipeId) await mutate(s=>{const tg=s.telegram;if(tg)tg.replies=[...(tg.replies||[]),{chatId:String(chatId),messageId:sent.message_id,recipeId}].slice(-500);}); return true; }
  catch { return false; }
}
export async function notifyTelegramJob(id) {
  const { result } = await mutate(s => {
    const j = s.jobs.find(j => j.id === id);
    if (!j?.telegramChatId || j.telegramNotified || !['done','failed'].includes(j.status) || (j.telegramSending && Date.now() - j.telegramSending < 30000)) return null;
    if (!s.telegram?.users.some(u => u.id === j.telegramChatId)) { j.telegramNotified = true; return null; }
    const r = s.recipes.find(r => r.id === j.recipeId);
    j.telegramSending = Date.now();
    return { chatId: j.telegramChatId, recipeId:r?.id, message: r ? `${r.name}\nMeal: ${r.mealType}${r.ingredients.length ? `\n${r.ingredients.length} ingredients imported — please review the amounts.` : '\nLink saved; ingredients still need attention.'}\n${j.message || r.importMessage || ''}\n${recipeUrl(r.id)}\nReply to this message with the recipe text if ingredients are missing.` : 'The recipe was removed before its import finished.' };
  });
  if (!result) return;
  const sent = await sendTelegram(result.chatId, result.message,result.recipeId);
  await mutate(s => { const j = s.jobs.find(j => j.id === id); if(j) { j.telegramNotified = sent; delete j.telegramSending; } });
}
