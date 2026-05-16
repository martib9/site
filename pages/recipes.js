import Head from 'next/head';
import { useState } from 'react';
import { MEAL_TYPES } from '../data/recipes';
import { normalizeRecipeLink, useRecipeStore } from '../components/recipes/RecipeStore';
import { AddRecipeModal, CookedCheckbox, Favicon, GlassSection, RecipeShell, RecipeTitleLink, Toast } from '../components/recipes/RecipeUi';

const openRecipe = (url) => {
  const normalizedUrl = normalizeRecipeLink(url || '');
  if (normalizedUrl) window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
};

export default function RecipesWeekPage() {
  const store = useRecipeStore();
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  };

  const handleAddRecipe = (recipe) => {
    store.addCustomRecipe(recipe);
    showToast('Recipe Added');
  };

  return (
    <>
      <Head>
        <title>Recipes | Martib</title>
      </Head>

      <RecipeShell activePage="week" onAddRecipe={() => setAddingRecipe(true)}>
        <Toast message={toast} />
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {MEAL_TYPES.map((meal) => {
            const plannedRecipes = (store.weekPlan[meal.id] || [])
              .map((recipeId) => store.recipesById[recipeId])
              .filter(Boolean);

            return (
              <GlassSection key={meal.id} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-stone-200/80 px-4 py-3 dark:border-white/10">
                  <h2 className="text-lg font-semibold text-stone-950 dark:text-stone-50">{meal.label}</h2>
                  <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-600 dark:bg-white/10 dark:text-stone-200">
                    {plannedRecipes.length}
                  </span>
                </div>

                <div className="space-y-3 p-3">
                  {!store.hydrated ? (
                    <p className="rounded-3xl bg-stone-50 px-3 py-4 text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">Loading saved plan...</p>
                  ) : plannedRecipes.length === 0 ? (
                    <p className="rounded-3xl bg-stone-50 px-3 py-4 text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">Nothing planned yet.</p>
                  ) : (
                    plannedRecipes.map((recipe) => {
                      const cookedThisWeek = store.getWeekCooked(recipe.id);

                      return (
                      <article
                        key={recipe.id}
                        role="link"
                        tabIndex={0}
                        onClick={() => openRecipe(recipe.url)}
                        onKeyDown={(event) => {
                          if ((event.key === 'Enter' || event.key === ' ') && recipe.url) {
                            event.preventDefault();
                            openRecipe(recipe.url);
                          }
                        }}
                        className="group flex cursor-pointer items-start gap-3 rounded-3xl border border-stone-200 bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/70 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      >
                        <CookedCheckbox
                          checked={cookedThisWeek}
                          onChange={(checked) => store.setCookedThisWeek(recipe.id, checked)}
                        />
                        <Favicon url={recipe.url} />
                        <RecipeTitleLink recipe={recipe} cooked={cookedThisWeek} strike />
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            store.removeFromWeek(recipe.id, meal.id);
                          }}
                          className="rounded-2xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-bold text-red-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-100 hover:shadow-lg hover:shadow-red-900/10 dark:border-red-300/25 dark:bg-red-400/10 dark:text-red-200"
                        >
                          Remove
                        </button>
                      </article>
                      );
                    })
                  )}
                </div>
              </GlassSection>
            );
          })}
        </section>

        <AddRecipeModal open={addingRecipe} onClose={() => setAddingRecipe(false)} onSubmit={handleAddRecipe} />
      </RecipeShell>
    </>
  );
}
