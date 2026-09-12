import { randomUUID } from 'node:crypto';
import { text, applyAction } from './model.mjs';
export function queueJob(state,kind,recipeId,caption=''){
 const existing=state.jobs.find(j=>j.kind===kind&&j.recipeId===recipeId&&['queued','running'].includes(j.status)&&Date.now()-j.created<600000);
 if(existing)return existing.id;
 if(kind==='import'&&!state.recipes.some(r=>r.id===recipeId))throw new Error('Recipe not found.');
 const job={id:randomUUID(),kind,recipeId:recipeId||null,caption:text(caption,20000),status:'queued',created:Date.now(),attempts:0};
 state.jobs.push(job);state.jobs=state.jobs.slice(-100);return job.id;
}
export function wantsAutomaticImport(state,action){
 return action.type==='save'&&!state.recipes.some(r=>r.id===action.recipe?.id)&&!action.recipe?.ingredients?.length&&Boolean(action.recipe?.url?.trim()||action.caption?.trim());
}

export function applyActionWithImport(state,action,{importAllowed=false,agentConfigured=false}={}){
 if(state.applied.includes(action.actionId))return {jobId:state.jobs.find(j=>j.triggerActionId===action.actionId)?.id};
 const automatic=wantsAutomaticImport(state,action);
 applyAction(state,action);
 let jobId;
 if(automatic){
  if(importAllowed){jobId=queueJob(state,'import',action.recipe.id,action.caption);state.jobs.find(j=>j.id===jobId).triggerActionId=action.actionId;}
  else state.recipes.find(r=>r.id===action.recipe.id).importMessage=agentConfigured?'Recipe saved. Daily import limit reached; use Import recipe tomorrow.':'Recipe saved. Connect the recipe agent to import ingredients.';
 }
 state.applied.push(action.actionId);state.applied=state.applied.slice(-2000);
 return {jobId};
}
