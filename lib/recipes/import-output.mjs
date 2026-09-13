import { RecipeAgentError } from './agent-errors.mjs';
import { webUrl } from './model.mjs';
const object = (properties) => ({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const string={type:'string'},number={type:['number','null']};
export const recipeSchema=object({name:string,mealType:{type:"string",enum:["breakfast","lunch","dinner"]},tags:{type:'array',items:string},servings:number,ingredients:{type:'array',items:object({name:string,quantity:number,unit:string,section:{type:'string',enum:['Produce','Dairy & eggs','Meat & fish','Pantry','Other']}})},steps:{type:'array',items:string},sourceAccessed:{type:'boolean'},accessStatus:{type:'string',enum:['readable','login-required','video-only','not-found','unknown']},message:string});
export const matchSchema=object({matches:{type:'array',items:object({key:string,name:string,url:{type:['string','null']},status:{type:'string',enum:['matched','alternative','not-found']},pack:string,reason:string})}});
export function sourceKey(value){
 const raw=webUrl(value);if(!raw)return '';
 const u=new URL(raw),host=u.hostname.replace(/^www\./,'');
 if(host==='instagram.com'){
  const id=u.pathname.match(/\/(?:p|reels?)\/([^/]+)/)?.[1];
  if(id)return `instagram:${id}`;
 }
 if(host==='tiktok.com'){
  const id=u.pathname.match(/\/video\/(\d+)/)?.[1];if(id)return `tiktok:${id}`;
 }
 u.hostname=host;u.pathname=u.pathname.replace(/\/$/,'');u.searchParams.sort();return u.href;
}
export function parseResearchResult(result){
 if(result.status==='incomplete')throw new RecipeAgentError('The AI response was incomplete. Please retry; your recipe was kept.');
 const content=(result.output||[]).filter(x=>x.type==='message').flatMap(x=>x.content||[]);
 if(content.some(x=>x.type==='refusal'))throw new RecipeAgentError('The AI service could not extract this source. Paste the recipe text to continue.');
 const output=content.filter(x=>x.type==='output_text').map(x=>x.text).join('');
 let value;try{value=JSON.parse(output.replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));}catch{throw new RecipeAgentError('The AI response could not be read. Please retry; your recipe was kept.');}
 if(!value || typeof value!=='object' || Array.isArray(value))throw new RecipeAgentError('The AI response did not contain recipe data. Please retry.');
 return value;
}
export function accessMessage(status){
 if(status==='login-required')return 'This source requires access the agent does not have. Paste the recipe text or caption.';
 if(status==='video-only')return 'The agent could not find readable recipe text in this video post. Paste its ingredients or caption.';
 if(status==='not-found')return 'The exact recipe could not be found. Check the link or paste the recipe text.';
 return 'The agent could not verify ingredients from this exact source. Paste its caption or enter ingredients manually.';
}
