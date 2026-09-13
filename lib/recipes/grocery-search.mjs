export function groceryTerm(name) {
  const original=String(name||'').trim();
  let term=original.toLowerCase().split(/[,;(]/)[0]
    .replace(/\b(?:small|medium|large|extra-large|freshly|finely|roughly|coarsely|chopped|minced|diced|sliced|peeled|crushed|grated|divided|optional)\b/g,' ')
    .replace(/\b(?:cloves?\s+(?:of\s+)?garlic|garlic\s+cloves?)\b/g,'garlic')
    .replace(/\b(?:to taste|for serving|for garnish)\b.*$/,'')
    .replace(/^\s*[\d\s./¼½¾]+\s*(?:grams?|g|kg|ml|cups?|tablespoons?|teaspoons?|tbsp|tsp)?\b\s*/,'')
    .replace(/\s+/g,' ').trim();
  return term || original;
}
export const alphamegaSearchUrl = term => `https://www.alphamega.com.cy/en/groceries?Search=${encodeURIComponent(String(term).trim())}`;
