import { auth } from "@/lib/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";

const getFirstCategory = async () => {
  "use cache";
  return await db.query.categories.findFirst({
    orderBy: (c, { asc }) => asc(c.createdAt),
  });
};

export default async function Page() {
  const { user, redirectToSignIn } = await auth();

  if (!user) redirectToSignIn();

  const firstCategory = await getFirstCategory();

  if (!firstCategory) redirect("/categories/new");
  redirect(`/categories/${firstCategory.slug}`);
}
