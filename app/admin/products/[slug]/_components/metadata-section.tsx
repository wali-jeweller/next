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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { ProductFormValues } from "./types";

export function MetadataSection() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
        <CardDescription>
          Optimize how this product appears in search results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <Controller
            control={control}
            name="metaTitle"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-meta-title">Meta Title</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="product-meta-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Page title for search results"
                    maxLength={60}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText>{field.value.length}/60</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="metaDescription"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-meta-description">
                  Meta Description
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="product-meta-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Brief description for search results"
                    rows={3}
                    maxLength={160}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText>{field.value.length}/160</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
