import pg from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { SEED_RECIPES, INITIAL_WEEK_PLAN } from "../../data/recipes";
import { cleanRecipe, tags } from "./model.mjs";
let pool;
export function configured() {
  return Boolean(process.env.DATABASE_URL);
}
export function db() {
  if (!configured()) throw new Error("Household database is not configured.");
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
    attachDatabasePool(pool);
    pool.on("error", () => console.error("Recipe database idle connection closed; the next request will reconnect."));
  }
  return pool;
}
export function seed() {
  return {
    recipes: SEED_RECIPES.map((r) =>
      cleanRecipe({
        ...r,
        tags: tags(
          {
            "Breakfasts & Brunch": "breakfast",
            "Lunches & Dinners: Chicken / Turkey": "chicken",
            "Lunches & Dinners: Fish / Seafood": "seafood",
            "Lunches & Dinners: Beef / Meat": "meat",
            "Lunches & Dinners: Vegetarian / Tofu / Cheese": "vegetarian",
            "Pasta / Noodles / Rice / Bowls": "bowls",
            Soups: "soup",
            Salads: "salad",
            "Sandwiches / Wraps / Snacks": "snack",
            "Sides / Appetizers / Sauces": "side",
            "Desserts & Baking": "dessert",
          }[r.section] || "",
        ),
      }),
    ),
    week: Object.fromEntries(
      Object.entries(INITIAL_WEEK_PLAN).flatMap(([mealType, ids]) =>
        ids.map((id) => [id, { mealType, servings: 2 }]),
      ),
    ),
    previousWeek: {},
    weekCooked: {},
    basket: {},
    checks: {},
    products: {},
    migrations: [],
    applied: [],
    jobs: [],
    revision: 0,
  };
}
let ready;
export async function ensure() {
  if (!ready)
    ready = db()
      .query(
        `CREATE TABLE IF NOT EXISTS martib_recipe_household (id text PRIMARY KEY, body jsonb NOT NULL);
    CREATE TABLE IF NOT EXISTS martib_recipe_limits (id text PRIMARY KEY, count integer NOT NULL, expires bigint NOT NULL);
    CREATE TABLE IF NOT EXISTS martib_recipe_screenshots (id text PRIMARY KEY, image bytea NOT NULL, created bigint NOT NULL);`,
      )
      .then(() =>
        db().query(
          "INSERT INTO martib_recipe_household (id,body) VALUES ($1,$2) ON CONFLICT DO NOTHING",
          ["home", JSON.stringify(seed())],
        ),
      )
      .catch((e) => {
        ready = null;
        throw e;
      });
  return ready;
}
export async function readState() {
  await ensure();
  return (
    await db().query("SELECT body FROM martib_recipe_household WHERE id=$1", [
      "home",
    ])
  ).rows[0].body;
}
export async function mutate(fn) {
  await ensure();
  const client = await db().connect();
  try {
    await client.query("BEGIN");
    const state = (
      await client.query(
        "SELECT body FROM martib_recipe_household WHERE id=$1 FOR UPDATE",
        ["home"],
      )
    ).rows[0].body;
    const result = await fn(state);
    state.revision++;
    await client.query(
      "UPDATE martib_recipe_household SET body=$1 WHERE id=$2",
      [JSON.stringify(state), "home"],
    );
    await client.query("COMMIT");
    return { state, result };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
export async function rateLimit(key, max, windowMs) {
  await ensure();
  const now = Date.now();
  const { rows } = await db().query(
    `INSERT INTO martib_recipe_limits (id,count,expires) VALUES ($1,1,$2)
    ON CONFLICT (id) DO UPDATE SET count=CASE WHEN martib_recipe_limits.expires<$3 THEN 1 ELSE martib_recipe_limits.count+1 END,
    expires=CASE WHEN martib_recipe_limits.expires<$3 THEN $2 ELSE martib_recipe_limits.expires END RETURNING count`,
    [key, now + windowMs, now],
  );
  return rows[0].count <= max;
}
export function clientState(s) {
  const { applied, jobs, ...rest } = s;
  return {
    ...rest,
    jobs: jobs.map(
      ({ id, kind, recipeId, status, message, created, started, screenshot }) => ({
        id,
        kind,
        recipeId,
        status,
        message,
        created,
        started,
        screenshot,
      }),
    ),
  };
}

export async function saveScreenshot(id, image, created) {
  await ensure();
  await db().query("INSERT INTO martib_recipe_screenshots (id,image,created) VALUES ($1,$2,$3) ON CONFLICT (id) DO UPDATE SET image=$2,created=$3", [id, image, created]);
  // Bounded storage; evidence is intentionally short-lived and never public.
  await db().query("DELETE FROM martib_recipe_screenshots WHERE created<$1 OR id NOT IN (SELECT id FROM martib_recipe_screenshots ORDER BY created DESC LIMIT 50)", [Date.now() - 7 * 86400000]);
}

export async function readScreenshot(id) {
  await ensure();
  const state = await readState();
  const job = state.jobs.find((j) => j.id === id);
  if (!job || !state.recipes.some((r) => r.id === job.recipeId)) return null;
  return (await db().query("SELECT image FROM martib_recipe_screenshots WHERE id=$1 AND created>$2", [id, Date.now() - 7 * 86400000])).rows[0]?.image || null;
}
