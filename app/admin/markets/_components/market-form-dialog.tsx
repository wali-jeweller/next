"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { materialEnum } from "@/db/schema";
import { toast } from "sonner";

const materialRateSchema = z.object({
  material: z.enum(materialEnum),
  pricePerGram: z.number().min(0, "Price must be 0 or greater"),
});

const marketFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(3, "Code must be at most 3 characters")
    .toUpperCase(),
  currency: z
    .string()
    .min(3, "Currency code must be 3 characters")
    .max(3)
    .toUpperCase(),
  region: z.string().min(2, "Region must be at least 2 characters"),
  isActive: z.boolean().default(true),
  materialRates: z.array(materialRateSchema),
});

type MarketFormValues = z.infer<typeof marketFormSchema>;

interface MarketFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MarketFormValues) => Promise<void>;
  defaultValues?: Partial<MarketFormValues>;
  mode?: "create" | "edit";
}

const formatMaterialName = (material: string) => {
  return material.charAt(0).toUpperCase() + material.slice(1);
};

export function MarketFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: MarketFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketFormSchema) as Resolver<MarketFormValues>,
    defaultValues: defaultValues || {
      name: "",
      code: "",
      currency: "",
      region: "",
      isActive: true,
      materialRates: materialEnum.map((material) => ({
        material,
        pricePerGram: 0,
      })),
    },
  });

  const handleSubmit = async (data: MarketFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        mode === "create"
          ? "Market created successfully"
          : "Market updated successfully"
      );
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save market"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[50vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "Create New Market" : "Edit Market"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new market with material pricing rates."
              : "Update market details and material pricing rates."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Market Information</CardTitle>
              <CardDescription>Basic details about the market</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="market-name">
                          Market Name *
                        </FieldLabel>
                        <Input
                          {...field}
                          id="market-name"
                          placeholder="e.g., India, United States"
                        />
                        <FieldDescription>
                          The display name of the market
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="code"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="market-code">
                          Market Code *
                        </FieldLabel>
                        <Input
                          {...field}
                          id="market-code"
                          placeholder="e.g., IN, US, AE"
                          maxLength={3}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                        <FieldDescription>
                          2-3 letter ISO country code
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="currency"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="market-currency">
                          Currency *
                        </FieldLabel>
                        <Input
                          {...field}
                          id="market-currency"
                          placeholder="e.g., INR, USD, AED"
                          maxLength={3}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                        <FieldDescription>
                          3-letter ISO currency code
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="region"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="market-region">
                          Region *
                        </FieldLabel>
                        <Input
                          {...field}
                          id="market-region"
                          placeholder="e.g., South Asia, North America"
                        />
                        <FieldDescription>
                          Geographic region of the market
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="market-active" className="text-base">
                          Active Market
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Enable this market for product pricing
                        </p>
                      </div>
                      <Switch
                        id="market-active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Material Rates</CardTitle>
              <CardDescription>
                Set the price per gram for each material in this market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materialEnum.map((material, index) => (
                  <div key={material}>
                    <Controller
                      control={form.control}
                      name={`materialRates.${index}.pricePerGram`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center gap-4 border rounded-lg p-2 bg-muted">
                            <div className="flex-1">
                              <FieldLabel htmlFor={`rate-${material}`}>
                                {formatMaterialName(material)}
                              </FieldLabel>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Input
                                  {...field}
                                  id={`rate-${material}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseFloat(e.target.value)
                                        : 0
                                    )
                                  }
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  per gram
                                </span>
                              </div>
                              {fieldState.invalid && (
                                <FieldError
                                  errors={[fieldState.error]}
                                  className="mt-1"
                                />
                              )}
                            </div>
                          </div>
                        </Field>
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Market"
                : "Update Market"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
