import test from 'node:test';
import assert from 'node:assert/strict';
import { recipeTab, tabDestination } from '../lib/recipes/navigation.mjs';
test('direct entries and invalid tab values resolve safely', () => {
  for (const [pathname, expected] of [['/recipes','week'],['/recipes/box','box'],['/recipes/basket','basket']]) {
    assert.equal(recipeTab({ pathname, query: {} }), expected);
    assert.equal(recipeTab({ pathname, query: { tab: 'invalid' } }), expected);
  }
});
test('tab changes stay on the loaded Next route while keeping canonical public URLs', () => {
  for (const pathname of ['/recipes','/recipes/box','/recipes/basket']) {
    const target = tabDestination({ pathname }, 'box', { tag: 'chicken' });
    assert.equal(target.url.pathname, pathname);
    assert.deepEqual(target.as, { pathname:'/recipes/box', query:{tag:'chicken'} });
    assert.equal(recipeTab({pathname, query:target.url.query}), 'box');
  }
});
