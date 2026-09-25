import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {randomUUID} from 'node:crypto';
import {applyAction,cleanRecipe} from '../lib/recipes/model.mjs';
const tick=()=>new Promise(r=>setImmediate(r));
test('rapid actions wait behind refresh and save sequentially without busy rejection',async()=>{
 const effects=[],data=new Map(),errors=[];
 let releaseRead,server={recipes:[cleanRecipe({id:'a',name:'A'})],basket:{},checks:{},products:{},week:{},weekCooked:{},revision:0},posts=0;
 const gate=new Promise(r=>{releaseRead=r;});
 const source=fs.readFileSync(new URL('../components/recipes/useHousehold.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace('export function useHousehold','function useHousehold');
 const context={applyAction,structuredClone,crypto:{randomUUID},AbortSignal,Date,Promise,setInterval:()=>0,clearInterval(){},
 navigator:{onLine:true},document:{visibilityState:'visible'},window:{addEventListener(){},removeEventListener(){},location:{assign(){}}},
 localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},
 useRef:v=>({current:v}),useCallback:f=>f,useEffect:f=>effects.push(f),useState:initial=>{let value=initial;return[value,next=>{value=typeof next==='function'?next(value):next;if(typeof value==='string'&&value.includes('Sync is'))errors.push(value);}];},
 fetch:async(_url,options)=>{if(!options?.method){await gate;return{ok:true,status:200,json:async()=>({state:structuredClone(server),agent:true})};}posts++;const a=JSON.parse(options.body);await tick();applyAction(server,a);return{ok:true,status:200,json:async()=>({state:structuredClone(server)})};}
 };
 vm.createContext(context);vm.runInContext(source+'\nglobalThis.hook=useHousehold();',context);effects.forEach(f=>f());await tick();
 const first=context.hook.act({type:'plan',recipeId:'a',value:true,servings:2});
 const second=context.hook.act({type:'basket',recipeId:'a',value:false});
 assert.equal(posts,0);releaseRead();assert.deepEqual(await Promise.all([first,second]),[true,true]);assert.equal(posts,2);assert.equal(server.week.a.servings,2);assert.deepEqual(errors,[]);
});
