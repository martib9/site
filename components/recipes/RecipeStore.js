import { useEffect, useMemo, useState } from 'react';
import { INITIAL_WEEK_PLAN, MEAL_TYPES, SECTION_ORDER, SEED_RECIPES, STORAGE_KEYS } from '../../data/recipes';

const customSectionByMeal = {
  breakfast: 'Added Recipes: Breakfast',
  lunch: 'Added Recipes: Lunch',
  dinner: 'Added Recipes: Dinner',
};

const fallbackWeekPlan = () => ({
  breakfast: [...INITIAL_WEEK_PLAN.breakfast],
  lunch: [...INITIAL_WEEK_PLAN.lunch],
  dinner: [...INITIAL_WEEK_PLAN.dinner],
});

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const normalizeWeekPlan = (value) => {
  const base = fallbackWeekPlan();

  MEAL_TYPES.forEach(({ id }) => {
    if (Array.isArray(value?.[id])) {
      base[id] = value[id];
    }
  });

  return base;
};

const makeCustomId = (name) => {
  const slug = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'recipe';

  return `custom-${slug}-${Date.now()}`;
};

export function validateRecipeLink(value) {
  return Boolean(normalizeRecipeLink(value));
}

export function normalizeRecipeLink(value) {
  const trimmed = value.trim();
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const isWebLink = url.protocol === 'http:' || url.protocol === 'https:';
    const hasDomain = url.hostname.includes('.') && !url.hostname.startsWith('.') && !url.hostname.endsWith('.');

    return isWebLink && hasDomain ? url.toString() : '';
  } catch {
    return '';
  }
}

export function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function useRecipeStore() {
  const [hydrated, setHydrated] = useState(false);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [cookedOverrides, setCookedOverrides] = useState({});
  const [weekPlan, setWeekPlan] = useState(fallbackWeekPlan);

  useEffect(() => {
    setCustomRecipes(readJson(STORAGE_KEYS.customRecipes, []));
    setCookedOverrides(readJson(STORAGE_KEYS.cookedRecipes, {}));
    setWeekPlan(normalizeWeekPlan(readJson(STORAGE_KEYS.weekPlan, null)));
    setHydrated(true);
  }, []);

  const recipes = useMemo(() => [...SEED_RECIPES, ...customRecipes], [customRecipes]);

  const recipesById = useMemo(() => {
    return Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
  }, [recipes]);

  const getCooked = (recipe) => cookedOverrides[recipe.id] ?? recipe.cooked;

  const setCooked = (recipeId, cooked) => {
    const recipe = recipesById[recipeId];
    if (!recipe) return;

    setCookedOverrides((current) => {
      const next = { ...current };
      if (recipe.cooked === cooked) {
        delete next[recipeId];
      } else {
        next[recipeId] = cooked;
      }
      writeJson(STORAGE_KEYS.cookedRecipes, next);
      return next;
    });
  };

  const addCustomRecipe = ({ name, mealType, url }) => {
    const recipe = {
      id: makeCustomId(name),
      name: name.trim(),
      url: url.trim(),
      section: customSectionByMeal[mealType],
      defaultMealType: mealType,
      cooked: false,
    };

    setCustomRecipes((current) => {
      const next = [...current, recipe];
      writeJson(STORAGE_KEYS.customRecipes, next);
      return next;
    });

    return recipe;
  };

  const addToWeek = (recipeId, mealType) => {
    setWeekPlan((current) => {
      const next = normalizeWeekPlan(current);
      if (!next[mealType].includes(recipeId)) {
        next[mealType] = [...next[mealType], recipeId];
      }
      writeJson(STORAGE_KEYS.weekPlan, next);
      return next;
    });
  };

  const removeFromWeek = (recipeId, mealType) => {
    setWeekPlan((current) => {
      const next = normalizeWeekPlan(current);
      next[mealType] = next[mealType].filter((id) => id !== recipeId);
      writeJson(STORAGE_KEYS.weekPlan, next);
      return next;
    });
  };

  const groupedRecipes = useMemo(() => {
    const groups = new Map();
    recipes.forEach((recipe) => {
      if (!groups.has(recipe.section)) groups.set(recipe.section, []);
      groups.get(recipe.section).push(recipe);
    });

    const customSections = [...groups.keys()].filter((section) => !SECTION_ORDER.includes(section));
    return [...SECTION_ORDER, ...customSections]
      .filter((section) => groups.has(section))
      .map((section) => ({
        section,
        recipes: groups.get(section),
      }));
  }, [recipes]);

  return {
    hydrated,
    recipes,
    recipesById,
    groupedRecipes,
    weekPlan,
    getCooked,
    setCooked,
    addCustomRecipe,
    addToWeek,
    removeFromWeek,
  };
}
