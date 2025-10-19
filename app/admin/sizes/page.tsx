import { db } from "@/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const getFirstCategoryWithSizes = async () => {
  "use cache";
  const categories = await db.query.categories.findMany({
    orderBy: (c, { asc }) => asc(c.title),
  });

  // Find first category that has sizes
  return categories.find(
    (category) => category.sizes && category.sizes.length > 0
  );
};

export default async function Page() {
  const { user, redirectToSignIn } = await auth();

  if (!user) redirectToSignIn();

  const firstCategoryWithSizes = await getFirstCategoryWithSizes();

  if (!firstCategoryWithSizes) redirect("/sizes/new");
  redirect(`/sizes/${firstCategoryWithSizes.slug}`);
}
