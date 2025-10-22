import { Controller, useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProductFormValues } from "./types";

export function PricingSection() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <CardDescription>
          Set the price and any discounts for this product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">Price *</FieldLabel>
                  <Input
                    {...field}
                    id="product-price"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    min="0"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                  <FieldDescription>Base price in ₹</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="discountedPrice"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-discounted-price">
                    Discounted Price
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="product-discounted-price"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="0 (optional)"
                    min="0"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                  <FieldDescription>Sale price in ₹</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="makingCharges"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-making-charges">
                    Making Charges
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="product-making-charges"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="0 (optional)"
                    min="0"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                  <FieldDescription>Additional charges in ₹</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
