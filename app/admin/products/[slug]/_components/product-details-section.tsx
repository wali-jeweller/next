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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genderEnum, materialEnum } from "@/db/schema";
import type { ProductFormValues } from "./types";

export function ProductDetailsSection() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          Specific details about the product materials and specifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Controller
              control={control}
              name="material"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="product-material">Material</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={(value) => field.onChange(value || null)}
                  >
                    <SelectTrigger
                      id="product-material"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialEnum.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>Primary material used</FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="weight"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-weight">
                    Weight (grams)
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="product-weight"
                    type="number"
                    step="0.01"
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00 (optional)"
                    min="0"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                  <FieldDescription>Weight in grams</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="product-gender">Gender</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={(value) => field.onChange(value || null)}
                  >
                    <SelectTrigger
                      id="product-gender"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderEnum.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>Target audience gender</FieldDescription>
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
