import { notFound } from "next/navigation";
import { db } from "@/db";
import { CategoryForm } from "@/components/admin/category-form";

const getCategoryData = async (slug: string) => {
  "use cache";
  const category = await db.query.categories.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
  });

  return category;
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoryData = await getCategoryData(slug);

  if (!categoryData) notFound();

  return <CategoryForm category={categoryData} />;
}
