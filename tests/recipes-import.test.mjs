import test from 'node:test';import assert from 'node:assert/strict';
import {sourceKey,parseResearchResult} from '../lib/recipes/import-output.mjs';
import {applyActionWithImport} from '../lib/recipes/job-model.mjs';
const state=()=>({recipes:[],week:{},basket:{},checks:{},jobs:[],applied:[]});
const action=()=>({type:'save',actionId:'request-one',recipe:{id:'one',name:'Test',url:'https://example.com/recipe',mealType:'lunch'}});
test('new recipe save persists exactly one automatic job, including when the save response is retried',()=>{
 const s=state(),a=action();const first=applyActionWithImport(s,a,{importAllowed:true});
 assert.ok(first.jobId);assert.equal(s.jobs[0].status,'queued');assert.equal(s.recipes.length,1);
 const retry=applyActionWithImport(s,a,{importAllowed:true});assert.equal(retry.jobId,first.jobId);assert.equal(s.jobs.length,1);assert.equal(s.recipes.length,1);
});
test('manual ingredients, edits and empty linkless recipes do not trigger paid imports',()=>{
 for(const recipe of [{...action().recipe,ingredients:[{name:'Milk',quantity:1,unit:'l'}]},{...action().recipe,url:''}]){
  const s=state();applyActionWithImport(s,{...action(),recipe},{importAllowed:true});assert.equal(s.jobs.length,0);
 }
 const s=state();applyActionWithImport(s,action(),{importAllowed:true});applyActionWithImport(s,{...action(),actionId:'edit',revision:0},{importAllowed:true});assert.equal(s.jobs.length,1);
});
test('quota limits keep the saved recipe and explain how to continue',()=>{
 const s=state();applyActionWithImport(s,action(),{agentConfigured:true});assert.equal(s.recipes.length,1);assert.equal(s.jobs.length,0);assert.match(s.recipes[0].importMessage,/Daily import limit/);
});
test('caption-only recipe is queued with its original recipe text',()=>{
 const s=state();applyActionWithImport(s,{...action(),caption:'200 g oats',recipe:{...action().recipe,url:''}},{importAllowed:true});assert.equal(s.jobs[0].caption,'200 g oats');
});
test('Instagram URL variants match only the exact post ID',()=>{
 const key=sourceKey('https://www.instagram.com/creator/reel/ABC123/?igsh=abc');assert.equal(key,sourceKey('https://www.instagram.com/reels/ABC123/'));assert.notEqual(key,sourceKey('https://www.instagram.com/reel/ABC124/'));
 assert.notEqual(sourceKey('https://example.com/recipe?id=1'),sourceKey('https://example.com/recipe?id=2'));
});
test('refused, truncated and malformed responses give safe actionable errors',()=>{
 assert.throws(()=>parseResearchResult({status:'incomplete'}),/incomplete/);
 assert.throws(()=>parseResearchResult({output:[{type:'message',content:[{type:'refusal',refusal:'private provider text'}]}]}),/Paste the recipe text/);
 assert.throws(()=>parseResearchResult({output:[]}),/could not be read/);
 assert.deepEqual(parseResearchResult({output:[{type:'message',content:[{type:'output_text',text:'{"ingredients":[]}'}]}]}),{ingredients:[]});
});
