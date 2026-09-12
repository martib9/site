import test from "node:test";
import assert from "node:assert/strict";
import {
  applyAction,
  cleanRecipe,
  basketItems,
  webUrl,
} from "../lib/recipes/model.mjs";
const state = () => ({
  recipes: [
    cleanRecipe({
      id: "one",
      name: "One",
      url: "https://example.com/one",
      servings: 2,
      ingredients: [{ name: "Yogurt", quantity: 200, unit: "g" }],
    }),
    cleanRecipe({
      id: "two",
      name: "Two",
      url: "https://example.com/two",
      servings: 2,
      ingredients: [{ name: "Yogurt", quantity: 0.3, unit: "kg" }],
    }),
  ],
  week: {},
  previousWeek: {},
  weekCooked: {},
  basket: {},
  checks: {},
  products: {},
  migrations: [],
});
test("basket combines compatible units and scales servings without duplicates", () => {
  const s = state();
  applyAction(s, { type: "basket", recipeId: "one", value: true, servings: 4 });
  applyAction(s, { type: "basket", recipeId: "one", value: true, servings: 4 });
  applyAction(s, { type: "basket", recipeId: "two", value: true });
  assert.equal(basketItems(s).length, 1);
  assert.equal(basketItems(s)[0].quantity, 700);
});
test("unknown amounts stay visibly uncertain and incompatible units stay separate", () => {
  const s = state();
  s.recipes[1].ingredients[0].quantity = null;
  s.recipes[1].ingredients[0].unit = "cups";
  s.basket = { one: 2, two: 2 };
  assert.equal(basketItems(s).length, 2);
  assert.equal(basketItems(s)[1].uncertain, true);
});
test("new week preserves prior plan and lifetime cooked state", () => {
  const s = state();
  applyAction(s, { type: "plan", recipeId: "one", value: true });
  applyAction(s, { type: "weekCooked", recipeId: "one", value: true });
  applyAction(s, { type: "newWeek" });
  assert.deepEqual(s.week, {});
  assert.equal(s.recipes[0].cooked, true);
  assert.deepEqual(s.weekCooked, {});
  applyAction(s, { type: "copyWeek" });
  assert.ok(s.week.one);
});
test("concurrent stale recipe edits are rejected", () => {
  const s = state();
  applyAction(s, {
    type: "save",
    recipe: { ...s.recipes[0], name: "Changed" },
    revision: 0,
  });
  assert.throws(
    () =>
      applyAction(s, {
        type: "save",
        recipe: { ...s.recipes[0], name: "Stale" },
        revision: 0,
      }),
    /another device/,
  );
});
test("migration is repeatable and preserves edited names and custom records", () => {
  const s = state();
  const a = {
    type: "migrate",
    device: "a",
    legacy: {
      custom: [
        { id: "three", name: "Three", url: "https://example.com/three" },
      ],
      edits: { one: { name: "Personal title" } },
      cooked: { one: true },
    },
  };
  applyAction(s, a);
  applyAction(s, a);
  assert.equal(s.recipes.length, 3);
  assert.equal(s.recipes[0].name, "Personal title");
  assert.equal(s.recipes[0].cooked, true);
});
test("rejects unsafe links and duplicate recipe links", () => {
  assert.equal(webUrl("javascript:alert(1)"), "");
  assert.equal(webUrl("https://user:password@example.com"), "");
  const s = state();
  assert.throws(
    () =>
      applyAction(s, {
        type: "save",
        recipe: { id: "new", url: "https://example.com/one/" },
      }),
    /Already saved/,
  );
});

test("changing basket requirements clears stale bought checkmarks", () => {
  const s = state();
  applyAction(s, { type: "basket", recipeId: "one", value: true, servings: 2 });
  applyAction(s, {
    type: "check",
    key: "yogurt|g",
    field: "bought",
    value: true,
  });
  assert.equal(basketItems(s)[0].bought, true);
  applyAction(s, { type: "basket", recipeId: "one", value: true, servings: 4 });
  assert.equal(basketItems(s)[0].bought, undefined);
});
