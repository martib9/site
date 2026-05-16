import Head from 'next/head';
import { useState } from 'react';
import { MEAL_TYPES } from '../data/recipes';
import { useRecipeStore } from '../components/recipes/RecipeStore';
import { AddRecipeModal, CookedCheckbox, Favicon, RecipeShell, RecipeTitleLink } from '../components/recipes/RecipeUi';

export default function RecipesWeekPage() {
  const store = useRecipeStore();
  const [addingRecipe, setAddingRecipe] = useState(false);

  const handleAddRecipe = (recipe) => {
    store.addCustomRecipe(recipe);
  };

  return (
    <>
      <Head>
        <title>Recipes | Martib</title>
      </Head>

      <RecipeShell activePage="week" onAddRecipe={() => setAddingRecipe(true)}>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {MEAL_TYPES.map((meal) => {
            const plannedRecipes = (store.weekPlan[meal.id] || [])
              .map((recipeId) => store.recipesById[recipeId])
              .filter(Boolean);

            return (
              <div key={meal.id} className="rounded-lg border border-stone-200 bg-white">
                <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
                  <h2 className="text-lg font-semibold text-stone-950">{meal.label}</h2>
                  <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
                    {plannedRecipes.length}
                  </span>
                </div>

                <div className="space-y-3 p-3">
                  {!store.hydrated ? (
                    <p className="rounded-md bg-stone-50 px-3 py-4 text-sm text-stone-500">Loading saved plan...</p>
                  ) : plannedRecipes.length === 0 ? (
                    <p className="rounded-md bg-stone-50 px-3 py-4 text-sm text-stone-500">Nothing planned yet.</p>
                  ) : (
                    plannedRecipes.map((recipe) => (
                      <article key={recipe.id} className="flex items-start gap-3 rounded-md border border-stone-200 p-3">
                        <CookedCheckbox
                          checked={store.getCooked(recipe)}
                          onChange={(checked) => store.setCooked(recipe.id, checked)}
                        />
                        <Favicon url={recipe.url} />
                        <RecipeTitleLink recipe={recipe} />
                        <button
                          type="button"
                          onClick={() => store.removeFromWeek(recipe.id, meal.id)}
                          className="rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-600"
                        >
                          Remove
                        </button>
                      </article>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <AddRecipeModal open={addingRecipe} onClose={() => setAddingRecipe(false)} onSubmit={handleAddRecipe} />
      </RecipeShell>
    </>
  );
}
