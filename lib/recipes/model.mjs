export const MEALS = ["breakfast", "lunch", "dinner"];
export const text = (v, max = 200) =>
  String(v ?? "")
    .trim()
    .slice(0, max);
export const tags = (v) =>
  [
    ...new Set(
      (Array.isArray(v) ? v : String(v || "").split(","))
        .map((t) => text(t, 40).toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, 20);
export { webUrl, urlKey } from './links.mjs';
import { webUrl, urlKey } from './links.mjs';
export function isNewRecipe(recipe, state, now=Date.now()) {
  const added=recipe.addedAt || (recipe.id?.startsWith('telegram-') && state.jobs?.find(j=>j.kind==='import'&&j.recipeId===recipe.id)?.created);
  return Boolean(added && added<=now && now-added<7*86400000 && !recipe.newDismissed && !recipe.cooked && !state.week?.[recipe.id]);
}
export function ingredients(value) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 100)
    .filter((x) => x && text(x.name))
    .map((x) => ({
      name: text(x.name),
      quantity:
        Number.isFinite(Number(x.quantity)) && Number(x.quantity) > 0
          ? Math.min(Number(x.quantity), 100000)
          : null,
      unit: text(x.unit, 30).toLowerCase(),
      section: [
        "Produce",
        "Dairy & eggs",
        "Meat & fish",
        "Pantry",
        "Other",
      ].includes(x.section)
        ? x.section
        : "Other",
    }));
}
export function cleanRecipe(r) {
  return {
    id: text(r.id, 250),
    name: text(r.name) || "Untitled recipe",
    url: webUrl(r.url || ""),
    mealType: MEALS.includes(r.mealType || r.defaultMealType)
      ? r.mealType || r.defaultMealType
      : "lunch",
    tags: tags(r.tags),
    cooked: Boolean(r.cooked),
    servings: Math.max(1, Math.min(100, Number(r.servings) || 2)),
    ingredients: ingredients(r.ingredients),
    steps: (Array.isArray(r.steps) ? r.steps : [])
      .map((x) => text(x, 2000))
      .slice(0, 50),
    notes: text(r.notes, 4000),
    status: r.status || "saved",
    revision: r.revision || 0,
    addedAt: Number(r.addedAt) || null,
    newDismissed: Boolean(r.newDismissed),
  };
}
export function basketItems(state) {
  const items = new Map();
  for (const [recipeId, servings] of Object.entries(state.basket)) {
    const r = state.recipes.find((x) => x.id === recipeId);
    if (!r) continue;
    for (const i of r.ingredients || []) {
      let unit = i.unit,
        quantity = i.quantity;
      if (unit === "kg") {
        unit = "g";
        quantity = quantity == null ? null : quantity * 1000;
      }
      if (unit === "l") {
        unit = "ml";
        quantity = quantity == null ? null : quantity * 1000;
      }
      const key = `${i.name.toLowerCase().trim()}|${unit}`;
      const existing = items.get(key) || {
        key,
        name: i.name,
        unit,
        quantity: 0,
        uncertain: false,
        section: i.section,
        recipes: [],
      };
      existing.quantity +=
        quantity == null ? 0 : (quantity * servings) / r.servings;
      existing.uncertain ||= quantity == null;
      if (!existing.recipes.includes(r.name)) existing.recipes.push(r.name);
      items.set(key, existing);
    }
  }
  return [...items.values()].map((i) => ({
    ...i,
    quantity: Math.round(i.quantity * 100) / 100,
    ...(state.checks[i.key] || {}),
    product: state.products[i.key] || null,
  }));
}
export function applyAction(state, action) {
  const beforeBasket = new Map(
    basketItems(state).map((i) => [
      i.key,
      JSON.stringify([i.quantity, i.uncertain, i.recipes]),
    ]),
  );
  const r = state.recipes.find((x) => x.id === action.recipeId);
  switch (action.type) {
    case "replaceCollection": {
      if (!Number.isInteger(action.expectedRevision) || action.expectedRevision !== state.revision)
        throw new Error("The collection changed. Refresh before replacing it.");
      if (!Array.isArray(action.recipes) || !action.recipes.length || action.recipes.length > 1000)
        throw new Error("Provide between 1 and 1000 recipes.");
      const ids = new Set(), urls = new Set();
      const recipes = action.recipes.map((raw) => {
        const recipe = cleanRecipe(raw);
        if (!recipe.id || ["__proto__", "constructor", "prototype"].includes(recipe.id) || ids.has(recipe.id))
          throw new Error("Invalid or duplicate recipe ID.");
        if (text(raw.url) && !recipe.url) throw new Error("Invalid recipe link.");
        if (!text(raw.name) || !MEALS.includes(raw.mealType)) throw new Error("Each recipe needs a name and meal category.");
        const key = urlKey(recipe.url);
        if (key && urls.has(key)) throw new Error("Duplicate recipe link.");
        ids.add(recipe.id);
        if (key) urls.add(key);
        return recipe;
      });
      const week = {};
      for (const [id, selection] of Object.entries(action.week || {})) {
        if (!ids.has(id) || !MEALS.includes(selection?.mealType)) throw new Error("Invalid weekly recipe selection.");
        week[id] = { mealType: selection.mealType, servings: Math.max(1, Math.min(100, Number(selection.servings) || 2)) };
      }
      // Validate the entire replacement before changing any household state.
      Object.assign(state, { recipes, week, previousWeek: {}, weekCooked: {}, basket: {}, checks: {}, products: {}, jobs: [], applied: [] });
      break;
    }
    case "save": {
      const input = cleanRecipe(action.recipe);
      if (text(action.recipe.url) && !input.url) throw new Error("Please enter a valid recipe link.");
      if (!input.url && !text(action.recipe.name)) throw new Error("Enter a name for a recipe without a link.");
      const duplicate = state.recipes.find(
        (x) => input.url && x.id !== input.id && urlKey(x.url) === urlKey(input.url),
      );
      if (duplicate) throw new Error(`Already saved: ${duplicate.name}`);
      const old = state.recipes.find((x) => x.id === input.id);
      if (old) {
        if (action.revision !== old.revision)
          throw new Error(
            "This recipe changed on another device. Refresh before editing.",
          );
        Object.assign(old, input, { addedAt: old.addedAt || null, newDismissed: old.newDismissed || input.cooked, revision: old.revision + 1 });
      } else {
        if (
          !input.id ||
          ["__proto__", "constructor", "prototype"].includes(input.id)
        )
          throw new Error("Invalid recipe ID.");
        input.addedAt = Date.now();
        input.newDismissed = input.cooked;
        state.recipes.unshift(input);
      }
      break;
    }
    case "cooked":
      if (r) {
        r.cooked = Boolean(action.value);
        if (action.value) r.newDismissed = true;
        r.revision++;
      }
      break;
    case "weekCooked":
      if (r) {
        state.weekCooked[r.id] = Boolean(action.value);
        if (action.value) {
          r.cooked = true;
          r.newDismissed = true;
          r.revision++;
        }
      }
      break;
    case "plan":
      if (r) {
        if (action.value) r.newDismissed = true;
        state.week[r.id] = action.value
          ? {
              mealType: MEALS.includes(action.mealType)
                ? action.mealType
                : r.mealType,
              servings: Math.max(
                1,
                Math.min(100, Number(action.servings) || r.servings),
              ),
            }
          : undefined;
        if (!action.value) delete state.week[r.id];
      }
      break;
    case "basket":
      if (r) {
        if (action.value) {
          if (!r.ingredients.length)
            throw new Error("Import or enter ingredients first.");
          state.basket[r.id] = Math.max(
            1,
            Math.min(100, Number(action.servings) || r.servings),
          );
        } else delete state.basket[r.id];
      }
      break;
    case "clearBasket":
      state.basket = {};
      state.checks = {};
      break;
    case "check":
      if (basketItems(state).some((x) => x.key === action.key))
        state.checks[action.key] = {
          ...state.checks[action.key],
          [action.field === "have" ? "have" : "bought"]: Boolean(action.value),
        };
      break;
    case "accept":
      if (state.products[action.key])
        state.products[action.key].accepted = Boolean(action.value);
      break;
    case "newWeek":
      state.previousWeek = state.week;
      state.week = {};
      state.weekCooked = {};
      state.basket = {};
      state.checks = {};
      break;
    case "copyWeek":
      state.week = { ...state.previousWeek };
      break;
    case "delete":
      state.recipes = state.recipes.filter((x) => x.id !== action.recipeId);
      delete state.week[action.recipeId];
      delete state.basket[action.recipeId];
      break;
    case "migrate": {
      if (state.migrations.includes(action.device)) break;
      const legacy = action.legacy || {};
      const deleted = new Set(legacy.deleted || []);
      state.recipes = state.recipes.filter((x) => !deleted.has(x.id));
      for (const recipe of legacy.custom || []) {
        if (
          !state.recipes.some(
            (x) => x.id === recipe.id || (recipe.url && urlKey(x.url) === urlKey(recipe.url)),
          )
        )
          state.recipes.push(cleanRecipe(recipe));
      }
      for (const recipe of state.recipes) {
        if (legacy.edits?.[recipe.id])
          Object.assign(
            recipe,
            cleanRecipe({ ...recipe, ...legacy.edits[recipe.id] }),
          );
        if (typeof legacy.cooked?.[recipe.id] === "boolean")
          recipe.cooked = legacy.cooked[recipe.id];
      }
      for (const meal of MEALS)
        for (const id of legacy.week?.[meal] || [])
          if (state.recipes.some((x) => x.id === id))
            state.week[id] = { mealType: meal, servings: 2 };
      Object.assign(state.weekCooked, legacy.weekCooked || {});
      state.migrations.push(text(action.device));
      break;
    }
    default:
      throw new Error("Unknown action.");
  }
  if (["basket", "save", "delete", "migrate"].includes(action.type)) {
    const after = basketItems(state);
    for (const key of Object.keys(state.checks)) {
      const item = after.find((i) => i.key === key);
      if (
        !item ||
        beforeBasket.get(key) !==
          JSON.stringify([item.quantity, item.uncertain, item.recipes])
      )
        delete state.checks[key];
    }
  }
  return state;
}
