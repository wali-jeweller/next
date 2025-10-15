import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductItem } from "@/components/web/product-item";
import { BorderedGrid } from "@/components/web/bordered-grid";
import { Page, Section } from "@/components/web/page-layout";
import { H1, Text } from "@/components/ui/typography";
import { getCollection } from "@/lib/queries";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  const allProducts =
    collection.collectionProducts?.map((cp) => cp.product) || [];

  return (
    <Page>
      {/* Hero Banner - Custom for collections */}
      <section className="relative">
        <div className="relative h-[50vh] overflow-hidden">
          <Image
            src={collection.thumbnail || "/placeholder.png"}
            alt={collection.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl px-4 text-center text-white">
            <H1 className="mb-4 md:text-6xl">{collection.title}</H1>
            {collection.description && (
              <Text className="text-lg opacity-90 md:text-xl">
                {collection.description}
              </Text>
            )}
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <Section
        title="Products in this Collection"
        subtitle={`${allProducts.length} products in ${collection.title}`}
        border="both"
      >
        {allProducts.length > 0 ? (
          <BorderedGrid className="border-t">
            {allProducts.map((product) => (
              <Link
                key={product?.id}
                href={`/products/${product?.slug}`}
                className="group"
                prefetch={false}
              >
                <ProductItem product={product!} carousel />
              </Link>
            ))}
          </BorderedGrid>
        ) : (
          <div className="text-center py-16">
            <Text className="text-muted-foreground">
              No products available in this collection yet.
            </Text>
          </div>
        )}
      </Section>
    </Page>
  );
}
