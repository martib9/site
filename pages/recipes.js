import Household from "../components/recipes/Household";
export { pageProps as getServerSideProps } from "../lib/recipes/auth";
export default function Recipes() {
  return <Household page="week" />;
}
