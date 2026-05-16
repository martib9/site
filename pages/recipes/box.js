import Head from 'next/head';
import { useState } from 'react';
import { useRecipeStore } from '../../components/recipes/RecipeStore';
import {
  AddRecipeModal,
  AddToWeekDialog,
  CookedCheckbox,
  Favicon,
  RecipeShell,
  RecipeTitleLink,
} from '../../components/recipes/RecipeUi';

export default function RecipeBoxPage() {
  const store = useRecipeStore();
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [recipeToPlan, setRecipeToPlan] = useState(null);

  const handleAddRecipe = (recipe) => {
    store.addCustomRecipe(recipe);
  };

  return (
    <>
      <Head>
        <title>Recipe Box | Martib</title>
      </Head>

      <RecipeShell activePage="box" onAddRecipe={() => setAddingRecipe(true)}>
        <div className="space-y-5">
          {store.groupedRecipes.map(({ section, recipes }) => (
            <section key={section} className="rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
                <h2 className="text-lg font-semibold text-stone-950">{section}</h2>
                <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
                  {recipes.length}
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {recipes.map((recipe) => (
                  <article key={recipe.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <CookedCheckbox
                        checked={store.getCooked(recipe)}
                        onChange={(checked) => store.setCooked(recipe.id, checked)}
                      />
                      <Favicon url={recipe.url} />
                      <RecipeTitleLink recipe={recipe} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setRecipeToPlan(recipe)}
                      className="w-full rounded-md border border-emerald-700 px-3 py-2 text-sm font-medium text-emerald-800 sm:w-auto"
                    >
                      Add to week
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <AddRecipeModal open={addingRecipe} onClose={() => setAddingRecipe(false)} onSubmit={handleAddRecipe} />
        <AddToWeekDialog
          recipe={recipeToPlan}
          open={Boolean(recipeToPlan)}
          onClose={() => setRecipeToPlan(null)}
          onAdd={store.addToWeek}
        />
      </RecipeShell>
    </>
  );
}
