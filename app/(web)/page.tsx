import Image from "next/image";
import Link from "next/link";
import { HomePageCarousel } from "@/components/web/home-product-carousel";
import { Caption, H2, H3, Text } from "@/components/ui/typography";
import { db } from "@/db";
import { LinkButton } from "@/components/web/link-button";
import { getCollections, getCategories } from "@/lib/queries";
import { Hero } from "@/components/web/hero";
import { Truck, Sparkles, HelpCircle } from "lucide-react";

const getProducts = async () => {
  "use cache";
  const products = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.status, "featured"),
    limit: 15,
  });
  return products;
};

export default async function Page() {
  const categories = await getCategories();
  const collections = await getCollections();
  const products = await getProducts();

  return (
    <>
      <Hero />
      <section className="mt-12">
        <div className="border-y py-8 lg:py-12">
          <H2 className="text-center">Shop by Category</H2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="flex flex-col overflow-hidden gap-2 p-4 border-r [&:nth-last-child(2)]:border-b-0 last:border-r-0 border-b lg:border-b-0 last:border-b-0"
            >
              {c.thumbnail ? (
                <Image
                  src={c.thumbnail}
                  alt={c.title}
                  className="aspect-square h-full w-full object-cover"
                  width={500}
                  height={500}
                  priority={false}
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <span className="text-sm">{c.title}</span>
                </div>
              )}
              <Caption className="text-primary/90 line-clamp-1 font-medium text-center tracking-wide">
                {c.title}
              </Caption>
            </Link>
          ))}
        </div>
        <div className="border-y py-8 lg:py-12 text-center">
          <LinkButton href="/categories">View All Categories</LinkButton>
        </div>
      </section>

      <section className="border-b pb-12">
        <div className="border-b py-8 lg:py-12">
          <H2 className="text-center">Popular Now</H2>
        </div>
        <HomePageCarousel products={products} />
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b">
        <div className="p-8 lg:p-16 flex flex-col justify-center items-center order-2 lg:order-1">
          <H2 className="text-2xl lg:text-3xl mb-4">Engagement Rings</H2>
          <Text className="mb-6 leading-relaxed text-center text-pretty">
            Find the perfect engagement ring from our curated collection. From
            classic solitaires to modern designs, each ring is crafted with
            precision and care. Our diamond engagement rings feature certified
            stones and come with lifetime warranties.
          </Text>
          <LinkButton href="/categories/engagement-rings" className="w-fit">
            Shop Engagement Rings
          </LinkButton>
        </div>
        <Image
          src={"/gold.png"}
          alt="Gold Engagement Rings"
          width={500}
          height={500}
          className="w-full h-full object-cover order-1 lg:order-2"
        />
      </div>

      {/* Necklaces Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Image
          src={"/silver.png"}
          alt="Necklace Collection"
          className="w-full h-full object-cover"
          width={500}
          height={500}
        />
        <div className="p-8 lg:p-16 flex flex-col justify-center items-center order-1 lg:order-2">
          <H2 className="text-2xl lg:text-3xl mb-4">Necklaces & Pendants</H2>
          <Text className="mb-6 leading-relaxed text-center text-pretty">
            Express your style with our stunning necklace collection. From
            delicate chains to statement pendants, each piece is designed to
            complement your personal aesthetic. Our gold necklaces feature 18k
            yellow, white, and rose gold options.
          </Text>
          <LinkButton href="/categories/necklaces" className="w-fit">
            Shop Necklaces
          </LinkButton>
        </div>
      </div>

      {/* Featured Collections */}
      <section>
        <div className="border-y py-8 lg:py-12">
          <H2 className="text-center">Jewelry Collection Highlights</H2>
          <Text className="text-center mt-4 max-w-2xl mx-auto px-4">
            Discover our exquisite collection of handcrafted jewelry, from
            classic gold pieces to modern silver designs
          </Text>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/products?collection=${c.slug}`}
              className="flex flex-col overflow-hidden gap-2 p-4 border-r last:border-r-0 border-b lg:border-b-0 last:border-b-0"
            >
              {c.thumbnail ? (
                <Image
                  src={c.thumbnail}
                  alt={c.title}
                  className="aspect-square h-full w-full object-cover"
                  width={500}
                  height={500}
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <Caption>{c.title}</Caption>
                </div>
              )}
              <Caption className="text-primary/90 line-clamp-1 font-medium text-center tracking-wide">
                {c.title}
              </Caption>
            </Link>
          ))}
        </div>
        <div className="border-y py-8 lg:py-12 text-center">
          <LinkButton href="/collections">View All Collections</LinkButton>
        </div>
      </section>

      <section className="py-16 text-center bg-muted/20">
        <div className="max-w-3xl mx-auto px-4">
          <H2 className="text-2xl lg:text-3xl mb-4">
            Ready to Find Your Perfect Jewelry?
          </H2>
          <Text className="mb-8 text-lg">
            Browse our complete collection and discover pieces that speak to
            your style and story. From everyday essentials to special occasion
            treasures, we have something for everyone.
          </Text>
          <LinkButton href="/contact">Contact Us</LinkButton>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 border-t text-center">
        <div className="p-4 py-8 lg:py-16 border-b lg:border-r lg:border-b-0 space-y-2">
          <Truck className="mx-auto size-12 stroke-1" />
          <H3>Shipping and Returns</H3>
          <Text className="pb-4">
            Get to know our shipping and returns policy.
          </Text>
          <LinkButton href="/shipping-and-returns">Learn More</LinkButton>
        </div>
        <div className="p-4 py-8 lg:py-16 border-b lg:border-r lg:border-b-0 space-y-2">
          <Sparkles className="mx-auto size-12 stroke-1" />
          <H3>Jewellery Care</H3>
          <Text className="pb-4">
            Learn how to care for your jewelry and keep it looking beautiful.
          </Text>
          <LinkButton href="/care">Learn More</LinkButton>
        </div>
        <div className="p-4 py-8 lg:py-16 space-y-2">
          <HelpCircle className="mx-auto size-12 stroke-1" />
          <H3>FAQs</H3>
          <Text className="pb-4">
            Find answers to common questions about our jewelry.
          </Text>
          <LinkButton href="/faq">Learn More</LinkButton>
        </div>
      </section>
    </>
  );
}
