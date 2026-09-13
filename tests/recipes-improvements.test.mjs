import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanRecipe, isNewRecipe, applyAction, webUrl, urlKey } from '../lib/recipes/model.mjs';
import { groceryTerm, alphamegaSearchUrl } from '../lib/recipes/grocery-search.mjs';
import { resolveRecipeLink } from '../lib/recipes/resolve-link.mjs';
const day=86400000, now=10*day;
const base=()=>({recipes:[],basket:{},checks:{},products:{},week:{},weekCooked:{}});
test('NEW expires after seven days and stays dismissed after planning or cooking is undone',()=>{
 for(const action of ['plan','cooked','weekCooked']){
  const s=base(),r=cleanRecipe({id:'new',name:'Test',addedAt:now});s.recipes.push(r);
  assert.equal(isNewRecipe(r,s,now+7*day-1),true);assert.equal(isNewRecipe(r,s,now+7*day),false);
  applyAction(s,{type:action,recipeId:r.id,value:true});assert.equal(isNewRecipe(r,s,now),false);
  applyAction(s,{type:action,recipeId:r.id,value:false});assert.equal(isNewRecipe(r,s,now),false);
 }
});
test('edits preserve the original creation date and do not mark old recipes as NEW',()=>{
 const s=base(),r=cleanRecipe({id:'old',name:'Old',addedAt:day,newDismissed:true});s.recipes.push(r);
 applyAction(s,{type:'save',revision:0,recipe:{id:'old',name:'Edited',addedAt:now}});
 assert.equal(r.addedAt,day);assert.equal(r.newDismissed,true);
 const legacy=cleanRecipe({id:'list-1',name:'Old link'});assert.equal(isNewRecipe(legacy,{jobs:[{kind:'import',recipeId:'list-1',created:now}]},now),false);
});
test('sharing trackers and source URL variants identify the same recipe',()=>{
 for(const [a,b] of [
 ['https://www.instagram.com/name/reel/ABC/?igsh=123','https://instagram.com/p/ABC/'],
 ['https://m.facebook.com/watch/?v=123&fbclid=x','https://www.facebook.com/reel/123/'],
 ['https://cooking.nytimes.com/recipes/123-old?smid=share','https://cooking.nytimes.com/recipes/123-new'],
 ['http://www.example.com/r/?utm_term=a&utm_source=b#method','https://example.com/r'],
 ['https://youtu.be/abc?si=tracking','https://youtube.com/watch?v=abc'],
 ['https://t.me/s/channel/123','https://t.me/channel/123']]) assert.equal(urlKey(a),urlKey(b));
 assert.notEqual(urlKey('https://example.com/?recipe=1'),urlKey('https://example.com/?recipe=2'));
 assert.equal(webUrl('https://example.com/r?fbclid=x&utm_content=x'),'https://example.com/r');
});
test('short links resolve within their own platform and never follow off-platform redirects',async()=>{
 assert.equal(await resolveRecipeLink('https://vm.tiktok.com/abc/',async u=>u.includes('vm.')?'https://www.tiktok.com/@chef/video/123':null),'https://www.tiktok.com/@chef/video/123');
 assert.equal(await resolveRecipeLink('https://vm.tiktok.com/abc/',async()=> 'http://127.0.0.1/'),'https://vm.tiktok.com/abc/');
});
test('grocery search removes preparation text while preserving product distinctions',()=>{
 assert.equal(groceryTerm('large garlic clove, minced'),'garlic');
 assert.equal(groceryTerm('extra-virgin olive oil'),'extra-virgin olive oil');
 assert.equal(groceryTerm('gluten-free flour, plus more for dusting'),'gluten-free flour');
 assert.equal(groceryTerm('unsalted butter, melted'),'unsalted butter');
 assert.equal(alphamegaSearchUrl(groceryTerm('large garlic clove, minced')), 'https://www.alphamega.com.cy/usearch?q=garlic');
});
