export const RECIPE_TABS = { '/recipes': 'week', '/recipes/box': 'box', '/recipes/basket': 'basket' };
export function recipeTab(router) {
  return Object.values(RECIPE_TABS).includes(router.query.tab) ? router.query.tab : RECIPE_TABS[router.pathname] || 'week';
}
export function tabDestination(router, tab, query = {}) {
  const as = Object.keys(RECIPE_TABS).find(path => RECIPE_TABS[path] === tab);
  return { url: { pathname: router.pathname, query: { ...query, tab } }, as: { pathname: as, query } };
}
