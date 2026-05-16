import Head from 'next/head';
import { useMemo, useState } from 'react';
import { COOKED_FILTERS, getRecipeTags, useRecipeStore } from '../../components/recipes/RecipeStore';
import {
  AddRecipeModal,
  AddToWeekDialog,
  CookedCheckbox,
  Favicon,
  GlassSection,
  RecipeShell,
  RecipeTitleLink,
} from '../../components/recipes/RecipeUi';

const sectionId = (id) => `recipe-section-${id}`;

export default function RecipeBoxPage() {
  const store = useRecipeStore();
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeToPlan, setRecipeToPlan] = useState(null);
  const [query, setQuery] = useState('');
  const [cookedFilter, setCookedFilter] = useState('all');
  const [openSections, setOpenSections] = useState({ breakfast: true, lunch: true, dinner: true });

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return store.groupedRecipes.map((group) => {
      const recipes = group.recipes.filter((recipe) => {
        const cooked = store.getCooked(recipe);
        const tags = getRecipeTags(recipe);
        const matchesCooked =
          cookedFilter === 'all' ||
          (cookedFilter === 'cooked' && cooked) ||
          (cookedFilter === 'uncooked' && !cooked);
        const matchesSearch =
          !normalizedQuery ||
          recipe.name.toLowerCase().includes(normalizedQuery) ||
          tags.some((tag) => tag.includes(normalizedQuery));

        return matchesCooked && matchesSearch;
      });

      return { ...group, recipes };
    });
  }, [cookedFilter, query, store]);

  const totalVisible = filteredGroups.reduce((sum, group) => sum + group.recipes.length, 0);

  const handleAddRecipe = (recipe) => {
    store.addCustomRecipe(recipe);
    setQuery('');
    setCookedFilter('all');
    setOpenSections((current) => ({ ...current, [recipe.mealType]: true }));
  };

  const handleEditRecipe = (recipe) => {
    store.updateRecipe(recipe.id, recipe);
    setQuery('');
    setCookedFilter('all');
    setOpenSections((current) => ({ ...current, [recipe.mealType]: true }));
  };

  const jumpToSection = (id) => {
    setOpenSections((current) => ({ ...current, [id]: true }));
    setTimeout(() => {
      document.getElementById(sectionId(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <>
      <Head>
        <title>Recipe Box | Martib</title>
      </Head>

      <RecipeShell activePage="box" onAddRecipe={() => setAddingRecipe(true)}>
        <GlassSection className="p-4">
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-base outline-none focus:border-emerald-600"
                placeholder="Search by recipe or tag"
              />
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {COOKED_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setCookedFilter(filter.id)}
                  className={`shrink-0 rounded-2xl px-3 py-2 text-sm font-semibold ${
                    cookedFilter === filter.id ? 'bg-stone-950/90 text-white' : 'bg-white/65 text-stone-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => jumpToSection(group.id)}
                  className="shrink-0 rounded-2xl bg-white/65 px-3 py-2 text-sm font-semibold text-stone-700"
                >
                  {group.section} · {group.recipes.length}
                </button>
              ))}
            </div>

            <p className="text-sm text-stone-500">{totalVisible} recipes shown</p>
          </div>
        </GlassSection>

        <div className="space-y-4">
          {filteredGroups.map(({ id, section, recipes }) => {
            const open = openSections[id];

            return (
              <GlassSection key={id} className="scroll-mt-4 overflow-hidden" id={sectionId(id)}>
                <button
                  type="button"
                  onClick={() => setOpenSections((current) => ({ ...current, [id]: !current[id] }))}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-stone-950">{section}</h2>
                    <p className="text-sm text-stone-500">{recipes.length} recipes</p>
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/65 text-xl text-stone-600">
                    {open ? '−' : '+'}
                  </span>
                </button>

                {open && (
                  <div className="divide-y divide-white/50 border-t border-white/45">
                    {recipes.length === 0 ? (
                      <p className="px-4 py-5 text-sm text-stone-500">No recipes match this filter.</p>
                    ) : (
                      recipes.map((recipe) => {
                        const cooked = store.getCooked(recipe);

                        return (
                          <article key={recipe.id} className="space-y-3 px-4 py-4">
                            <div className="flex min-w-0 items-start gap-3">
                              <CookedCheckbox
                                checked={cooked}
                                onChange={(checked) => store.setCooked(recipe.id, checked)}
                              />
                              <Favicon url={recipe.url} />
                              <RecipeTitleLink recipe={recipe} cooked={cooked} />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => setRecipeToPlan(recipe)}
                                className="rounded-2xl border border-emerald-700/45 bg-emerald-50/70 px-3 py-2 text-sm font-semibold text-emerald-800"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingRecipe(recipe)}
                                className="rounded-2xl border border-white/70 bg-white/65 px-3 py-2 text-sm font-semibold text-stone-700"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete ${recipe.name}?`)) store.deleteRecipe(recipe.id);
                                }}
                                className="rounded-2xl border border-red-200 bg-red-50/70 px-3 py-2 text-sm font-semibold text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                )}
              </GlassSection>
            );
          })}
        </div>

        <AddRecipeModal open={addingRecipe} onClose={() => setAddingRecipe(false)} onSubmit={handleAddRecipe} />
        <AddRecipeModal
          open={Boolean(editingRecipe)}
          onClose={() => setEditingRecipe(null)}
          onSubmit={handleEditRecipe}
          initialRecipe={editingRecipe}
        />
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
