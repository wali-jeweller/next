"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { isEqual } from "lodash";
import { Button } from "@/components/ui/button";
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
import { ImageUpload } from "@/components/file-upload";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/categories/actions";
import { categorySchema } from "@/app/categories/types";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { TCategory } from "@repo/db/schema";
import Image from "next/image";

type FormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: TCategory;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();

  const originalValues = useMemo(
    () => ({
      title: category?.title || "",
      description: category?.description || "",
      slug: category?.slug || "",
      thumbnail: category?.thumbnail || "",
      id: category?.id || "",
    }),
    [category]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: originalValues,
  });

  // Auto-generate slug from title for new categories
  useEffect(() => {
    if (!category) {
      const subscription = form.watch((values, { name }) => {
        if (name === "title" && values.title) {
          const slug = values.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          form.setValue("slug", slug);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [form, category]);

  const onSubmit = async (values: FormValues) => {
    if (!values.thumbnail) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    try {
      const encodedSlug = encodeURIComponent(values.slug);
      const formData = {
        ...values,
        slug: encodedSlug,
        thumbnail: values.thumbnail,
      };

      let result;
      if (category) {
        // Update existing category
        result = await updateCategoryAction({
          ...formData,
          id: category.id,
        });
      } else {
        // Create new category
        const id = crypto.randomUUID();
        form.setValue("id", id);
        result = await createCategoryAction({
          ...formData,
          id,
        });
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        toast.success(result.success);

        // For updates, reset the form's original values to current values
        if (category) {
          const currentValues = form.getValues();
          form.reset(currentValues);
        }

        // Force a hard refresh to get updated data
        router.refresh();

        // For updates, give the server a moment to process then refresh again
        if (category) {
          setTimeout(() => {
            router.refresh();
          }, 100);
        }

        // Only navigate away for new categories
        if (!category) {
          router.push(`/categories/${encodedSlug}`);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save category");
    }
  };

  const pending = form.formState.isSubmitting;

  // Watch all form values to detect changes
  const currentFormValues = form.watch();

  // Check if form data has changed
  const hasChanges = useMemo(() => {
    // For new categories, always allow save
    if (!category) return true;

    // Compare current form values with original (excluding id)
    const { id: _currentId, ...currentWithoutId } = currentFormValues;
    const { id: _originalId, ...originalWithoutId } = originalValues;

    // Suppress unused variable warnings
    void _currentId;
    void _originalId;

    return !isEqual(currentWithoutId, originalWithoutId);
  }, [currentFormValues, originalValues, category]);

  const handleDelete = async () => {
    if (!category) return;

    try {
      const result = await deleteCategoryAction({ id: category.id });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        toast.success(result.success);
        router.push("/categories");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <Form {...form}>
      <div className="h-full overflow-y-auto">
        <header className="border-b p-4 mb-6 flex items-center justify-between">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {category ? "Edit Category" : "Create Category"}
              <span>
                {category && hasChanges && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                )}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {category && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this category? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <div className="fixed right-0 bottom-0 p-4">
              <Button
                type="submit"
                form="category-form"
                size={"sm"}
                loading={pending}
                disabled={pending || (category && !hasChanges)}
                className="flex items-center gap-2"
                variant={category && !hasChanges ? "outline" : "default"}
              >
                {pending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </header>
        <div>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4 max-w-2xl mx-auto"
          >
            <Image
              src={category?.thumbnail || ""}
              alt={category?.title || ""}
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
                    <Input {...field} placeholder="Enter category title" />
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
                      placeholder="Enter category description"
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
                      <Input {...field} disabled={Boolean(category)} />
                      {!category && (
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
                      )}
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
      </div>
    </Form>
  );
}

// Create Category Button for sidebar
export function CreateCategoryButton() {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/categories/new">
        <Plus className="w-4 h-4" />
      </Link>
    </Button>
  );
}
