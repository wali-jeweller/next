import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TCategory } from "@/db/schema";
import type { ProductFormValues } from "./types";

interface BasicInformationSectionProps {
  categories: TCategory[];
  onGenerateSlug: () => void;
}

export function BasicInformationSection({
  categories,
  onGenerateSlug,
}: BasicInformationSectionProps) {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Essential details about your product</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-title">Product Title *</FieldLabel>
                <Input
                  {...field}
                  id="product-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g., Diamond Necklace"
                />
                <FieldDescription>
                  The name of your product as it will appear to customers
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-description">
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value.length > 0 ? e.target.value : null)
                  }
                  id="product-description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Detailed description of the product..."
                  rows={6}
                />
                <FieldDescription>
                  Provide a detailed description including features, materials, and
                  craftsmanship
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-slug">URL Slug *</FieldLabel>
                <ButtonGroup>
                  <Input
                    {...field}
                    id="product-slug"
                    aria-invalid={fieldState.invalid}
                    placeholder="product-slug"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onGenerateSlug}
                  >
                    Generate
                  </Button>
                </ButtonGroup>
                <FieldDescription>
                  URL-friendly version of the product name
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="product-category">Category</FieldLabel>
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
                    id="product-category"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
