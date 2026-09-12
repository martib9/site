import { useRouter } from "next/router";
import { AddRecipe } from "../../components/recipes/Household";
export { pageProps as getServerSideProps } from "../../lib/recipes/auth";
export default function Add() {
  const router = useRouter();
  return <AddRecipe editId={router.query.edit} />;
}
