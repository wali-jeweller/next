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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { productStatusEnum, visibilityEnum } from "@/db/schema";
import type { ProductFormValues } from "./types";

const formatStatus = (status: (typeof productStatusEnum)[number]) =>
  status
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function VisibilityStatusSection() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibility & Status</CardTitle>
        <CardDescription>
          Control how and where this product appears
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <Controller
            control={control}
            name="visibility"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="product-visibility">
                    Visibility *
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="product-visibility"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityEnum.map((visibility) => (
                      <SelectItem key={visibility} value={visibility}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              visibility === "public"
                                ? "bg-green-500"
                                : "bg-slate-400"
                            )}
                          />
                          {visibility.charAt(0).toUpperCase() +
                            visibility.slice(1)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Public products are visible to all customers
                </FieldDescription>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="product-status">Status *</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="product-status"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {productStatusEnum.map((status) => (
                      <SelectItem key={status} value={status}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              status === "new" && "bg-emerald-500",
                              status === "featured" && "bg-sky-500",
                              status === "sale" && "bg-amber-500",
                              status === "trending" && "bg-pink-500",
                              status === "coming_soon" && "bg-purple-500",
                              status === "available_on_order" && "bg-blue-500",
                              status === "out_of_stock" && "bg-slate-400"
                            )}
                          />
                          {formatStatus(status)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Status badges shown on the product
                </FieldDescription>
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
