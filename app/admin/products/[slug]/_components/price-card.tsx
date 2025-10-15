import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardSubItem,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@repo/db";
import type { TProduct } from "@repo/db/schema";
import { formatPrice } from "@/lib/format-price";
import { UpdatePrice } from "./update-price";

export async function PriceCard({ product }: { product: TProduct }) {
  const isGoldProduct = product.material?.toLowerCase() === "gold";
  const todaysGoldRate = await db.query.dailyGoldRates.findFirst({
    where: (d, { eq }) => eq(d.date, new Date().toISOString()),
    orderBy: (d, { desc }) => desc(d.date),
  });

  const goldRate = todaysGoldRate?.ratePerGram ?? 0;
  const pricePerGram = product.weight ? product.price / product.weight : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price</CardTitle>
        <CardDescription>
          {isGoldProduct
            ? "Price automatically updated based on daily gold rates"
            : "Manage product price"}
        </CardDescription>
        <CardAction>
          <UpdatePrice product={product} goldRate={goldRate} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 border-t pt-4">
        <CardSubItem label="Price" value={formatPrice(product.price)} />
        <CardSubItem
          label="Discounted Price"
          value={formatPrice(product.discountedPrice ?? 0)}
        />
        {!!product.weight && (
          <CardSubItem label="Weight" value={`${product.weight}g`} />
        )}
        {isGoldProduct && (
          <CardSubItem
            label="Price per gram"
            value={
              product.weight ? formatPrice(Math.round(pricePerGram)) : "N/A"
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
