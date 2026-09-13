import test from 'node:test';
import assert from 'node:assert/strict';
import { applyTelegramUpdate, messageLink, pairingHash } from '../lib/recipes/telegram-model.mjs';
const code='a'.repeat(48);
const state=()=>({recipes:[],jobs:[],telegram:{users:[],receipts:[],pairing:[{hash:pairingHash(code),expires:2000}]}});
const update=(id,text,user=42)=>({update_id:id,message:{text,chat:{id:user,type:'private'},from:{id:user,first_name:'Test'}}});
const pair=s=>applyTelegramUpdate(s,update(1,`/start ${code}`),{now:1000});
test('pairing is one-use, expires, and is capped at two members',()=>{
 const s=state();pair(s);assert.equal(s.telegram.users.length,1);assert.equal(s.telegram.pairing.length,0);
 applyTelegramUpdate(s,update(2,`/start ${code}`,43),{now:1000});assert.equal(s.telegram.users.length,1);
 const expired=state();applyTelegramUpdate(expired,update(1,`/start ${code}`),{now:3000});assert.equal(expired.telegram.users.length,0);
 const full=state();full.telegram.users=[{id:'1'},{id:'2'}];pair(full);assert.equal(full.telegram.users.length,2);
});
test('unpaired users, groups and forged sender/chat combinations cannot add recipes',()=>{
 const s=state();applyTelegramUpdate(s,update(1,'https://example.com/recipe'));assert.equal(s.recipes.length,0);
 const u=update(2,'https://example.com/recipe');u.message.chat.type='group';assert.equal(applyTelegramUpdate(s,u),null);
 u.message.chat.type='private';u.message.from.id=999;assert.equal(applyTelegramUpdate(s,u),null);
});
test('a delivery atomically saves one recipe and one job; repeats and equivalent links deduplicate',()=>{
 const s=state();pair(s);const u=update(2,'https://instagram.com/p/ABC/ #dinner');const r=applyTelegramUpdate(s,u);
 assert.ok(r.jobId);assert.equal(s.recipes[0].mealType,'dinner');assert.equal(s.jobs[0].categorize,false);
 assert.equal(applyTelegramUpdate(s,u),null);applyTelegramUpdate(s,update(3,'https://www.instagram.com/reel/ABC/'));
 assert.equal(s.recipes.length,1);assert.equal(s.jobs.length,1);
});
test('quota exhaustion and missing AI keep the link without launching a paid job',()=>{
 for(const options of [{allowImport:false},{configured:false}]){const s=state();pair(s);applyTelegramUpdate(s,update(2,'https://example.com/recipe'),options);assert.equal(s.recipes.length,1);assert.equal(s.jobs.length,0);}
});
test('Telegram URL entities use UTF-16 offsets and support hidden/caption links',()=>{
 assert.equal(messageLink({text:'🥗 https://example.com/r',entities:[{type:'url',offset:3,length:21}]}).url,'https://example.com/r');
 assert.equal(messageLink({caption:'recipe',caption_entities:[{type:'text_link',url:'https://example.com/r'}]}).url,'https://example.com/r');
 assert.equal(messageLink({text:'https://example.com/a https://example.com/b'}).multiple,true);
});
test('disconnect revokes future imports and preserves saved recipes',()=>{
 const s=state();pair(s);applyTelegramUpdate(s,update(2,'https://example.com/r'));applyTelegramUpdate(s,update(3,'/disconnect'));
 applyTelegramUpdate(s,update(4,'https://example.com/new'));assert.equal(s.recipes.length,1);assert.equal(s.telegram.users.length,0);
});
