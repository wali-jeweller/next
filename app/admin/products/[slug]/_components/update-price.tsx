"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Scale } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TProduct } from "@repo/db/schema";
import { formatPrice } from "@/lib/format-price";
import { updateProductPriceAction } from "../actions";

// Schema for gold products (weight + making charges)
const goldPriceSchema = z.object({
  productId: z.string(),
  weight: z.number().min(0.001, "Weight must be at least 0.001 grams"),
  makingCharges: z.number().min(0, "Making charges must be a positive number"),
});

// Schema for other materials (price + optional discount)
const regularPriceSchema = z
  .object({
    productId: z.string(),
    price: z.number().min(0, "Price must be a positive number"),
    hasDiscount: z.boolean(),
    discountType: z.enum(["percentage", "absolute"]),
    discountValue: z.number().min(0, "Discount must be a positive number"),
  })
  .refine(
    (data) => {
      if (!data.hasDiscount) return true;
      if (data.discountType === "percentage") {
        return data.discountValue <= 100;
      }
      return data.discountValue <= data.price;
    },
    {
      message: "Discount cannot be greater than price",
      path: ["discountValue"],
    }
  );

type GoldFormValues = z.infer<typeof goldPriceSchema>;
type RegularFormValues = z.infer<typeof regularPriceSchema>;

export function UpdatePrice({
  product,
  goldRate,
}: {
  product: TProduct;
  goldRate: number;
}) {
  const [open, setOpen] = React.useState(false);
  const isGoldProduct = product.material?.toLowerCase() === "gold";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Update Product Price</SheetTitle>
          <SheetDescription>
            {isGoldProduct
              ? "Set weight and making charges for gold pricing calculation."
              : "Set the product price and apply discounts if needed."}
          </SheetDescription>
        </SheetHeader>
        {isGoldProduct ? (
          <GoldPriceForm
            productId={product.id}
            initialWeight={product.weight || 0}
            onSuccess={() => setOpen(false)}
            goldRate={goldRate}
          />
        ) : (
          <RegularPriceForm
            productId={product.id}
            initialPrice={product.price}
            initialDiscountedPrice={product.discountedPrice ?? 0}
            onSuccess={() => setOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

// Form for gold products
const GoldPriceForm = ({
  productId,
  initialWeight = 0,
  onSuccess,
  goldRate,
}: {
  productId: string;
  initialWeight?: number;
  onSuccess: () => void;
  goldRate: number;
}) => {
  const [calculatedPrice, setCalculatedPrice] = React.useState<number>(0);
  const [makingCharges, setMakingCharges] = React.useState<number>(0);

  const form = useForm<GoldFormValues>({
    resolver: zodResolver(goldPriceSchema),
    defaultValues: {
      productId,
      weight: initialWeight || undefined,
      makingCharges: undefined,
    },
  });

  const weight = form.watch("weight");

  // Calculate price based on weight and making charges
  React.useEffect(() => {
    const calculatePrice = async () => {
      if (weight > 0) {
        try {
          // This would typically fetch from your gold rates API
          // For now, using a placeholder calculation
          const basePrice = weight * goldRate; // Assuming 250k per gram
          const totalPrice = basePrice + makingCharges;
          setCalculatedPrice(totalPrice);
        } catch (error) {
          console.error("Error calculating price:", error);
        }
      }
    };

    calculatePrice();
  }, [weight, makingCharges, goldRate]);

  const onSubmit = async (data: GoldFormValues) => {
    try {
      await updateProductPriceAction({
        productId: data.productId,
        price: calculatedPrice,
        weight: data.weight,
        makingCharges: data.makingCharges,
        discountedPrice: calculatedPrice, // No discount for gold products
      });

      toast.success("Gold product price updated successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product price");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Weight (grams)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.001"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter the weight in grams for gold pricing calculation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="makingCharges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Making Charges (PKR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === "" ? 0 : Number(value);
                    field.onChange(numValue);
                    setMakingCharges(numValue);
                  }}
                />
              </FormControl>
              <FormDescription>
                Additional charges for craftsmanship and design
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price summary for gold */}
        <div className="space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Base Price (Gold):</span>
            <span>{formatPrice(weight * goldRate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Making Charges:</span>
            <span>{formatPrice(makingCharges)}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2 font-medium text-sm">
            <span>Total Price:</span>
            <span>{formatPrice(calculatedPrice)}</span>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Price"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

// Form for regular products
const RegularPriceForm = ({
  productId,
  initialPrice = 0,
  initialDiscountedPrice = 0,
  onSuccess,
}: {
  productId: string;
  initialPrice?: number;
  initialDiscountedPrice?: number;
  onSuccess: () => void;
}) => {
  // Determine initial discount state
  const hasInitialDiscount =
    initialDiscountedPrice > 0 && initialDiscountedPrice < initialPrice;
  const initialDiscountType: "percentage" | "absolute" = "absolute";
  const initialDiscountValue = hasInitialDiscount
    ? initialPrice - initialDiscountedPrice
    : 0;

  const [calculatedPrice, setCalculatedPrice] = React.useState<number>(
    initialDiscountedPrice || initialPrice
  );

  const form = useForm<RegularFormValues>({
    resolver: zodResolver(regularPriceSchema),
    defaultValues: {
      productId,
      price: initialPrice || 0,
      hasDiscount: hasInitialDiscount,
      discountType: initialDiscountType,
      discountValue: initialDiscountValue,
    },
  });

  const price = form.watch("price");
  const hasDiscount = form.watch("hasDiscount");
  const discountType = form.watch("discountType");
  const discountValue = form.watch("discountValue");

  // Calculate discounted price
  React.useEffect(() => {
    let newPrice = price || 0;

    if (hasDiscount && discountValue > 0) {
      if (discountType === "percentage") {
        const safePercentage = Math.min(discountValue, 100);
        newPrice = Math.round(newPrice - (newPrice * safePercentage) / 100);
      } else if (discountType === "absolute") {
        const safeDiscount = Math.min(discountValue, newPrice);
        newPrice = newPrice - safeDiscount;
      }
    }

    setCalculatedPrice(Math.max(0, newPrice));
  }, [price, hasDiscount, discountType, discountValue]);

  const onSubmit = async (data: RegularFormValues) => {
    try {
      await updateProductPriceAction({
        productId: data.productId,
        price: data.price,
        discountedPrice: calculatedPrice,
      });

      toast.success("Product price updated successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product price");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price (PKR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasDiscount"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Discount</h4>
                    <p className="text-xs text-muted-foreground">
                      Apply discount to the final price
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) {
                          form.setValue("discountValue", 0);
                        }
                      }}
                    />
                  </FormControl>
                </div>

                {field.value && (
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field: discountTypeField }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Discount Type
                            </span>
                            <FormControl>
                              <ToggleGroup
                                type="single"
                                value={discountTypeField.value}
                                onValueChange={(value) => {
                                  if (value) {
                                    discountTypeField.onChange(value);
                                    form.setValue("discountValue", 0);
                                  }
                                }}
                                className="h-9"
                              >
                                <ToggleGroupItem
                                  value="percentage"
                                  className="px-3"
                                >
                                  %
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="absolute"
                                  className="px-3"
                                >
                                  PKR
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field: discountValueField }) => (
                        <FormItem>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="number"
                                max={
                                  discountType === "percentage" ? 100 : price
                                }
                                step="1"
                                {...discountValueField}
                                value={discountValueField.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const numValue =
                                    value === "" ? 0 : Number(value);
                                  const maxValue =
                                    discountType === "percentage"
                                      ? 100
                                      : price || 0;
                                  discountValueField.onChange(
                                    Math.min(numValue, maxValue)
                                  );
                                }}
                                placeholder={
                                  discountType === "percentage"
                                    ? "Enter percentage (max 100%)"
                                    : `Enter amount (max ${formatPrice(price || 0)})`
                                }
                                className="pr-12"
                              />
                            </FormControl>
                            <Badge
                              variant="secondary"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                            >
                              {discountType === "percentage" ? "%" : "PKR"}
                            </Badge>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />

        {/* Price summary */}
        <div className="space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Original Price:</span>
            <span>{formatPrice(price || 0)}</span>
          </div>

          {hasDiscount && discountValue > 0 && (
            <div className="text-destructive flex items-center justify-between text-sm">
              <span className="font-medium">
                Discount (
                {discountType === "percentage"
                  ? `${discountValue}%`
                  : formatPrice(discountValue)}
                ):
              </span>
              <span>-{formatPrice((price || 0) - calculatedPrice)}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-2 font-medium text-sm">
            <span>Final Price:</span>
            <span>{formatPrice(calculatedPrice)}</span>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Price"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};
