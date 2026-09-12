import test from "node:test";
import assert from "node:assert/strict";
import { applyAction, cleanRecipe } from "../lib/recipes/model.mjs";
const state = () => ({ revision: 4, recipes: [cleanRecipe({id:"old",name:"Old"})], week: {}, previousWeek: {old:{}}, weekCooked: {old:true}, basket:{}, checks:{}, products:{old:{}}, jobs:[{id:"old-job"}], applied:[], migrations:[] });
const replacement = () => ({type:"replaceCollection",expectedRevision:4,recipes:[{id:"new",name:"New",url:"",mealType:"breakfast",cooked:true,tags:["breakfast"]}],week:{new:{mealType:"breakfast",servings:2}}});
test("collection replacement preserves cooked and meal data and clears old household references", () => {
  const s=state();applyAction(s,replacement());
  assert.deepEqual(s.recipes.map(r=>r.id),["new"]);assert.equal(s.recipes[0].cooked,true);
  assert.equal(s.recipes[0].mealType,"breakfast");assert.equal(s.week.new.mealType,"breakfast");
  for(const k of ["previousWeek","weekCooked","basket","checks","products"]) assert.deepEqual(s[k],{});
  assert.deepEqual(s.jobs,[]);
});
test("stale or invalid replacements leave the existing collection intact", () => {
  for(const action of [{...replacement(),expectedRevision:3},{...replacement(),recipes:[...replacement().recipes,...replacement().recipes]},{...replacement(),week:{missing:{mealType:"lunch"}}}]){
    const s=state(),before=structuredClone(s);assert.throws(()=>applyAction(s,action));assert.deepEqual(s,before);
  }
});
test("multiple named linkless recipes can be saved while invalid nonempty URLs remain rejected", () => {
  const s=state();for(const id of ["first","second"])applyAction(s,{type:"save",recipe:{id,name:id,url:""}});
  assert.equal(s.recipes.length,3);
  assert.throws(()=>applyAction(s,{type:"save",recipe:{id:"bad",name:"Bad",url:"javascript:alert(1)"}}),/valid recipe link/);
});
