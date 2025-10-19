import { db } from "@/db";
import { redirect } from "next/navigation";

const getAllCategories = async () => {
  "use cache";
  return await db.query.categories.findMany({
    orderBy: (c, { asc }) => asc(c.title),
  });
};

export default async function Page() {
  const categories = await getAllCategories();

  // If there are no categories, redirect to categories page to create one first
  if (categories.length === 0) {
    redirect("/categories/new");
  }

  // Redirect to the first category's size creation page
  redirect(`/sizes/${categories[0]?.slug}/new`);
}
