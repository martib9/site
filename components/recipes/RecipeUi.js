import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MEAL_TYPES } from '../../data/recipes';
import { getDomain, getRecipeTags, getTagEmoji, normalizeRecipeLink } from './RecipeStore';

const glassPanel = 'border border-white/70 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-stone-950/78 dark:shadow-black/30';
const solidPanel = 'border border-stone-200/80 bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-stone-950/78 dark:shadow-black/20';
const buttonMotion = 'transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0';
const themeStorageKey = 'martib_recipes_theme';

export function RecipeShell({ activePage, children, onAddRecipe }) {
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(savedTheme || systemTheme);
    router.prefetch('/recipes');
    router.prefetch('/recipes/box');
  }, [router]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    window.localStorage.setItem(themeStorageKey, nextTheme);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <main className="min-h-screen bg-[#f7f7f4] pb-28 text-stone-950 transition-colors duration-500 dark:bg-[#10100f] dark:text-stone-50">
        <RecipeMotionStyles />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <header className={`${solidPanel} rounded-[24px] px-5 py-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Recipe planner</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl dark:text-stone-50">
                  {activePage === 'box' ? 'Recipe box' : 'Plan for the week'}
                </h1>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`${buttonMotion} shrink-0 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700 dark:border-white/10 dark:bg-white/10 dark:text-stone-100`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? '☀︎' : '☾'}
              </button>
            </div>
          </header>

          <div className="recipe-page-swipe">
            {children}
          </div>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
          <div className={`${glassPanel} mx-auto grid max-w-md grid-cols-3 gap-2 rounded-[26px] bg-white/55 p-2 supports-[backdrop-filter]:bg-white/45 dark:bg-stone-950/55`}>
            <BottomNavItem active={activePage === 'week'} href="/recipes" label="Week" />
            <BottomNavItem active={activePage === 'box'} href="/recipes/box" label="Recipe Box" />
            <button
              type="button"
              onClick={onAddRecipe}
              className={`${buttonMotion} rounded-[20px] bg-emerald-700 px-3 py-3 text-3xl font-semibold leading-none text-white shadow-lg shadow-emerald-900/15 dark:bg-emerald-500 dark:text-stone-950`}
              aria-label="Add Recipe"
              title="Add Recipe"
            >
              +
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

function BottomNavItem({ active, href, label }) {
  return (
    <Link
      href={href}
      prefetch
      className={`rounded-[20px] px-3 py-3 text-center text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        active ? 'bg-stone-950/90 text-white shadow-lg shadow-stone-950/15 dark:bg-white/85 dark:text-stone-950' : 'text-stone-700 dark:text-stone-200'
      }`}
    >
      {label}
    </Link>
  );
}

export function GlassSection({ children, className = '', ...props }) {
  return <section className={`${solidPanel} rounded-[24px] ${className}`} {...props}>{children}</section>;
}

export function StickyGlassSection({ children, className = '', ...props }) {
  return <section className={`${glassPanel} rounded-[24px] ${className}`} {...props}>{children}</section>;
}

export function Favicon({ url }) {
  const [fallback, setFallback] = useState(0);
  const domain = getDomain(url);

  if (!domain) {
    return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-white/70 text-xs font-semibold text-stone-500 dark:bg-white/10 dark:text-stone-300">?</span>;
  }

  const directIcon = `https://${domain}/favicon.ico`;
  const serviceIcon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;

  if (fallback > 1) {
    return (
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-white/70 text-xs font-semibold uppercase text-stone-600 dark:bg-white/10 dark:text-stone-300">
        {domain[0]}
      </span>
    );
  }

  return (
    <img
      src={fallback === 0 ? directIcon : serviceIcon}
      alt=""
      className="h-8 w-8 shrink-0 rounded-2xl border border-white/70 bg-white/75 object-contain p-1 dark:border-white/10 dark:bg-white/10"
      onError={() => setFallback((value) => value + 1)}
    />
  );
}

export function CookedCheckbox({ checked, onChange }) {
  return (
    <label
      className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/80 bg-white/65 shadow-inner shadow-white/60 dark:border-white/10 dark:bg-white/10"
      onClick={(event) => event.stopPropagation()}
    >
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

export function RecipeTitleLink({ recipe, cooked = false, showTags = true, strike = false, onTagClick }) {
  const domain = getDomain(recipe.url);
  const tags = getRecipeTags(recipe);

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className={`break-words text-sm font-semibold leading-5 text-stone-950 dark:text-stone-50 ${cooked && strike ? 'line-through decoration-2 opacity-55' : ''}`}>
          {recipe.name}
        </p>
        {recipe.isNew && (
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-200">
            New
          </span>
        )}
      </div>

      {recipe.url ? (
        <a
          href={recipe.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="mt-1 block truncate text-xs text-stone-500 underline decoration-stone-300 underline-offset-2 dark:text-stone-400"
        >
          {domain || recipe.url}
        </a>
      ) : (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">No link saved</p>
      )}

      {showTags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onTagClick?.(tag);
              }}
              className={`${buttonMotion} rounded-full border border-emerald-500/25 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100`}
            >
              {getTagEmoji(tag)} {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AddRecipeModal({ open, onClose, onSubmit, initialRecipe = null }) {
  const isEditing = Boolean(initialRecipe);
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialRecipe?.name || '');
    setMealType(initialRecipe?.mealType || initialRecipe?.defaultMealType || 'lunch');
    setUrl(initialRecipe?.url || '');
    setTags((initialRecipe?.tags || []).join(', '));
    setError('');
  }, [initialRecipe, open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const normalizedUrl = normalizeRecipeLink(url);

    if (!trimmedName) {
      setError('Add a recipe name.');
      return;
    }

    if (!normalizedUrl) {
      setError('Add a link, for example test.com or https://test.com.');
      return;
    }

    onSubmit({
      id: initialRecipe?.id,
      name: trimmedName,
      mealType,
      url: normalizedUrl,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    });
    setName('');
    setMealType('lunch');
    setUrl('');
    setTags('');
    setError('');
    onClose();
  };

  return (
    <Modal title={isEditing ? 'Edit recipe' : 'Add recipe'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <TextField label="Name" value={name} onChange={setName} placeholder="Chicken salad" />

        <label className="block">
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">Type of meal</span>
          <select
            value={mealType}
            onChange={(event) => setMealType(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-stone-200 bg-white px-3 py-3 text-base outline-none focus:border-emerald-600 dark:border-white/10 dark:bg-stone-900 dark:text-stone-50"
          >
            {MEAL_TYPES.map((meal) => (
              <option key={meal.id} value={meal.id}>{meal.label}</option>
            ))}
          </select>
        </label>

        <TextField label="Link" value={url} onChange={setUrl} placeholder="test.com or https://..." />
        <TextField label="Tags" value={tags} onChange={setTags} placeholder="meat, salad, quick" />

        {error && <p className="rounded-2xl bg-red-50/90 px-3 py-2 text-sm text-red-700 dark:bg-red-400/10 dark:text-red-200">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={`${buttonMotion} rounded-2xl border border-white/70 bg-white/65 px-4 py-3 text-sm font-semibold text-stone-700 dark:border-white/10 dark:bg-white/10 dark:text-stone-100`}>
            Cancel
          </button>
          <button type="submit" className={`${buttonMotion} rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white`}>
            {isEditing ? 'Save' : 'Submit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-2xl border border-stone-200 bg-white px-3 py-3 text-base outline-none focus:border-emerald-600 dark:border-white/10 dark:bg-stone-900 dark:text-stone-50"
        placeholder={placeholder}
      />
    </label>
  );
}

export function AddToWeekDialog({ recipe, open, onClose, onAdd }) {
  if (!open || !recipe) return null;

  return (
    <Modal title="Add to week" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-3xl bg-white/55 p-3">
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
              className="rounded-2xl border border-white/70 bg-white/70 px-3 py-3 text-sm font-semibold text-stone-800"
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/25 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className={`${solidPanel} w-full max-w-md rounded-[28px] p-5`}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-stone-950 dark:text-stone-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonMotion} grid h-9 w-9 place-items-center rounded-2xl border border-stone-200 bg-stone-50 text-lg leading-none text-stone-600 dark:border-white/10 dark:bg-white/10 dark:text-stone-200`}
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

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed left-4 right-4 top-4 z-[60] mx-auto max-w-sm rounded-[24px] border border-emerald-200/70 bg-white/75 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-2xl shadow-emerald-900/10 backdrop-blur-2xl dark:border-emerald-300/20 dark:bg-stone-950/75 dark:text-emerald-100">
      <span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-xs text-white recipe-check-pop">✓</span>
      {message}
    </div>
  );
}

function RecipeMotionStyles() {
  return (
    <style jsx global>{`
      .recipe-page-swipe {
        animation: recipe-slide-in 280ms ease both;
      }
      .recipe-check-pop {
        animation: recipe-check-pop 420ms cubic-bezier(.2, 1.7, .35, 1) both;
      }
      .recipe-accordion {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition: grid-template-rows 260ms ease, opacity 220ms ease;
      }
      .recipe-accordion[data-open='true'] {
        grid-template-rows: 1fr;
        opacity: 1;
      }
      .recipe-accordion > div {
        overflow: hidden;
      }
      .recipe-filter-panel {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition: grid-template-rows 240ms ease, opacity 200ms ease;
      }
      .recipe-filter-panel[data-open='true'] {
        grid-template-rows: 1fr;
        opacity: 1;
      }
      .recipe-filter-panel > div {
        overflow: hidden;
      }
      @keyframes recipe-slide-in {
        from { opacity: 0; transform: translateX(16px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes recipe-check-pop {
        0% { transform: scale(.55); opacity: .2; }
        70% { transform: scale(1.14); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  );
}
