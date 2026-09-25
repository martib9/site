import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {Shell,RecipeRow} from '../../components/recipes/Household';
import {useHousehold} from '../../components/recipes/useHousehold';
import {portions,recipePath,scaledIngredients} from '../../lib/recipes/experience.mjs';
export {pageProps as getServerSideProps} from '../../lib/recipes/auth';
export default function RecipePage(){
 const router=useRouter(),store=useHousehold();
 const r=store.state?.recipes.find(r=>r.id===router.query.id);
 return <Shell page="recipe" store={store}><Link href="/recipes/box">← All recipes</Link>{!store.state?<p>Loading recipe…</p>:!r?<><h1>Recipe not found</h1><p>It may have been removed from your household.</p></>:router.query.cook==='1'?<Cooking key={r.id} recipe={r} store={store}/>:<RecipeRow key={r.id} recipe={r} store={store} expanded/>}</Shell>;
}
function Cooking({recipe:r,store}){
 const [servings,setServings]=useState(store.state.week[r.id]?.servings||2),[step,setStep]=useState(0),[checked,setChecked]=useState({}),[awake,setAwake]=useState(false),[wakeMessage,setWakeMessage]=useState(''),[done,setDone]=useState(false);
 useEffect(()=>{
  if(!awake)return;
  let sentinel,cancelled=false;
  const request=async()=>{if(document.visibilityState!=='visible')return;try{const next=await navigator.wakeLock.request('screen');if(cancelled)await next.release();else {sentinel=next;setWakeMessage('Screen will stay awake while this page is visible.');}}catch{setWakeMessage('Your device could not keep the screen awake.');}};
  if(!navigator.wakeLock){setWakeMessage('Screen-awake is not supported in this browser.');return;}
  request();document.addEventListener('visibilitychange',request);return()=>{cancelled=true;document.removeEventListener('visibilitychange',request);sentinel?.release().catch(()=>{});};
 },[awake]);
 return <section className="cooking-mode"><h1>{r.name}</h1><Link href={recipePath(r.id)}>Exit cooking mode</Link><div className="recipes-actions wrap"><label>Portions <input type="number" min="1" max="100" value={servings} onChange={e=>setServings(portions(e.target.value))}/></label><label><input type="checkbox" checked={awake} onChange={e=>{setAwake(e.target.checked);setWakeMessage('');}}/> Keep screen awake</label></div>{wakeMessage&&<p role="status">{wakeMessage}</p>}
 <details open><summary>Ingredients · {servings} portions</summary>{scaledIngredients(r,servings).map((i,n)=><label className="cooking-ingredient" key={n}><input type="checkbox" checked={Boolean(checked[n])} onChange={e=>setChecked({...checked,[n]:e.target.checked})}/><span>{i.quantity??'Amount not specified'} {i.unit} {i.name}</span></label>)}</details>
 {r.steps.length?<><p className="muted">Step {step+1} of {r.steps.length}</p><p className="cooking-step" aria-live="polite">{r.steps[step]}</p><div className="recipes-actions wrap"><button disabled={step===0} onClick={()=>setStep(n=>n-1)}>Previous</button><button className="primary" disabled={step===r.steps.length-1} onClick={()=>setStep(n=>n+1)}>Next step</button></div></>:<p>No instructions saved yet. <Link href={`/recipes/add?edit=${encodeURIComponent(r.id)}`}>Add the method</Link> or read the original source.</p>}
 {r.url&&<p><a href={r.url} target="_blank" rel="noreferrer">Original recipe ↗</a></p>}
 <button className="primary" disabled={done} onClick={async()=>{if(await store.act({type:store.state.week[r.id]?'weekCooked':'cooked',recipeId:r.id,value:true})){setDone(true);setAwake(false);setWakeMessage('');}}}>{done?'Meal marked cooked':'Finished · mark cooked'}</button></section>;
}

export { Cooking };
