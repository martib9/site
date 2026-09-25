export const recipePath = id => `/recipes/view?id=${encodeURIComponent(id)}`;
export const recipeUrl = id => `https://www.martib.app${recipePath(id)}`;
export const portions = n => Math.max(1, Math.min(100, Number(n) || 2));
export function scaledIngredients(recipe, servings=2) {
 return recipe.ingredients.map(i=>({...i, quantity:i.quantity==null?null:Math.round(i.quantity*portions(servings)/recipe.servings*100)/100}));
}
export function ingredientName(value) {
 // Only remove known preparation instructions, never dietary or product qualifiers.
 return String(value).toLowerCase().normalize('NFKC').trim()
 .replace(/,\s*(?:finely |roughly |coarsely )?(?:minced|chopped|diced|sliced|peeled|grated|crushed|divided)(?:\s+.*)?$/,'')
 .replace(/\b(?:finely |roughly |coarsely )?(?:minced|chopped|diced|sliced|peeled|grated)\s+/g,'')
 .replace(/^(?:large |small |medium )?garlic cloves?$/,'garlic')
 .replace(/^cloves? (?:of )?garlic$/,'garlic').replace(/\s+/g,' ').trim();
}
export function recipeStatus(recipe,state) {
 const job=[...(state.jobs||[])].reverse().find(j=>j.kind==='import'&&j.recipeId===recipe.id);
 if(job&&['queued','running'].includes(job.status))return 'Importing';
 if(recipe.status==='review')return 'Review';
 if(!recipe.ingredients.length||recipe.status==='needs-input')return 'Needs ingredients';
 return 'Ready';
}
export function shopCandidates(state) {
 return state.recipes.filter(r=>state.week[r.id]&&!state.weekCooked[r.id]);
}
export const safeReturn = value => typeof value==='string' && /^\/recipes(?:\/|\?|$)/.test(value) && !value.includes('\\') ? value : '/recipes';

export function ingredientUnit(unit){return ({grams:'g',gram:'g',kilograms:'kg',kilogram:'kg',litres:'l',liters:'l',litre:'l',liter:'l',milliliters:'ml',millilitres:'ml',teaspoon:'tsp',teaspoons:'tsp',tablespoon:'tbsp',tablespoons:'tbsp',cloves:'clove',cups:'cup'})[String(unit).toLowerCase().trim()]||String(unit).toLowerCase().trim();}
