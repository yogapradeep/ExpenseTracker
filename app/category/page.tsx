import CategoriesList from "@/components/Categories/CategoriesList";
import { Category } from "@/lib/interfaces";

export default async function page() {
  const fetchCategories = async () => {
    try {
      const categoryResponse = await fetch(
        "https://6480ae0af061e6ec4d49b390.mockapi.io/Categories"
      );

      const categoryData = await categoryResponse.json();
      return categoryData;
    } catch (error) {
      console.error("error while fetching the data");
    }
  };
  let categories: Category[] = await fetchCategories();
  return <CategoriesList categories={categories} />;
}
