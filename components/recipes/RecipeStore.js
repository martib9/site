import { useEffect, useMemo, useState } from 'react';
import { INITIAL_WEEK_PLAN, MEAL_TYPES, SEED_RECIPES, STORAGE_KEYS } from '../../data/recipes';

export const COOKED_FILTERS = [
  { id: 'all', label: 'Show all' },
  { id: 'uncooked', label: 'Show uncooked' },
  { id: 'cooked', label: 'Show all cooked' },
];

export const NEW_RECIPE_MS = 48 * 60 * 60 * 1000;

const mealLabels = Object.fromEntries(MEAL_TYPES.map((meal) => [meal.id, meal.label]));
const extraStorageKeys = {
  recipeEdits: 'martib_recipes_edits',
  deletedRecipes: 'martib_recipes_deleted',
  weekCooked: 'martib_week_cooked',
};

const tagRules = [
  { tag: 'soup', words: ['soup', 'суп', 'рассольник', 'матбуха', 'lohikeitto'] },
  { tag: 'salad', words: ['salad', 'салат'] },
  { tag: 'fish', words: ['fish', 'salmon', 'shrimp', 'tuna', 'seafood', 'рыб', 'лосос', 'семг', 'кревет', 'тунец', 'дорада', 'сардин'] },
  { tag: 'meat', words: ['chicken', 'beef', 'turkey', 'meat', 'shawarma', 'kebab', 'котлет', 'куриц', 'индей', 'говяд', 'мяс', 'фарш', 'кебаб', 'гуляш', 'тефтел', 'митбол', 'бефстроганов'] },
];

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

const customTimestamp = (recipe) => Number(String(recipe.id).split('-').pop()) || 0;

const normalizeTags = (tags) => {
  const rawTags = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return [...new Set(rawTags
    .map((tag) => tag.trim().replace(/^#/, '').toLowerCase())
    .filter(Boolean))];
};

export function inferRecipeTags(recipe) {
  const haystack = `${recipe.name || ''} ${recipe.section || ''}`.toLowerCase();
  const tags = tagRules
    .filter((rule) => rule.words.some((word) => haystack.includes(word)))
    .map((rule) => rule.tag);

  return normalizeTags(tags);
}

export function getRecipeTags(recipe) {
  return normalizeTags([...(inferRecipeTags(recipe)), ...(recipe.tags || [])]);
}

export function isNewRecipe(recipe) {
  return Boolean(recipe.isCustom && Date.now() - customTimestamp(recipe) < NEW_RECIPE_MS);
}

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
  const [recipeEdits, setRecipeEdits] = useState({});
  const [deletedRecipeIds, setDeletedRecipeIds] = useState([]);
  const [cookedOverrides, setCookedOverrides] = useState({});
  const [weekCooked, setWeekCooked] = useState({});
  const [weekPlan, setWeekPlan] = useState(fallbackWeekPlan);

  useEffect(() => {
    setCustomRecipes(readJson(STORAGE_KEYS.customRecipes, []));
    setRecipeEdits(readJson(extraStorageKeys.recipeEdits, {}));
    setDeletedRecipeIds(readJson(extraStorageKeys.deletedRecipes, []));
    setCookedOverrides(readJson(STORAGE_KEYS.cookedRecipes, {}));
    setWeekCooked(readJson(extraStorageKeys.weekCooked, {}));
    setWeekPlan(normalizeWeekPlan(readJson(STORAGE_KEYS.weekPlan, null)));
    setHydrated(true);
  }, []);

  const recipes = useMemo(() => {
    const deletedSet = new Set(deletedRecipeIds);
    const normalizedSeeds = SEED_RECIPES
      .filter((recipe) => !deletedSet.has(recipe.id))
      .map((recipe) => {
        const editedRecipe = { ...recipe, ...(recipeEdits[recipe.id] || {}) };

        return {
          ...editedRecipe,
          mealType: editedRecipe.mealType || editedRecipe.defaultMealType,
          defaultMealType: editedRecipe.mealType || editedRecipe.defaultMealType,
          tags: getRecipeTags(editedRecipe),
          isCustom: false,
          isNew: false,
        };
      });

    const normalizedCustom = customRecipes.map((recipe) => ({
      ...recipe,
      mealType: recipe.mealType || recipe.defaultMealType || 'lunch',
      defaultMealType: recipe.mealType || recipe.defaultMealType || 'lunch',
      section: recipe.section || mealLabels[recipe.mealType || recipe.defaultMealType || 'lunch'],
      tags: getRecipeTags(recipe),
      cooked: Boolean(recipe.cooked),
      isCustom: true,
      isNew: isNewRecipe(recipe),
    }));

    return [...normalizedSeeds, ...normalizedCustom];
  }, [customRecipes, deletedRecipeIds, recipeEdits]);

  const recipesById = useMemo(() => {
    return Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
  }, [recipes]);

  const getCooked = (recipe) => cookedOverrides[recipe.id] ?? recipe.cooked;
  const getWeekCooked = (recipeId) => Boolean(weekCooked[recipeId]);

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

  const setCookedThisWeek = (recipeId, cooked) => {
    const recipe = recipesById[recipeId];
    if (!recipe) return;

    setWeekCooked((current) => {
      const next = { ...current };
      if (cooked) {
        next[recipeId] = true;
      } else {
        delete next[recipeId];
      }
      writeJson(extraStorageKeys.weekCooked, next);
      return next;
    });

    if (cooked && !getCooked(recipe)) {
      setCooked(recipeId, true);
    }
  };

  const persistCustomRecipes = (updater) => {
    setCustomRecipes((current) => {
      const next = updater(current);
      writeJson(STORAGE_KEYS.customRecipes, next);
      return next;
    });
  };

  const persistRecipeEdits = (updater) => {
    setRecipeEdits((current) => {
      const next = updater(current);
      writeJson(extraStorageKeys.recipeEdits, next);
      return next;
    });
  };

  const persistDeletedRecipes = (updater) => {
    setDeletedRecipeIds((current) => {
      const next = updater(current);
      writeJson(extraStorageKeys.deletedRecipes, next);
      return next;
    });
  };

  const addCustomRecipe = ({ name, mealType, url, tags = [] }) => {
    const recipe = {
      id: makeCustomId(name),
      name: name.trim(),
      url: url.trim(),
      section: mealLabels[mealType],
      mealType,
      defaultMealType: mealType,
      tags: normalizeTags(tags),
      cooked: false,
      isNew: true,
    };

    persistCustomRecipes((current) => [recipe, ...current]);

    return recipe;
  };

  const updateRecipe = (recipeId, changes) => {
    const normalizedUrl = normalizeRecipeLink(changes.url || '');
    if (!normalizedUrl) return null;

    const recipe = recipesById[recipeId];
    if (!recipe) return null;

    const nextRecipe = {
      name: changes.name.trim(),
      url: normalizedUrl,
      mealType: changes.mealType,
      defaultMealType: changes.mealType,
      section: mealLabels[changes.mealType],
      tags: normalizeTags(changes.tags),
    };

    if (recipe.isCustom) {
      persistCustomRecipes((current) => current.map((customRecipe) => (
        customRecipe.id === recipeId ? { ...customRecipe, ...nextRecipe } : customRecipe
      )));
    } else {
      persistRecipeEdits((current) => ({
        ...current,
        [recipeId]: nextRecipe,
      }));
    }

    return nextRecipe;
  };

  const deleteRecipe = (recipeId) => {
    const recipe = recipesById[recipeId];
    if (!recipe) return;

    if (recipe.isCustom) {
      persistCustomRecipes((current) => current.filter((customRecipe) => customRecipe.id !== recipeId));
    } else {
      persistDeletedRecipes((current) => [...new Set([...current, recipeId])]);
      persistRecipeEdits((current) => {
        const next = { ...current };
        delete next[recipeId];
        return next;
      });
    }

    setWeekPlan((current) => {
      const next = normalizeWeekPlan(current);
      MEAL_TYPES.forEach(({ id }) => {
        next[id] = next[id].filter((plannedId) => plannedId !== recipeId);
      });
      writeJson(STORAGE_KEYS.weekPlan, next);
      return next;
    });
    setCookedOverrides((current) => {
      const next = { ...current };
      delete next[recipeId];
      writeJson(STORAGE_KEYS.cookedRecipes, next);
      return next;
    });
    setWeekCooked((current) => {
      const next = { ...current };
      delete next[recipeId];
      writeJson(extraStorageKeys.weekCooked, next);
      return next;
    });
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
    return MEAL_TYPES.map((meal) => ({
      id: meal.id,
      section: meal.label,
      recipes: recipes
        .filter((recipe) => recipe.defaultMealType === meal.id || recipe.mealType === meal.id)
        .sort((a, b) => (
          Number(b.isCustom) - Number(a.isCustom) ||
          customTimestamp(b) - customTimestamp(a) ||
          a.name.localeCompare(b.name)
        )),
    }));
  }, [recipes]);

  return {
    hydrated,
    recipes,
    recipesById,
    groupedRecipes,
    weekPlan,
    getCooked,
    getWeekCooked,
    setCooked,
    setCookedThisWeek,
    addCustomRecipe,
    updateRecipe,
    deleteRecipe,
    addToWeek,
    removeFromWeek,
  };
}
