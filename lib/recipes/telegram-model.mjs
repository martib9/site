import { recordChange } from './history.mjs';
import { recipeUrl } from './experience.mjs';
import { createHash, randomUUID } from 'node:crypto';
import { cleanRecipe, webUrl, text, MEALS } from './model.mjs';
import { sourceKey } from './import-output.mjs';
import { queueJob } from './job-model.mjs';
export const ALLOWED_TELEGRAM_USERS = ['mokin', 'aftertwoyears'];
export const PRIVATE_BOT_MESSAGE = 'Sorry, this is a private household bot. Your account does not have access.';
export const WELCOME = 'Welcome to LxD Meals! 🍽\nSend me one recipe link and I’ll save it to your shared recipe collection, read the available ingredients and choose breakfast, lunch or dinner.\nYou can add a caption or #breakfast, #lunch or #dinner. Forward a text recipe, or reply to my result with missing ingredients to repair it. I’ll let you know when it is ready to review.\nYour recipes: https://www.martib.app/recipes/box';
export const pairingHash = value => createHash('sha256').update(String(value)).digest('hex');
export function telegramState(state) {
  return state.telegram ||= { users: [], pairing: [], receipts: [] };
}
export function messageLink(message) {
  const body = message.text || message.caption || '';
  const entities = message.entities || message.caption_entities || [];
  const links = entities.flatMap(e => e.type === 'text_link' ? [e.url] : e.type === 'url' ? [body.slice(e.offset, e.offset + e.length)] : []);
  if (!links.length) links.push(...(body.match(/https?:\/\/[^\s<>]+/g) || []).map(u => u.replace(/[.,;!?]+$/, '')));
  const unique = [...new Set(links.map(webUrl).filter(Boolean))];
  return { url: unique[0] || '', multiple: unique.length > 1, body };
}
export function applyTelegramUpdate(state, update, { allowImport = true, configured = true, now = Date.now(), resolvedUrl = '' } = {}) {
  const m = update.message;
  if (!Number.isSafeInteger(update.update_id) || !m || m.chat?.type !== 'private' || m.from?.is_bot || !Number.isSafeInteger(m.from?.id) || m.from.id !== m.chat.id) return null;
  const username = String(m.from.username || '').toLowerCase(), chatId = String(m.chat.id);
  if (!ALLOWED_TELEGRAM_USERS.includes(username)) return { chatId, reply: PRIVATE_BOT_MESSAGE };
  const tg = telegramState(state);
  if (tg.receipts.includes(update.update_id)) return null;
  tg.receipts.push(update.update_id); tg.receipts = tg.receipts.slice(-2000);
  const body = text(m.text || m.caption, 20000);
  const pair = body.match(/^\/start\s+([a-f0-9]{48})$/);
  let user = tg.users.find(u => u.id === chatId);
  if ((user?.username && user.username !== username) || tg.users.some(u=>u.username===username && u.id!==chatId)) return {chatId,reply:PRIVATE_BOT_MESSAGE};
  if (!user && !pair) {
    if (tg.users.length >= 2 || tg.users.some(u=>u.username===username && u.id!==chatId)) return {chatId,reply:PRIVATE_BOT_MESSAGE};
    user = {id:chatId,username,name:text(m.from.first_name)||username,connectedAt:now};
    tg.users.push(user);
  }
  if (pair) {
    const invitation = tg.pairing.find(p => p.hash === pairingHash(pair[1]) && p.expires > now);
    if (!invitation) return { chatId, reply: 'This connection link expired or was already used. Get a new link from Telegram companion on the recipe website.' };
    if (!user && tg.users.length >= 2) return { chatId, reply: 'Both household accounts are connected. Disconnect an account on the website first.' };
    tg.pairing = tg.pairing.filter(p => p !== invitation && p.expires > now);
    if (!user) tg.users.push({ id: chatId, username, name: text(m.from.first_name) || 'Household member', connectedAt: now });
    return { chatId, reply: WELCOME };
  }
  if (!user) return { chatId, reply: 'Connect your account from Telegram companion on https://www.martib.app/recipes/box first.' };
  if (/^\/start(?:@\w+)?$/.test(body)) return {chatId,reply:WELCOME};
  if (/^\/disconnect(?:@\w+)?$/.test(body)) {
    tg.users = tg.users.filter(u => u.id !== chatId);
    return { chatId, reply: 'Disconnected. Your saved recipes were kept.' };
  }
  const reply = (tg.replies||[]).find(x=>x.chatId===chatId && x.messageId===m.reply_to_message?.message_id);
  if (reply && body && !body.startsWith('/')) {
    const recipe=state.recipes.find(r=>r.id===reply.recipeId);
    if(!recipe)return {chatId,reply:'That recipe was removed. Send its link again to save it.'};
    if(state.jobs.some(j=>j.recipeId===recipe.id&&['queued','running'].includes(j.status)&&now-j.created<600000))return {chatId,reply:'This recipe is still importing. Please reply with the text when it finishes.',recipeId:recipe.id};
    if(!allowImport||!configured)return {chatId,reply:configured?'Daily import limit reached. Please try tomorrow.':'The recipe agent is not connected yet.',recipeId:recipe.id};
    const jobId=queueJob(state,'import',recipe.id,body);
    Object.assign(state.jobs.find(j=>j.id===jobId),{telegramChatId:chatId,categorize:true});
    recipe.importMessage='Reading the recipe text you supplied…';
    return {chatId,jobId,recipeId:recipe.id,reply:`Reading your reply and updating the same recipe.\n${recipeUrl(recipe.id)}`};
  }
  const { url: sentUrl, multiple } = messageLink(m);
  const url = webUrl(resolvedUrl || sentUrl);
  const forwardedText = !url && m.forward_origin && body.length >= 30;
  if ((!url && !forwardedText) || multiple) return { chatId, reply: multiple ? 'Please send one recipe link per message so each caption belongs to the right recipe.' : 'Send one recipe link, optionally with its ingredients or caption. I will save it to your household and try to extract and categorize it. /disconnect removes your access.' };
  const existing = state.recipes.find(r => url && sourceKey(r.url) === sourceKey(url));
  if (existing) return { chatId, reply: `Already saved: ${existing.name}\n${recipeUrl(existing.id)}\nReply to this message with recipe text to repair missing ingredients.`, recipeId: existing.id };
  const meal = MEALS.find(v => new RegExp(`#${v}\\b`, 'i').test(body));
  const recipe = cleanRecipe({ id: `telegram-${randomUUID()}`, url, mealType: meal || 'lunch', status: 'needs-input' });
  recipe.addedAt = now;
  state.recipes.unshift(recipe);
  recordChange(state,{type:"save",actor:user.name||"Telegram",actionId:`telegram-${update.update_id}`},null);
  let jobId;
  if (allowImport && configured) {
    // The whole message is context, not automatically trusted ingredient evidence.
    jobId = queueJob(state, 'import', recipe.id, forwardedText || body.replace(/https?:\/\/\S+/g,'').replace(/#\w+/g,'').trim().length>30 ? body : '');
    Object.assign(state.jobs.find(j => j.id === jobId), { telegramChatId: chatId, sourceContext: body, categorize: !meal });
    recipe.importMessage = 'Saved from Telegram. Reading and categorizing the recipe…';
  } else recipe.importMessage = configured ? 'Saved from Telegram. Daily import limit reached; use Import recipe later.' : 'Saved from Telegram. The AI connection is not configured yet.';
  return { chatId, jobId, recipeId: recipe.id, reply: jobId ? `Recipe saved. I’m reading it and choosing its meal category. I’ll send the result here.\n${recipeUrl(recipe.id)}` : `${recipe.importMessage}\n${recipeUrl(recipe.id)}` };
}
