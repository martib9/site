import Head from 'next/head';
import { useState } from 'react';
import { MEAL_TYPES } from '../data/recipes';
import { useRecipeStore } from '../components/recipes/RecipeStore';
import { AddRecipeModal, CookedCheckbox, Favicon, GlassSection, RecipeShell, RecipeTitleLink, Toast } from '../components/recipes/RecipeUi';

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
                <div className="flex items-center justify-between border-b border-white/45 px-4 py-3">
                  <h2 className="text-lg font-semibold text-stone-950">{meal.label}</h2>
                  <span className="rounded-full bg-white/65 px-2 py-1 text-xs font-semibold text-stone-600">
                    {plannedRecipes.length}
                  </span>
                </div>

                <div className="space-y-3 p-3">
                  {!store.hydrated ? (
                    <p className="rounded-3xl bg-white/45 px-3 py-4 text-sm text-stone-500">Loading saved plan...</p>
                  ) : plannedRecipes.length === 0 ? (
                    <p className="rounded-3xl bg-white/45 px-3 py-4 text-sm text-stone-500">Nothing planned yet.</p>
                  ) : (
                    plannedRecipes.map((recipe) => {
                      const cookedThisWeek = store.getWeekCooked(recipe.id);

                      return (
                      <article
                        key={recipe.id}
                        role="link"
                        tabIndex={0}
                        onClick={() => recipe.url && window.open(recipe.url, '_blank', 'noreferrer')}
                        onKeyDown={(event) => {
                          if ((event.key === 'Enter' || event.key === ' ') && recipe.url) {
                            window.open(recipe.url, '_blank', 'noreferrer');
                          }
                        }}
                        className="group flex cursor-pointer items-start gap-3 rounded-3xl border border-white/65 bg-white/45 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/70 hover:bg-white/70 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
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
