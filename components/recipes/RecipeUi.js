import { useState } from 'react';
import { MEAL_TYPES } from '../../data/recipes';
import { getDomain, normalizeRecipeLink } from './RecipeStore';

export function RecipeShell({ activePage, children, onAddRecipe }) {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-stone-500">Recipe planner</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
              {activePage === 'box' ? 'Recipe box' : 'Plan for the week'}
            </h1>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <a
              href="/recipes"
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                activePage === 'week' ? 'bg-stone-950 text-white' : 'border border-stone-300 bg-white text-stone-700'
              }`}
            >
              Week
            </a>
            <a
              href="/recipes/box"
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                activePage === 'box' ? 'bg-stone-950 text-white' : 'border border-stone-300 bg-white text-stone-700'
              }`}
            >
              Recipe Box
            </a>
            <button
              type="button"
              onClick={onAddRecipe}
              className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white"
            >
              Add Recipe
            </button>
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}

export function Favicon({ url }) {
  const [fallback, setFallback] = useState(0);
  const domain = getDomain(url);

  if (!domain) {
    return <span className="grid h-7 w-7 place-items-center rounded-md bg-stone-200 text-xs font-semibold text-stone-600">?</span>;
  }

  const directIcon = `https://${domain}/favicon.ico`;
  const serviceIcon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;

  if (fallback > 1) {
    return (
      <span className="grid h-7 w-7 place-items-center rounded-md bg-stone-200 text-xs font-semibold uppercase text-stone-600">
        {domain[0]}
      </span>
    );
  }

  return (
    <img
      src={fallback === 0 ? directIcon : serviceIcon}
      alt=""
      className="h-7 w-7 rounded-md border border-stone-200 bg-white object-contain p-1"
      onError={() => setFallback((value) => value + 1)}
    />
  );
}

export function CookedCheckbox({ checked, onChange }) {
  return (
    <label className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-emerald-700"
        aria-label={checked ? 'Mark as not cooked' : 'Mark as cooked'}
      />
    </label>
  );
}

export function RecipeTitleLink({ recipe }) {
  const domain = getDomain(recipe.url);

  return (
    <div className="min-w-0 flex-1">
      <p className="break-words text-sm font-medium leading-5 text-stone-950">{recipe.name}</p>
      {recipe.url ? (
        <a
          href={recipe.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block truncate text-xs text-stone-500 underline decoration-stone-300 underline-offset-2"
        >
          {domain || recipe.url}
        </a>
      ) : (
        <p className="mt-1 text-xs text-stone-500">No link saved</p>
      )}
    </div>
  );
}

export function AddRecipeModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName) {
      setError('Add a recipe name.');
      return;
    }

    const normalizedUrl = normalizeRecipeLink(trimmedUrl);

    if (!normalizedUrl) {
      setError('Add a link, for example test.com or https://test.com.');
      return;
    }

    onSubmit({ name: trimmedName, mealType, url: normalizedUrl });
    setName('');
    setMealType('lunch');
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <Modal title="Add recipe" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base outline-none focus:border-emerald-700"
            placeholder="Chicken salad"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Type of meal</span>
          <select
            value={mealType}
            onChange={(event) => setMealType(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base outline-none focus:border-emerald-700"
          >
            {MEAL_TYPES.map((meal) => (
              <option key={meal.id} value={meal.id}>{meal.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Link</span>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base outline-none focus:border-emerald-700"
            placeholder="test.com or https://..."
          />
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function AddToWeekDialog({ recipe, open, onClose, onAdd }) {
  if (!open || !recipe) return null;

  return (
    <Modal title="Add to week" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-md bg-stone-100 p-3">
          <Favicon url={recipe.url} />
          <RecipeTitleLink recipe={recipe} />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {MEAL_TYPES.map((meal) => (
            <button
              key={meal.id}
              type="button"
              onClick={() => {
                onAdd(recipe.id, meal.id);
                onClose();
              }}
              className="rounded-md border border-stone-300 bg-white px-3 py-3 text-sm font-medium text-stone-800"
            >
              {meal.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/30 px-4 py-4 sm:items-center">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-stone-300 text-lg leading-none text-stone-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
