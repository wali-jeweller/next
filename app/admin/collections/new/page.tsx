import { db } from "@/db";
import { CollectionForm } from "@/components/admin/collection-form";

const getAllProducts = async () => {
  "use cache";
  return await db.query.products.findMany({
    orderBy: (p, { desc }) => desc(p.createdAt),
  });
};

export default async function NewCollectionPage() {
  const products = getAllProducts();

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <CollectionForm products={products} />
      </div>
    </div>
  );
}
