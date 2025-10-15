import { notFound } from "next/navigation";
import { db } from "@repo/db";
import { SizeForm } from "@/components/size-form";

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
  params: Promise<{ categorySlug: string; sizeIndex: string }>;
}) {
  const { categorySlug, sizeIndex } = await params;

  const categoryData = await getCategoryData(categorySlug);
  const sizeIndexNum = parseInt(sizeIndex, 10);

  if (
    !categoryData ||
    isNaN(sizeIndexNum) ||
    !categoryData.sizes ||
    sizeIndexNum < 0 ||
    sizeIndexNum >= categoryData.sizes.length
  ) {
    notFound();
  }

  return <SizeForm category={categoryData} editingIndex={sizeIndexNum} />;
}
