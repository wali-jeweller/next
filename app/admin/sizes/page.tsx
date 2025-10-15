import { auth } from "@clerk/nextjs/server";
import { db } from "@repo/db";
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
  const { userId, redirectToSignIn } = await auth();

  if (!userId) redirectToSignIn();

  const firstCategoryWithSizes = await getFirstCategoryWithSizes();

  if (!firstCategoryWithSizes) redirect("/sizes/new");
  redirect(`/sizes/${firstCategoryWithSizes.slug}`);
}
