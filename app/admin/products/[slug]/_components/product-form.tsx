/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { TCategory, TProduct, TImage } from "@/db/schema";
import {
  productStatusEnum,
  visibilityEnum,
  materialEnum,
  genderEnum,
} from "@/db/schema";

import { updateProductAction } from "../actions";
import { ImageLibrarySheet } from "@/components/admin/image-library-sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Upload } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface ProductFormProps {
  product: TProduct;
  categories: TCategory[];
}

// Unsaved changes dialog
function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  onSave,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsaved changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Do you want to save them before leaving?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onDiscard} disabled={isSaving}>
            Discard changes
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Sticky banner for unsaved changes
function UnsavedChangesBanner({
  visible,
  onDiscard,
  onSave,
  isSaving,
}: {
  visible: boolean;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  if (!visible) return null;

  return (
    <Alert className="sticky top-0 z-10 mb-6 border-amber-500/60 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200">
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-3">
        You have changes that are not yet saved.
        <ButtonGroup>
          <Button variant="outline" size="sm" onClick={onDiscard} type="button">
            Discard
          </Button>
          <Button size="sm" onClick={onSave} type="button" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </ButtonGroup>
      </AlertDescription>
    </Alert>
  );
}

// Hook for unsaved changes protection
function useUnsavedChangesPrompt(isDirty: boolean) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (!isDirty) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return { showDialog, setShowDialog, pendingNavigation, setPendingNavigation };
}

// Complete product schema based on the database schema
const productFormSchema = z.object({
  // Basic Information
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters")
    .nullable(),
  slug: z.url(),
  categoryId: z.string(),
  // Visibility & Status
  visibility: z.enum(["public", "private"]),
  status: z.enum([
    "new",
    "featured",
    "sale",
    "trending",
    "coming_soon",
    "available_on_order",
    "out_of_stock",
  ]),

  // Pricing
  price: z.number().min(0, "Price must be 0 or more"),
  discountedPrice: z.number().min(0).nullable(),
  makingCharges: z.number().min(0).nullable(),

  // Product Details
  material: z
    .enum(["gold", "silver", "platinum", "pladium", "other"])
    .nullable(),
  weight: z.number().min(0, "Weight must be positive").nullable(),
  gender: z.enum(["male", "female", "unisex"]).nullable(),

  // SEO Metadata
  metaTitle: z.string().max(60, "Meta title must be at most 60 characters"),
  metaDescription: z
    .string()
    .max(160, "Meta description must be at most 160 characters"),
});

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);

  // Product images - Drizzle already deserializes JSONB
  // Cast to TImage[] since we're now using the new images table structure
  const [productImages, setProductImages] = React.useState<TImage[]>(
    (product.images as unknown as TImage[]) || []
  );

  const metadata = (product.metadata as Record<string, string>) || {};

  // Handle image selection from library
  const handleImageSelect = (images: TImage[]) => {
    setProductImages(images);
    // Mark form as dirty when images change
  };

  const form = useForm({
    defaultValues: {
      title: product.title,
      description: product.description || null,
      slug: product.slug,
      visibility: product.visibility as "public" | "private",
      status: product.status as
        | "new"
        | "featured"
        | "sale"
        | "trending"
        | "coming_soon"
        | "available_on_order"
        | "out_of_stock",
      price: product.price,
      categoryId: product.categoryId,
      discountedPrice: product.discountedPrice ?? null,
      makingCharges: product.makingCharges ?? null,
      material:
        (product.material as
          | "gold"
          | "silver"
          | "platinum"
          | "pladium"
          | "other") ?? null,
      weight: product.weight ?? null,
      gender: (product.gender as "male" | "female" | "unisex") ?? null,
      metaTitle: metadata.title || "",
      metaDescription: metadata.description || "",
    },
    onSubmit: async ({ value }) => {
      setIsSaving(true);
      try {
        // Validate with Zod
        const validated = productFormSchema.safeParse(value);
        if (!validated.success) {
          toast.error("Please fix validation errors");
          setIsSaving(false);
          return;
        }

        const result = await updateProductAction({
          id: product.id,
          title: value.title,
          description: value.description ?? "",
          slug: value.slug,
          visibility: value.visibility,
          status: value.status,
          images: productImages,
        });

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success("Product updated successfully");
        router.refresh();
      } catch {
        toast.error("Failed to update product");
      } finally {
        setIsSaving(false);
      }
    },
  });

  const isDirty = form.state.isDirty;
  useUnsavedChangesPrompt(isDirty);

  const generateSlug = () => {
    const titleField = form.getFieldValue("title");
    const newSlug = titleField
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    form.setFieldValue("slug", newSlug);
  };

  const handleDiscard = () => {
    form.reset();
    setShowUnsavedDialog(false);
  };

  const handleSave = () => {
    form.handleSubmit();
    setShowUnsavedDialog(false);
  };

  return (
    <>
      <UnsavedChangesBanner
        visible={isDirty}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid gap-4 lg:grid-cols-[2fr_1fr]"
      >
        {/* Left Column - Main Content */}
        <div className="space-y-4">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-6">
                {/* Title */}
                <form.Field
                  name="title"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Product Title *
                        </FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="e.g., Diamond Necklace"
                        />
                        <FieldDescription>
                          The name of your product as it will appear to
                          customers
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Description */}
                <form.Field
                  name="description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          value={field.state.value ?? ""}
                          onChange={(e) =>
                            field.handleChange(e.target.value || null)
                          }
                          onBlur={field.handleBlur}
                          placeholder="Detailed description of the product..."
                          rows={6}
                        />
                        <FieldDescription>
                          Provide a detailed description including features,
                          materials, and craftsmanship
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Slug */}
                <form.Field
                  name="slug"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>URL Slug *</FieldLabel>
                        <ButtonGroup>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="product-slug"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateSlug}
                          >
                            Generate
                          </Button>
                        </ButtonGroup>
                        <FieldDescription>
                          URL-friendly version of the product name
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="categoryId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.state.value || ""}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </CardContent>
          </Card>
          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Upload and manage product images
              </CardDescription>
              <CardAction>
                <ImageLibrarySheet
                  onSelect={handleImageSelect}
                  selectedImages={productImages}
                  multiSelect={true}
                  trigger={
                    <Button variant="outline" type="button" size={"icon-sm"}>
                      <Upload className="size-4" />
                    </Button>
                  }
                />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display currently assigned images */}
              {productImages.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Assigned Images ({productImages.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {productImages.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-lg overflow-hidden border"
                      >
                        <img
                          src={img.url}
                          alt={img.filename}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant={"icon"}>
                      <Upload className="size-6" />
                    </EmptyMedia>
                    <EmptyContent>
                      <EmptyTitle>No images assigned</EmptyTitle>
                      <EmptyDescription>
                        Click the button above to select images from your
                        library
                      </EmptyDescription>
                    </EmptyContent>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
          {/* Pricing Card */}
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
                  {/* Price */}
                  <form.Field
                    name="price"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Price *</FieldLabel>
                          <Input
                            id={field.name}
                            type="number"
                            step="1"
                            min="0"
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(parseInt(e.target.value) || 0)
                            }
                            onBlur={field.handleBlur}
                            placeholder="0"
                          />
                          <FieldDescription>Base price in ₹</FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Discounted Price */}
                  <form.Field
                    name="discountedPrice"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Discounted Price
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type="number"
                            step="1"
                            min="0"
                            value={field.state.value ?? ""}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            onBlur={field.handleBlur}
                            placeholder="0 (optional)"
                          />
                          <FieldDescription>Sale price in ₹</FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Making Charges */}
                  <form.Field
                    name="makingCharges"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Making Charges
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type="number"
                            step="1"
                            min="0"
                            value={field.state.value ?? ""}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            onBlur={field.handleBlur}
                            placeholder="0 (optional)"
                          />
                          <FieldDescription>
                            Additional charges in ₹
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Product Details Card */}
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
                  {/* Material */}
                  <form.Field
                    name="material"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Material</FieldLabel>
                          <Select
                            value={field.state.value ?? ""}
                            onValueChange={(value) => {
                              if (value) {
                                field.handleChange(
                                  value as
                                    | "gold"
                                    | "silver"
                                    | "platinum"
                                    | "pladium"
                                    | "other"
                                );
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialEnum.map((material) => (
                                <SelectItem key={material} value={material}>
                                  {material.charAt(0).toUpperCase() +
                                    material.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldDescription>
                            Primary material used
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Weight */}
                  <form.Field
                    name="weight"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Weight (grams)
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.state.value ?? ""}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                            onBlur={field.handleBlur}
                            placeholder="0.00 (optional)"
                          />
                          <FieldDescription>Weight in grams</FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Gender */}
                  <form.Field
                    name="gender"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                          <Select
                            value={field.state.value ?? ""}
                            onValueChange={(value) => {
                              if (value) {
                                field.handleChange(
                                  value as "male" | "female" | "unisex"
                                );
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {genderEnum.map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {gender.charAt(0).toUpperCase() +
                                    gender.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldDescription>
                            Target audience gender
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Visibility & Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility & Status</CardTitle>
              <CardDescription>
                Control how and where this product appears
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-6">
                {/* Visibility */}
                <form.Field
                  name="visibility"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Visibility *
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value as "public" | "private")
                          }
                        >
                          <SelectTrigger>
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Status */}
                <form.Field
                  name="status"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Status *</FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(
                              value as
                                | "new"
                                | "featured"
                                | "sale"
                                | "trending"
                                | "coming_soon"
                                | "available_on_order"
                                | "out_of_stock"
                            )
                          }
                        >
                          <SelectTrigger>
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
                                      status === "trending" && "bg-pink-500"
                                    )}
                                  />
                                  {status
                                    .replace(/_/g, " ")
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldDescription>
                          Status badges shown on the product
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          {/* SEO Card */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                Optimize how this product appears in search results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-6">
                {/* Meta Title */}
                <form.Field
                  name="metaTitle"
                  children={(field) => {
                    const charCount = field.state.value?.length || 0;
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Meta Title</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="Page title for search results"
                            maxLength={60}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText>{charCount}/60</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="metaDescription"
                  children={(field) => {
                    const charCount = field.state.value?.length || 0;
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Meta Description
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="Brief description for search results"
                            rows={3}
                            maxLength={160}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText>{charCount}/160</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Save Button - Full Width Below Grid */}
      <Card>
        <CardFooter className="justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            All fields marked with * are required
          </p>
          <ButtonGroup>
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscard}
              disabled={!isDirty || isSaving}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !isDirty}
              onClick={() => form.handleSubmit()}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
}
