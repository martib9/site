import Head from "next/head";
import TelegramCompanion from "./TelegramCompanion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { groceryTerm, alphamegaSearchUrl } from "../../lib/recipes/grocery-search.mjs";
import { MEALS, basketItems, tags, webUrl, isNewRecipe } from "../../lib/recipes/model.mjs";
import { useHousehold } from "./useHousehold";
const title = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const source = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "Source link not added";
  }
};
const amount = (i) =>
  `${i.quantity || ""} ${i.unit || ""} ${i.name}${i.uncertain ? " · amount needs checking" : ""}`.trim();

export function Shell({ children, page, store }) {
  return (
    <div className={`recipes-app ${page === "week" ? "recipes-week" : ""}`}>
      <Head>
        <title>
          {page === "week"
            ? "This week"
            : page === "box"
              ? "All recipes"
              : page === "basket"
                ? "Basket"
                : "Add recipe"}{" "}
          · Recipes
        </title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#245c42" />
        <link rel="manifest" href="/recipes/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/recipes/icon-192.png" />
      </Head>
      <header className="recipes-header">
        <Link href="/recipes" className="recipes-brand">
          Recipes
        </Link>
        <div className="recipes-actions">
          <button className="quiet" onClick={store.logout}>
            Sign out
          </button>
          <Link className="primary" href="/recipes/add">
            Add recipe
          </Link>
        </div>
      </header>
      <main className="recipes-main">
        {store.pending > 0 || !store.online ? (
          <p className="notice" role="status">
            {store.online ? "Syncing" : "Offline"} · {store.pending} changes
            waiting to sync. <button onClick={store.sync}>Retry sync</button>
          </p>
        ) : null}
        {store.error && (
          <p className="notice error" role="alert">
            {store.error}
          </p>
        )}
        {store.legacy && (
          <div className="notice">
            Saved changes were found on this device.{" "}
            <button onClick={store.migrate}>
              Import existing recipes and plan
            </button>
          </div>
        )}
        {children}
        <TelegramCompanion />
        {store.state?.jobs?.length > 0 && (
          <details className="activity">
            <summary>Agent activity</summary>
            {[...store.state.jobs]
              .reverse()
              .slice(0, 5)
              .map((j) => (
                <p key={j.id}>
                  <strong>
                    {j.kind === "match" ? "Shopping matches" : j.kind === "capture" ? "Source screenshot" : "Recipe import"}{" "}
                    · {j.status}
                  </strong>
                  <br />
                  {j.message || "Working in the background…"}
                  {(j.status === "failed" ||
                    (j.status === "running" &&
                      Date.now() - j.started > 240000)) && (
                    <button onClick={() => store.job({ retryId: j.id })}>
                      Retry
                    </button>
                  )}
                </p>
              ))}
          </details>
        )}
      </main>
      <nav className="recipes-nav" aria-label="Recipe navigation">
        {[
          ["week", "/recipes", "This week"],
          ["box", "/recipes/box", "Recipes"],
          ["basket", "/recipes/basket", "Basket"],
        ].map(([id, href, label]) => (
          <Link
            key={id}
            href={href}
            aria-current={page === id ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
function RecipeRow({ recipe: r, store, weekly = false }) {
  const [servings, setServings] = useState(
      store.state.week[r.id]?.servings || r.servings,
    ),
    [caption, setCaption] = useState("");
  const planned = Boolean(store.state.week[r.id]),
    inBasket = Boolean(store.state.basket[r.id]);
  return (
    <article className="recipe-row">
      <div className="recipe-row-top">
        <input
          type="checkbox"
          aria-label={`${weekly ? "Made this week" : "Cooked before"}: ${r.name}`}
          checked={weekly ? Boolean(store.state.weekCooked[r.id]) : r.cooked}
          onChange={(e) =>
            store.act({
              type: weekly ? "weekCooked" : "cooked",
              recipeId: r.id,
              value: e.target.checked,
            })
          }
        />
        <div className="recipe-row-body">
          <details>
            <summary>
              <span>{r.name}</span>
              {isNewRecipe(r, store.state) && <span className="recipe-new">NEW</span>}
            </summary>
            <div className="recipe-details">
              {r.url ? <a href={r.url} target="_blank" rel="noreferrer">
                Original source · {source(r.url)}
              </a> : <p className="muted">Add a source link or paste the recipe text to import ingredients.</p>}
              <p>
                {r.status === "review"
                  ? "Imported · please review"
                  : r.status === "needs-input"
                    ? "Needs your input"
                    : r.ingredients.length
                      ? "Recipe details"
                      : "Saved link · ingredients not imported"}
              </p>
              {r.importMessage && <p className="muted">{r.importMessage}</p>}
              {r.ingredients.length > 0 ? (
                <>
                  <h3>
                    Ingredients{" "}
                    <span className="muted">· {r.servings} servings</span>
                  </h3>
                  <ul>
                    {r.ingredients.map((i, n) => (
                      <li key={n}>
                        {amount(i)}
                        {i.quantity == null ? " · quantity not specified" : ""}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="muted">
                  Import this recipe or add ingredients manually.
                </p>
              )}
              {r.steps.length > 0 && (
                <>
                  <h3>Method</h3>
                  <ol>
                    {r.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </>
              )}
              {r.notes && <p>{r.notes}</p>}
              {r.sources?.length > 0 && (
                <details>
                  <summary>Import sources</summary>
                  {r.sources.map((u) => (
                    <p key={u}>
                      <a href={u} target="_blank" rel="noreferrer">
                        {source(u)}
                      </a>
                    </p>
                  ))}
                </details>
              )}
              <div className="recipes-actions wrap">
                <label className="servings">
                  Servings{" "}
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                  />
                </label>
                <button
                  onClick={() =>
                    store.act({
                      type: "basket",
                      recipeId: r.id,
                      value: !inBasket,
                      servings,
                    })
                  }
                  disabled={!r.ingredients.length}
                >
                  {inBasket ? "Remove from basket" : "Add to basket"}
                </button>
                {inBasket && (
                  <button
                    onClick={() =>
                      store.act({
                        type: "basket",
                        recipeId: r.id,
                        value: true,
                        servings,
                      })
                    }
                  >
                    Update basket servings
                  </button>
                )}
                <Link href={`/recipes/add?edit=${encodeURIComponent(r.id)}`}>
                  Edit recipe
                </Link>
              </div>
              <details className="import-options">
                <summary>Import ingredients with the agent</summary>
                <label>
                  Caption or recipe text{" "}
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={20000}
                    placeholder="Optional. Paste the caption if the source cannot be read."
                  />
                </label>
                <p className="muted">
                  The agent reads accessible source text. For video-only
                  recipes, paste the ingredients and instructions.
                </p>
                <button
                  disabled={!store.agent || !store.online || (!r.url && !caption.trim())}
                  onClick={() =>
                    store.job({ kind: "import", recipeId: r.id, caption })
                  }
                >
                  {store.agent ? "Import recipe" : "Agent connection pending"}
                </button>
              </details>
              <button
                className="danger quiet"
                onClick={() => {
                  if (window.confirm(`Delete ${r.name}?`))
                    store.act({ type: "delete", recipeId: r.id });
                }}
              >
                Delete recipe
              </button>
            </div>
          </details>
          <span className="recipe-source">{source(r.url)}</span>
          <div className="recipe-tags">
            {r.tags.map((t) => (
              <Link key={t} href={{ pathname: "/recipes/box", query: { tag: t } }} className="recipe-tag" aria-label={`Show recipes tagged ${t}`}>{t}</Link>
            ))}
          </div>
        </div>
        <button
          className={planned ? "quiet" : "primary"}
          onClick={() =>
            store.act({
              type: "plan",
              recipeId: r.id,
              value: !planned,
              servings,
            })
          }
        >
          {planned ? (weekly ? "Remove" : "Planned") : "Plan"}
        </button>
      </div>
    </article>
  );
}
export default function Household({ page }) {
  const router = useRouter();
  const store = useHousehold(),
    [query, setQuery] = useState(""),
    [meal, setMeal] = useState(""),
    [cooked, setCooked] = useState("");
  const tag = typeof router.query.tag === 'string' ? router.query.tag : '';
  const setTag = value => router.push({pathname:'/recipes/box',query:value?{tag:value}:{}},undefined,{shallow:true});
  useEffect(()=>{setQuery('');setMeal('');setCooked('');},[tag]);
  const { state } = store;
  if (!state)
    return (
      <Shell page={page} store={store}>
        <h1>
          {page === "week"
            ? "This week"
            : page === "box"
              ? "All recipes"
              : "Basket"}
        </h1>
        <p>Loading your recipes…</p>
      </Shell>
    );
  if (page === "basket")
    return (
      <Shell page={page} store={store}>
        <Basket store={store} />
      </Shell>
    );
  const filtered = state.recipes.filter(
    (r) =>
      (!meal || r.mealType === meal) &&
      (!tag || r.tags.includes(tag)) &&
      (!cooked || (cooked === "yes") === r.cooked) &&
      `${r.name} ${r.tags.join(" ")} ${r.ingredients.map((i) => i.name).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const allTags = [...new Set(state.recipes.flatMap((r) => r.tags))].sort();
  return (
    <Shell page={page} store={store}>
      <div className="page-heading">
        <h1>{page === "week" ? "This week" : "All recipes"}</h1>
        <span className="muted">
          {page === "week"
            ? Object.keys(state.week).length
            : `${filtered.length} of ${state.recipes.length}`}{" "}
          recipes
        </span>
      </div>
      {page === "box" ? (
        <div className="recipe-filters">
          <label className="search-label">
            <span className="sr-only">Search recipes</span>
            <input
              type="search"
              placeholder="Search recipes, ingredients, tags…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="filter-selects">
            <select
              aria-label="Meal type"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
            >
              <option value="">All meals</option>
              {MEALS.map((m) => (
                <option key={m} value={m}>
                  {title(m)}
                </option>
              ))}
            </select>
            <select
              aria-label="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">All tags</option>
              {allTags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              aria-label="Cooked status"
              value={cooked}
              onChange={(e) => setCooked(e.target.value)}
            >
              <option value="">All recipes</option>
              <option value="yes">Cooked</option>
              <option value="no">Not cooked</option>
            </select>
          </div>
        </div>
      ) : null}
      <div className={page === "week" ? "week-columns" : "meal-list"}>
      {MEALS.filter((m) => !meal || meal === m).map((m) => {
        const list =
          page === "week"
            ? state.recipes.filter((r) => state.week[r.id]?.mealType === m)
            : filtered.filter((r) => r.mealType === m);
        return (
          <section key={m} className="meal-section">
            <h2>
              {title(m)} <span>{list.length}</span>
            </h2>
            {list.length ? (
              list.map((r) => (
                <RecipeRow
                  key={r.id}
                  recipe={r}
                  store={store}
                  weekly={page === "week"}
                />
              ))
            ) : (
              <p className="empty">
                {page === "week" ? (
                  <>
                    Nothing planned yet.{" "}
                    <Link href={`/recipes/box`}>Browse recipes</Link>
                  </>
                ) : (
                  "No recipes match these filters."
                )}
              </p>
            )}
          </section>
        );
      })}
      </div>
    </Shell>
  );
}
function Basket({ store }) {
  const items = basketItems(store.state),
    groups = ["Produce", "Dairy & eggs", "Meat & fish", "Pantry", "Other"];
  return (
    <>
      <div className="page-heading">
        <h1>Basket</h1>
        <span className="muted">{items.length} ingredients</span>
      </div>
      <div className="recipes-actions wrap">
        <button
          className="primary"
          disabled={!items.length || !store.agent}
          onClick={() => store.job({ kind: "match" })}
        >
          Find Alphamega products
        </button>
        <button
          onClick={() =>
            navigator.clipboard
              .writeText(
                items
                  .filter((i) => !i.have && !i.bought)
                  .map(amount)
                  .join("\n"),
              )
              .catch(() =>
                window.alert(
                  "Clipboard unavailable. Select and copy the list.",
                ),
              )
          }
        >
          Copy list
        </button>
      </div>
      <p className="muted">
        Combined across your selected recipes. Check what you already have
        before shopping.
      </p>
      {!store.agent && (
        <p className="notice">
          Product matching will be available after the agent is connected.
          Manual Alphamega search works now.
        </p>
      )}
      {!items.length && (
        <p className="empty">
          Your basket is empty. Open a recipe’s ingredients and choose Add to
          basket.
        </p>
      )}
      {groups.map((group) => {
        const list = items.filter((i) => i.section === group);
        return (
          list.length > 0 && (
            <section className="meal-section" key={group}>
              <h2>
                {group} <span>{list.length}</span>
              </h2>
              {list.map((i) => (
                <div
                  className={`basket-row ${i.have || i.bought ? "checked" : ""}`}
                  key={i.key}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(i.bought)}
                      onChange={(e) =>
                        store.act({
                          type: "check",
                          key: i.key,
                          field: "bought",
                          value: e.target.checked,
                        })
                      }
                    />
                    <span>{amount(i)}</span>
                  </label>
                  <div className="basket-detail">
                    <small>{i.recipes.join(" · ")}</small>
                    <label className="have">
                      <input
                        type="checkbox"
                        checked={Boolean(i.have)}
                        onChange={(e) =>
                          store.act({
                            type: "check",
                            key: i.key,
                            field: "have",
                            value: e.target.checked,
                          })
                        }
                      />
                      Already have
                    </label>
                    {i.product?.url ? (
                      <>
                        <a
                          href={i.product.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {i.product.name} {i.product.pack} ↗
                        </a>
                        <small>
                          {i.product.status === "alternative"
                            ? i.product.accepted
                              ? "Alternative accepted"
                              : "Alternative · review before buying"
                            : "Product match"}{" "}
                          · checked{" "}
                          {new Date(i.product.checkedAt).toLocaleDateString(
                            "en-GB",
                          )}
                        </small>
                        {i.product.reason && <small>{i.product.reason}</small>}
                        {i.product.status === "alternative" &&
                          !i.product.accepted && (
                            <button
                              onClick={() =>
                                store.act({
                                  type: "accept",
                                  key: i.key,
                                  value: true,
                                })
                              }
                            >
                              Accept alternative
                            </button>
                          )}
                      </>
                    ) : (
                      <>
                        <small>
                          {i.product ? "Not found" : "Not matched yet"}
                        </small>
                        <GrocerySearch name={i.name} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )
        );
      })}
      {Object.keys(store.state.basket).length > 0 && (
        <details className="activity">
          <summary>Recipes in this basket</summary>
          {Object.entries(store.state.basket).map(([id, n]) => (
            <p key={id}>
              {store.state.recipes.find((r) => r.id === id)?.name} · {n}{" "}
              servings{" "}
              <button
                onClick={() =>
                  store.act({ type: "basket", recipeId: id, value: false })
                }
              >
                Remove
              </button>
            </p>
          ))}
        </details>
      )}
    </>
  );
}
function GrocerySearch({ name }) {
  const [term, setTerm] = useState(() => groceryTerm(name));
  return <div className="grocery-search">
    <label>Search product
      <input aria-label={`Search product for ${name}`} value={term} onChange={e=>setTerm(e.target.value)} />
    </label>
    {term.trim() && <a href={alphamegaSearchUrl(term)} target="_blank" rel="noreferrer">Search Alphamega ↗</a>}
  </div>;
}
export function AddRecipe({ editId }) {
  const store = useHousehold();
  const recipe = store.state?.recipes.find((r) => r.id === editId);
  return (
    <Shell page="add" store={store}>
      <h1>{editId ? "Edit recipe" : "Add recipe"}</h1>
      {editId && !store.state ? (
        <p>Loading…</p>
      ) : editId && !recipe ? (
        <p>Recipe not found.</p>
      ) : (
        <RecipeForm key={recipe?.id || "new"} recipe={recipe} store={store} />
      )}
    </Shell>
  );
}
function RecipeForm({ recipe, store }) {
  const [name, setName] = useState(
      recipe?.name === "Untitled recipe" ? "" : recipe?.name || "",
    ),
    [url, setUrl] = useState(recipe?.url || ""),
    [meal, setMeal] = useState(recipe?.mealType || "lunch"),
    [tagText, setTags] = useState(recipe?.tags.join(", ") || ""),
    [caption, setCaption] = useState(""),
    [servings, setServings] = useState(recipe?.servings || 2),
    [rows, setRows] = useState(recipe?.ingredients || []),
    [steps, setSteps] = useState(recipe?.steps.join("\n") || ""),
    [notes, setNotes] = useState(recipe?.notes || ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const save = async (e) => {
    e.preventDefault();
    if (url.trim() && !webUrl(url)) {
      setError("Enter a valid recipe link.");
      return;
    }
    if (!url.trim() && !name.trim()) {
      setError("Enter a name for a recipe without a link.");
      return;
    }
    setBusy(true);
    const id = recipe?.id || crypto.randomUUID();
    const saved = await store.act({
      type: "save",
      revision: recipe?.revision,
      caption,
      recipe: {
        ...recipe,
        id,
        name,
        url,
        mealType: meal,
        tags: tags(tagText),
        servings,
        ingredients: rows,
        steps: steps.split("\n").filter(Boolean),
        notes,
        status: rows.length ? "ready" : "saved",
      },
    });
    if (saved) {
      window.location.assign("/recipes/box");
    }
    setBusy(false);
  };
  return (
    <form className="recipe-form" onSubmit={save}>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <label>
        Link <span className="muted">(optional)</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          maxLength={2000}
        />
      </label>
      <label>
        Name <span className="muted">(optional)</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="The agent can fill this in"
          maxLength={200}
        />
      </label>
      <label>
        Meal type
        <select value={meal} onChange={(e) => setMeal(e.target.value)}>
          {MEALS.map((m) => (
            <option key={m} value={m}>
              {title(m)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tags <span className="muted">(optional)</span>
        <input
          value={tagText}
          onChange={(e) => setTags(e.target.value)}
          placeholder="quick, vegetarian, pasta"
          maxLength={800}
        />
      </label>
      <label>
        Caption or recipe text <span className="muted">(optional)</span>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={20000}
          placeholder="Paste the caption if the post is private or video-only."
        />
      </label>
      <details open={Boolean(recipe)}>
        <summary>Ingredients, method & notes</summary>
        <label>
          Original recipe servings
          <input
            type="number"
            min="1"
            max="100"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          />
        </label>
        {rows.map((r, i) => (
          <div className="ingredient-editor" key={i}>
            <input
              aria-label={`Ingredient ${i + 1}`}
              placeholder="Ingredient"
              value={r.name}
              onChange={(e) =>
                setRows(
                  rows.map((x, n) =>
                    n === i ? { ...x, name: e.target.value } : x,
                  ),
                )
              }
            />
            <input
              aria-label={`Amount ${i + 1}`}
              placeholder="Amount"
              type="number"
              min="0"
              step="any"
              value={r.quantity ?? ""}
              onChange={(e) =>
                setRows(
                  rows.map((x, n) =>
                    n === i ? { ...x, quantity: e.target.value || null } : x,
                  ),
                )
              }
            />
            <input
              aria-label={`Unit ${i + 1}`}
              placeholder="g, ml…"
              value={r.unit}
              onChange={(e) =>
                setRows(
                  rows.map((x, n) =>
                    n === i ? { ...x, unit: e.target.value } : x,
                  ),
                )
              }
            />
            <button
              type="button"
              aria-label={`Remove ingredient ${i + 1}`}
              onClick={() => setRows(rows.filter((_, n) => n !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setRows([
              ...rows,
              { name: "", quantity: null, unit: "", section: "Other" },
            ])
          }
        >
          Add ingredient
        </button>
        <label>
          Method <span className="muted">(one step per line)</span>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} />
        </label>
        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={4000}
          />
        </label>
      </details>
      {!recipe && store.agent && <p className="muted">Save a link to automatically look for ingredients, quantities, servings, and instructions. You can review the result in Recipes.</p>}
      {!store.agent && (
        <p className="muted">
          The agent is awaiting connection. You can save a link and enter
          ingredients now.
        </p>
      )}
      <button
        className="primary"
        disabled={busy || !store.online || !store.state}
      >
        {busy
          ? "Saving…"
          : recipe
            ? "Save changes"
            : store.agent && !rows.length
              ? "Save & import"
              : "Save recipe"}
      </button>
    </form>
  );
}
