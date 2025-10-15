import { db } from "@/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const getCollection = async () => {
  "use cache";
  return await db.query.collections.findFirst({});
};

export default async function Page() {
  const { user, redirectToSignIn } = await auth();

  if (!user) redirectToSignIn();

  const collection = await getCollection();

  if (!collection) redirect("/collections/new");
  redirect(`/collections/${collection.slug}`);
}
