import {useState} from 'react';
import Link from 'next/link';
import {ingredientName, portions, recipePath, shopCandidates} from '../../lib/recipes/experience.mjs';
import {basketItems} from '../../lib/recipes/model.mjs';
export function WeekActions({store}){
 const [mode,setMode]=useState(''),[selections,setSelections]=useState({}),[keep,setKeep]=useState(true),[clear,setClear]=useState(false),[busy,setBusy]=useState(false);
 const candidates=shopCandidates(store.state);
 const openShop=()=>{setSelections(Object.fromEntries(candidates.filter(r=>r.ingredients.length).map(r=>[r.id,store.state.week[r.id].servings||2])));setMode('shop');};
 const submit=async()=>{setBusy(true);const ok=await store.act(mode==='shop'?{type:'shopWeek',selections:Object.entries(selections).map(([id,servings])=>({id,servings}))}:{type:'startFresh',keepUnfinished:keep,clearBasket:clear});if(ok)setMode('');setBusy(false);};
 return <div className="week-actions"><div className="recipes-actions wrap"><button className="primary" onClick={openShop}>Shop this week</button><button onClick={()=>setMode('fresh')}>Start fresh</button></div>
 {mode&&<section className="action-panel" aria-label={mode==='shop'?'Shopping preview':'Start fresh preview'}>
 <h2>{mode==='shop'?'Choose meals to shop for':'Start a fresh week'}</h2>
 {mode==='shop'?<><p>Unmade meals only. Existing basket recipes stay; selected recipes use these portions.</p>{candidates.length===0&&<p>No unmade meals are planned.</p>}{candidates.map(r=><div className="shop-selection" key={r.id}><label><input type="checkbox" disabled={!r.ingredients.length} checked={Object.hasOwn(selections,r.id)} onChange={e=>setSelections(old=>{const next={...old};if(e.target.checked)next[r.id]=store.state.week[r.id].servings||2;else delete next[r.id];return next;})}/>{r.name}</label>{r.ingredients.length?<input aria-label={`Shop portions for ${r.name}`} type="number" min="1" max="100" disabled={!Object.hasOwn(selections,r.id)} value={selections[r.id]||2} onChange={e=>setSelections({...selections,[r.id]:portions(e.target.value)})}/>:<Link href={recipePath(r.id)}>Add missing ingredients</Link>}</div>)}</>:<><p>{Object.keys(store.state.week).length} planned meals; {candidates.length} unfinished. Saved recipes and cooked history stay.</p><label><input type="checkbox" checked={keep} onChange={e=>setKeep(e.target.checked)}/> Keep unfinished meals ({candidates.length})</label><label><input type="checkbox" checked={clear} onChange={e=>setClear(e.target.checked)}/> Also clear the basket</label><p>The new plan will contain {keep?candidates.length:0} meals. Weekly checkmarks reset.</p></>}
 <div className="recipes-actions wrap"><button className="primary" disabled={busy||!store.online||(mode==='shop'&&!Object.keys(selections).length)} onClick={submit}>{busy?'Saving…':mode==='shop'?'Add selected meals to basket':'Start fresh'}</button><button onClick={()=>setMode('')}>Cancel</button></div></section>}
 </div>;
}
export function Staples({store}){
 const [name,setName]=useState(''),[selected,setSelected]=useState({});
 const staples=store.state.staples||[],items=basketItems(store.state).filter(i=>staples.includes(ingredientName(i.name))&&!i.have&&!i.bought);
 return <details className="action-panel"><summary>Household staples · {staples.length}</summary><p>Things you usually keep at home. Confirm them each time before shopping.</p>
 <form onSubmit={async e=>{e.preventDefault();if(name.trim()&&await store.act({type:'staple',name,value:true}))setName('');}}><label>Add a staple<input value={name} maxLength={200} onChange={e=>setName(e.target.value)} placeholder="Olive oil"/></label><button disabled={!name.trim()}>Remember</button></form>
 <div className="recipes-actions wrap">{staples.map(s=><button key={s} aria-label={`Forget staple ${s}`} onClick={()=>store.act({type:'staple',name:s,value:false})}>{s} ×</button>)}</div>
 {items.length>0&&<><h3>Check these before shopping</h3>{items.map(i=><label className="staple-check" key={i.key}><input type="checkbox" checked={Boolean(selected[i.key])} onChange={e=>setSelected({...selected,[i.key]:e.target.checked})}/>{i.name} {i.unit&&`(${i.unit})`}</label>)}<button disabled={!items.some(i=>selected[i.key])} onClick={()=>store.act({type:'confirmStaples',keys:items.filter(i=>selected[i.key]).map(i=>i.key)})}>I have the selected staples</button></>}
 </details>;
}
