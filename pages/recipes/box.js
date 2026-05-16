import Head from 'next/head';
import { useMemo, useState } from 'react';
import { COOKED_FILTERS, getRecipeTags, useRecipeStore } from '../../components/recipes/RecipeStore';
import {
  AddRecipeModal,
  CookedCheckbox,
  Favicon,
  GlassSection,
  RecipeShell,
  RecipeTitleLink,
  Toast,
} from '../../components/recipes/RecipeUi';

const sectionId = (id) => `recipe-section-${id}`;

export default function RecipeBoxPage() {
  const store = useRecipeStore();
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [query, setQuery] = useState('');
  const [cookedFilter, setCookedFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [openSections, setOpenSections] = useState({ breakfast: true, lunch: true, dinner: true });
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  };

  const availableTags = useMemo(() => {
    const tags = new Set();
    store.recipes.forEach((recipe) => {
      getRecipeTags(recipe).forEach((tag) => tags.add(tag));
    });
    return [...tags].sort();
  }, [store.recipes]);

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return store.groupedRecipes.map((group) => {
      const recipes = group.recipes.filter((recipe) => {
        const cooked = store.getCooked(recipe);
        const tags = getRecipeTags(recipe);
        const matchesTag =
          !tagFilter ||
          (tagFilter === 'new' && recipe.isNew) ||
          tags.includes(tagFilter);
        const matchesCooked =
          cookedFilter === 'all' ||
          (cookedFilter === 'cooked' && cooked) ||
          (cookedFilter === 'uncooked' && !cooked);
        const matchesSearch =
          !normalizedQuery ||
          recipe.name.toLowerCase().includes(normalizedQuery) ||
          tags.some((tag) => tag.includes(normalizedQuery));

        return matchesTag && matchesCooked && matchesSearch;
      });

      return { ...group, recipes };
    });
  }, [cookedFilter, query, store, tagFilter]);

  const totalVisible = filteredGroups.reduce((sum, group) => sum + group.recipes.length, 0);

  const handleAddRecipe = (recipe) => {
    store.addCustomRecipe(recipe);
    setQuery('');
    setCookedFilter('all');
    setTagFilter('');
    setOpenSections((current) => ({ ...current, [recipe.mealType]: true }));
    showToast('Recipe Added');
  };

  const handleEditRecipe = (recipe) => {
    store.updateRecipe(recipe.id, recipe);
    setQuery('');
    setCookedFilter('all');
    setTagFilter('');
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
        <Toast message={toast} />
        <GlassSection className="sticky top-3 z-30 p-4">
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">Search</span>
              <div className="mt-1 flex items-center gap-2 rounded-[24px] border border-emerald-300/70 bg-white/85 px-4 py-3 shadow-inner shadow-emerald-100/50 dark:border-emerald-300/20 dark:bg-white/10 dark:shadow-none">
                <span className="text-lg" aria-hidden="true">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-stone-400 dark:text-stone-50"
                  placeholder="Search by recipe or tag"
                />
              </div>
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {COOKED_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setCookedFilter(filter.id)}
                  className={`shrink-0 rounded-2xl px-3 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                    cookedFilter === filter.id ? 'bg-stone-950/90 text-white dark:bg-white/85 dark:text-stone-950' : 'bg-white/65 text-stone-700 dark:bg-white/10 dark:text-stone-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setTagFilter(tagFilter === 'new' ? '' : 'new')}
                className={`shrink-0 rounded-2xl px-3 py-2 text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5 ${
                  tagFilter === 'new' ? 'bg-emerald-700 text-white' : 'bg-emerald-50/80 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100'
                }`}
              >
                New
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
                  className={`shrink-0 rounded-2xl px-3 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                    tagFilter === tag ? 'bg-emerald-700 text-white' : 'bg-white/65 text-emerald-800 dark:bg-white/10 dark:text-emerald-100'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => jumpToSection(group.id)}
                  className="shrink-0 rounded-2xl bg-white/65 px-3 py-2 text-sm font-semibold text-stone-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white/85 dark:bg-white/10 dark:text-stone-100"
                >
                  {group.section} · {group.recipes.length}
                </button>
              ))}
            </div>

            <p className="text-sm text-stone-500 dark:text-stone-400">{totalVisible} recipes shown</p>
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
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition duration-200 hover:bg-white/30 dark:hover:bg-white/5"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-stone-950 dark:text-stone-50">{section}</h2>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{recipes.length} recipes</p>
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/65 text-xl text-stone-600 transition duration-200 dark:bg-white/10 dark:text-stone-200">
                    {open ? '−' : '+'}
                  </span>
                </button>

                <div className="recipe-accordion" data-open={open ? 'true' : 'false'}>
                  <div className="divide-y divide-white/50 border-t border-white/45">
                    {recipes.length === 0 ? (
                      <p className="px-4 py-5 text-sm text-stone-500 dark:text-stone-400">No recipes match this filter.</p>
                    ) : (
                      recipes.map((recipe) => {
                        const cooked = store.getCooked(recipe);

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
                            className="group cursor-pointer space-y-3 px-4 py-4 transition duration-200 hover:bg-white/35 dark:hover:bg-white/5"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              <CookedCheckbox
                                checked={cooked}
                                onChange={(checked) => store.setCooked(recipe.id, checked)}
                              />
                              <Favicon url={recipe.url} />
                              <RecipeTitleLink
                                recipe={recipe}
                                cooked={cooked}
                                onTagClick={(tag) => {
                                  setTagFilter(tag);
                                  setQuery('');
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  store.addToWeek(recipe.id, recipe.mealType || recipe.defaultMealType);
                                  showToast('Recipe added to the week');
                                }}
                                className="rounded-2xl border border-emerald-700/45 bg-emerald-50/70 px-3 py-2 text-sm font-semibold text-emerald-800 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-emerald-100 hover:shadow-lg hover:shadow-emerald-900/10 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setEditingRecipe(recipe);
                                }}
                                className="rounded-2xl border border-stone-300 bg-white/65 px-3 py-2 text-sm font-semibold text-stone-700 transition duration-200 hover:-translate-y-0.5 hover:border-stone-500 hover:bg-white hover:shadow-lg dark:border-white/25 dark:bg-white/10 dark:text-stone-100 dark:hover:bg-white/15"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  if (window.confirm(`Delete ${recipe.name}?`)) store.deleteRecipe(recipe.id);
                                }}
                                className="rounded-2xl border border-red-200 bg-red-50/70 px-3 py-2 text-sm font-semibold text-red-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-100 hover:shadow-lg hover:shadow-red-900/10 dark:border-red-300/25 dark:bg-red-400/10 dark:text-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
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
      </RecipeShell>
    </>
  );
}
