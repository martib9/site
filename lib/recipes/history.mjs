const fields=['recipes','week','weekCooked','basket','checks','staples','previousWeek'];
const labels={save:'Saved a recipe',delete:'Removed a recipe',plan:'Updated the meal plan',basket:'Updated the basket',check:'Updated shopping checkmarks',clearBasket:'Cleared the basket',shopWeek:'Added meals to the basket',startFresh:'Started a fresh week',cooked:'Updated cooked status',weekCooked:'Marked a meal',staple:'Updated household staples',confirmStaples:'Checked household staples',review:'Reviewed a recipe',undo:'Undid a change'};
export function snapshot(s){return Object.fromEntries(fields.map(k=>[k,structuredClone(s[k]??null)]));}
export function recordChange(s,a,before){
 const label=labels[a.type];if(!label)return;
 s.activity=[...(s.activity||[]),{id:a.actionId,at:Date.now(),actor:String(a.actor||'Household').slice(0,40),label}].slice(-30);
 if(['delete','plan','clearBasket','startFresh','basket','shopWeek','cooked','weekCooked'].includes(a.type)){
  const changes=fields.filter(k=>JSON.stringify(before[k])!==JSON.stringify(s[k]??null)).map(k=>({key:k,before:before[k],after:structuredClone(s[k]??null)}));
  if(changes.length)s.undoLog=[...(s.undoLog||[]),{id:a.actionId,expires:Date.now()+300000,changes}].filter(x=>x.expires>Date.now()).slice(-10);
 }
}
export function undoChange(s,id){
 const entry=s.undoLog?.find(x=>x.id===id&&x.expires>Date.now());
 if(!entry)throw Error('This undo expired. Changes can be undone for five minutes.');
 if(entry.changes.some(c=>JSON.stringify(s[c.key]??null)!==JSON.stringify(c.after)))throw Error('Someone changed these items since then. Refresh and review them before changing them again.');
 for(const c of entry.changes){if(c.before===null)delete s[c.key];else s[c.key]=structuredClone(c.before);}
 s.undoLog=s.undoLog.filter(x=>x.id!==id);
}
