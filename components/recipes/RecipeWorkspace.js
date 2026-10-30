import { useRouter } from 'next/router';
import Household from './Household';
import { recipeTab } from '../../lib/recipes/navigation.mjs';
// All three entry routes export this same component so state survives tab changes.
export default function RecipeWorkspace() {
  return <Household page={recipeTab(useRouter())} />;
}
