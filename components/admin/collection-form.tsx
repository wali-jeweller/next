"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { isEqual } from "lodash";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VirtualizedCombobox } from "./virtualized-combobox";
import { SortableProductList } from "./sortable-product-list";
import { ImageUpload } from "@/components/file-upload";
import {
  createCollectionAction,
  updateCollectionAction,
  assignProductsToCollectionAction,
  updateProductRanksAction,
} from "@/app/collections/actions";
import { collectionSchema } from "@/app/collections/types";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";

import type { TCollection, TProduct } from "@repo/db/schema";
import Image from "next/image";

type FormValues = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  collection?: TCollection;
  products: Promise<TProduct[]>;
  assignedProductIds?: string[];
}

interface SortableProduct {
  id: string;
  title: string;
  image?: string;
  price?: number;
  rank: number;
}

export function CollectionForm({
  collection,
  products,
  assignedProductIds = [],
}: CollectionFormProps) {
  const router = useRouter();

  const productsData = use(products);

  // Convert products to combobox format
  const productOptions = useMemo(() => {
    return productsData.map((product) => ({
      id: product.id,
      label: product.title,
      image: product.images?.[0]?.url,
      price: product.price,
      subtitle: product.categoryId
        ? `Category ID: ${product.categoryId}`
        : undefined,
    }));
  }, [productsData]);

  // Convert assigned products to sortable format
  const [assignedProducts, setAssignedProducts] = useState<SortableProduct[]>(
    () => {
      if (!collection || !assignedProductIds.length) return [];

      return assignedProductIds
        .map((productId) => {
          const product = productsData.find((p) => p.id === productId);
          if (!product) return null;

          return {
            id: product.id,
            title: product.title,
            image: product.images?.[0]?.url,
            price: product.price,
            rank: 1, // Will be updated based on order
          };
        })
        .filter(Boolean) as SortableProduct[];
    }
  );

  const [originalValues, setOriginalValues] = useState<FormValues>(() => ({
    title: collection?.title || "",
    description: collection?.description || "",
    slug: collection?.slug || "",
    thumbnail: collection?.thumbnail || "",
    visibility: collection?.visibility || "public",
    id: collection?.id || crypto.randomUUID(),
  }));

  // Update original values when collection prop changes
  useEffect(() => {
    if (collection) {
      const newOriginalValues: FormValues = {
        title: collection.title || "",
        description: collection.description || "",
        slug: collection.slug || "",
        thumbnail: collection.thumbnail || "",
        visibility: collection.visibility || "public",
        id: collection.id,
      };
      setOriginalValues(newOriginalValues);
    }
  }, [collection]);

  const form = useForm<FormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: originalValues,
  });

  const handleProductSelection = (selectedIds: string[]) => {
    const newAssignedProducts = selectedIds
      .map((productId) => {
        const product = productsData.find((p) => p.id === productId);
        if (!product) return null;

        const existingIndex = assignedProducts.findIndex(
          (p) => p.id === productId
        );
        if (existingIndex !== -1) return null;

        return {
          id: product.id,
          title: product.title,
          image: product.images?.[0]?.url,
          price: product.price,
          rank: assignedProducts.length + 1,
        };
      })
      .filter(Boolean) as SortableProduct[];

    setAssignedProducts([...assignedProducts, ...newAssignedProducts]);
  };

  const handleProductReorder = async (reorderedProducts: SortableProduct[]) => {
    setAssignedProducts(reorderedProducts);

    // If editing existing collection, update ranks in database
    if (collection) {
      const productRanks = reorderedProducts.map((product, index) => ({
        productId: product.id,
        rank: index + 1,
      }));

      const result = await updateProductRanksAction({
        collectionId: collection.id,
        productRanks,
      });

      if (result?.error) {
        toast.error(result.error);
      }
    }
  };

  // Handle product removal
  const handleProductRemove = (productId: string) => {
    setAssignedProducts(assignedProducts.filter((p) => p.id !== productId));
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      const encodedSlug = encodeURIComponent(values.slug);
      const formData = {
        ...values,
        slug: encodedSlug,
        thumbnail: values.thumbnail,
      };

      let result;
      if (collection) {
        // Update existing collection
        result = await updateCollectionAction(formData);
      } else {
        // Create new collection
        result = await createCollectionAction(formData);
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        // Assign products to the collection if there are any
        if (assignedProducts.length > 0) {
          const productIds = assignedProducts.map((p) => p.id);
          const assignResult = await assignProductsToCollectionAction({
            collectionId: values.id,
            productIds,
          });

          if (assignResult?.error) {
            toast.error(
              `Collection saved but failed to assign products: ${assignResult.error}`
            );
          }
        }

        toast.success(result.success);

        // For updates, reset the form's original values to current values
        // This prevents the form from thinking there are still changes
        if (collection) {
          const currentValues = form.getValues();
          form.reset(currentValues);
          setOriginalValues(currentValues);
        }

        // Force a hard refresh to get updated data
        router.refresh();

        // For updates, give the server a moment to process then refresh again
        if (collection) {
          setTimeout(() => {
            router.refresh();
          }, 100);
        }

        // Only navigate away for new collections
        if (!collection) {
          router.push(`/collections/${encodedSlug}`);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save collection");
    }
  };

  const pending = form.formState.isSubmitting;

  const visibility = form.watch("visibility");

  // Watch all form values to detect changes
  const currentFormValues = form.watch();

  // Track original assigned product IDs
  const originalProductIds = useMemo(() => {
    return assignedProductIds.sort();
  }, [assignedProductIds]);

  // Check if form data has changed
  const formDataChanged = useMemo(() => {
    // For new collections, always allow save
    if (!collection) return true;

    // Compare current form values with original (excluding id)
    const { id: _currentId, ...currentWithoutId } = currentFormValues;
    const { id: _originalId, ...originalWithoutId } = originalValues;

    // Suppress unused variable warnings
    void _currentId;
    void _originalId;

    return !isEqual(currentWithoutId, originalWithoutId);
  }, [currentFormValues, originalValues, collection]);

  // Check if assigned products have changed
  const productsChanged = useMemo(() => {
    // For new collections, consider changed if products are assigned
    if (!collection) return assignedProducts.length > 0;

    // Compare current product IDs with original
    const currentProductIds = assignedProducts.map((p) => p.id).sort();
    return !isEqual(currentProductIds, originalProductIds);
  }, [assignedProducts, originalProductIds, collection]);

  // Overall change detection
  const hasChanges = formDataChanged || productsChanged;

  return (
    <Form {...form}>
      <div>
        {/* Collection Details */}
        <div className="space-y-6">
          <header className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-1">
                  {collection ? "Edit Collection" : "Create New Collection"}
                  <span>
                    {collection && hasChanges && (
                      <div className="flex items-center gap-1 text-sm text-amber-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {collection
                    ? "Update collection details and manage products"
                    : "Create a new collection and assign products to it"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={field.value === "public"}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? "public" : "private")
                            }
                          />
                          <Badge
                            variant={
                              visibility === "public" ? "outline" : "secondary"
                            }
                          >
                            {visibility === "public" ? "Public" : "Private"}
                          </Badge>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="fixed right-0 bottom-0 p-4">
                  <Button
                    type="submit"
                    form="collection-form"
                    size={"sm"}
                    loading={pending}
                    disabled={pending || (collection && !hasChanges)}
                    className="flex items-center gap-2"
                    variant={collection && !hasChanges ? "outline" : "default"}
                  >
                    {pending ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </header>
          <form
            id="collection-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4 max-w-2xl mx-auto"
          >
            <Image
              src={collection?.thumbnail || ""}
              alt={collection?.title || ""}
              height={500}
              width={500}
              className="object-cover h-full w-full"
            />
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter collection title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter collection description"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className="relative flex gap-1">
                      <Input {...field} />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          const titleValue = form.getValues("title");
                          const generatedSlug = titleValue
                            .toLowerCase()
                            .trim()
                            .replace(/\s+/g, "-");
                          form.setValue("slug", generatedSlug);
                        }}
                      >
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Upload */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </div>

        {/* Product Selection */}
        <div className="space-y-2 p-4 max-w-2xl mx-auto">
          <div>
            <Label>Product Selection</Label>
          </div>

          <VirtualizedCombobox
            options={productOptions}
            value={assignedProducts.map((p) => p.id)}
            onChange={handleProductSelection}
            placeholder="Search and select products..."
            searchPlaceholder="Search products..."
            emptyText="No products found"
            maxHeight={300}
          />

          <SortableProductList
            products={assignedProducts}
            onReorder={handleProductReorder}
            onRemove={handleProductRemove}
          />
        </div>
      </div>
    </Form>
  );
}
export function CreateCollectionButton() {
  return (
    <Button variant="ghost" asChild>
      <Link href="/collections/new">
        <Plus className="h-4 w-4" />
      </Link>
    </Button>
  );
}
