import { Button } from "@/components/ui/button";
import type { TProduct } from "@/db/schema";
import { formatPrice } from "@/lib/format-price";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Caption, H2, Price, Text } from "@/components/ui/typography";
import { ItemWishlist } from "@/components/web/item-wishlist";
import { ProductCart } from "./product-cart";
import { Suspense } from "react";
import { Heart } from "lucide-react";

export function ProductDetails({
  product,
}: {
  product: TProduct & {
    category: {
      id: string;
      title: string;
      sizes: Array<{ value: string; unit: string }> | null;
    } | null;
  };
}) {
  return (
    <div className="sticky top-34 mx-auto space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <Caption className="text-xs capitalize">
            {product.material || "N/A"}
          </Caption>
          <Suspense fallback={<WishlistSkeleton />}>
            <ItemWishlist
              productId={product.id}
              productName={product.title}
              productPrice={product.price}
              productImage={product.images?.[0]?.url}
              productSlug={product.slug}
              className="-mr-2"
            />
          </Suspense>
        </div>
        <H2 className="pb-2">{product.title}</H2>
        <ProductPrice product={product} />
      </div>
      <Text className="text-pretty line-clamp-3">{product.description}</Text>
      <ProductCart
        product={product}
        categorySizes={product.category?.sizes || []}
        className="hidden lg:block"
      />
      <ProductAttributes product={product} />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Delivery and Returns</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
            dolores nesciunt culpa explicabo possimus enim omnis laudantium.
            Suscipit aliquam esse porro unde eos veritatis, reprehenderit
            debitis quae aspernatur. Inventore, eius?
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Care and Maintenance</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
            dolores nesciunt culpa explicabo possimus enim omnis laudantium.
            Suscipit aliquam esse porro unde eos veritatis, reprehenderit
            debitis quae aspernatur. Inventore, eius?
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const WishlistSkeleton = () => {
  return (
    <Button variant={"ghost"} size={"icon"} className="-mr-2" disabled>
      <Heart className="h-4 w-4" />
    </Button>
  );
};

function ProductPrice({ product }: { product: TProduct }) {
  return (
    <Price className="text-lg">
      {product.discountedPrice &&
      product.discountedPrice > 0 &&
      product.discountedPrice < product.price ? (
        <>
          <span>{formatPrice(product.discountedPrice)}</span>
          <span className="ml-2 line-through text-xs">
            {formatPrice(product.price)}
          </span>
        </>
      ) : (
        formatPrice(product.price)
      )}
    </Price>
  );
}

function ProductAttributes({ product }: { product: TProduct }) {
  return (
    <div className="space-y-2">
      <table className="w-full">
        <tbody className="flex flex-col">
          {product.attributes?.map((attribute) => (
            <tr
              key={attribute.name}
              className="flex justify-between items-start py-2 border-b gap-8 last:border-b-0"
            >
              <td>
                <Caption>{attribute.name}</Caption>
              </td>
              <td>
                <Text className="line-clamp-2 text-right text-sm">
                  {attribute.value}
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
