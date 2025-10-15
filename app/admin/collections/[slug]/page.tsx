import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { collectionProducts } from "@/db/schema";
import { CollectionForm } from "@/components/admin/collection-form";

const getCollectionData = async (slug: string) => {
  "use cache";
  const collection = await db.query.collections.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
  });

  if (!collection) return null;

  // Get assigned product IDs
  const assignedRows = await db
    .select({ productId: collectionProducts.productId })
    .from(collectionProducts)
    .where(eq(collectionProducts.collectionId, collection.id));

  const assignedProductIds = assignedRows
    .map((row) => row.productId)
    .filter((id): id is string => id !== null);

  return {
    ...collection,
    assignedProductIds,
  };
};

const getAllProducts = async () => {
  "use cache";
  return await db.query.products.findMany({
    orderBy: (p, { desc }) => desc(p.createdAt),
  });
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const collectionData = await getCollectionData(slug);
  const allProducts = getAllProducts();

  if (!collectionData) notFound();

  return (
    <div className="h-full overflow-y-auto">
      <CollectionForm
        collection={collectionData}
        products={allProducts}
        assignedProductIds={collectionData.assignedProductIds || []}
      />
    </div>
  );
}
