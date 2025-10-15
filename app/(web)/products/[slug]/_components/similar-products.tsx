import { db } from "@/db";
import { sql } from "drizzle-orm";
import { products } from "@/db/schema";
import type { TProduct } from "@/db/schema";
import { ProductCarousel } from "@/components/web/product-carousel";
import { CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import { ProductItem } from "@/components/web/product-item";

const getSimilarProducts = async (product: TProduct) => {
  "use cache";

  // Single optimized query using a CTE (Common Table Expression) to get similar products
  // This combines the embedding lookup and similar products search into one query
  const similarProducts = await db.query.products.findMany({
    where: sql`${products.id} IN (
      WITH product_embedding AS (
        SELECT embedding FROM product_embeddings WHERE product_id = ${product.id}
      )
      SELECT p.id FROM products p
      INNER JOIN product_embeddings pe ON p.id = pe.product_id
      CROSS JOIN product_embedding
      WHERE pe.product_id != ${product.id} 
      AND 1 - (pe.embedding <=> product_embedding.embedding) > 0.5
      ORDER BY 1 - (pe.embedding <=> product_embedding.embedding) DESC
      LIMIT 8
    )`,
  });

  return similarProducts;
};

export async function SimilarProducts({ product }: { product: TProduct }) {
  const similarProducts = await getSimilarProducts(product);

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <ProductCarousel>
        {similarProducts.map((similarProduct) => (
          <CarouselItem
            key={similarProduct.id}
            className="md:basis-1/3 md:first:-ml-0 lg:basis-1/4 xl:basis-1/5"
          >
            <Link href={`/products/${similarProduct.slug}`}>
              <ProductItem product={similarProduct} />
            </Link>
          </CarouselItem>
        ))}
      </ProductCarousel>
    </div>
  );
}
