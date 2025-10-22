/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TCategory, TImage, TProduct } from "@/db/schema";
import {
  genderEnum,
  materialEnum,
  productStatusEnum,
  visibilityEnum,
} from "@/db/schema";
import { updateProductAction } from "../actions";
import { productFormSchema, type ProductFormValues } from "./types";
import { BasicInformationSection } from "./basic-information-section";
import { PricingSection } from "./pricing-section";
import { ProductDetailsSection } from "./product-details-section";
import { VisibilityStatusSection } from "./visibility-status-section";
import { MetadataSection } from "./metadata-section";
import { MediaSection } from "./media-section";

interface ProductFormProps {
  product: TProduct;
  categories: TCategory[];
}

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
}

function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  onSave,
  isSaving,
}: UnsavedChangesDialogProps) {
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

interface UnsavedChangesBannerProps {
  visible: boolean;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
}

function useUnsavedChangesPrompt(isDirty: boolean) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return { showDialog, setShowDialog, pendingNavigation, setPendingNavigation };
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);

  const [productImages, setProductImages] = React.useState<TImage[]>(
    (product.images as unknown as TImage[]) || []
  );

  const metadata =
    (product.metadata as Record<string, string | undefined>) || {};

  const defaultValues: ProductFormValues = {
    title: product.title ?? "",
    description: product.description ?? null,
    slug: product.slug ?? "",
    visibility: product.visibility as (typeof visibilityEnum)[number],
    status: product.status as (typeof productStatusEnum)[number],
    price: product.price ?? 0,
    categoryId: product.categoryId ?? "",
    discountedPrice: product.discountedPrice ?? null,
    makingCharges: product.makingCharges ?? null,
    material: (product.material as (typeof materialEnum)[number]) ?? null,
    weight: product.weight ?? null,
    gender: (product.gender as (typeof genderEnum)[number]) ?? null,
    metaTitle: metadata.title ?? "",
    metaDescription: metadata.description ?? "",
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const initialImagesRef = React.useRef<TImage[]>(productImages);
  const hasImageChanges = React.useMemo(() => {
    return (
      JSON.stringify(productImages) !== JSON.stringify(initialImagesRef.current)
    );
  }, [productImages]);

  const isDirty = form.formState.isDirty || hasImageChanges;
  useUnsavedChangesPrompt(isDirty);

  const generateSlug = () => {
    const titleField = form.getValues("title") ?? "";
    const newSlug = titleField
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    form.setValue("slug", newSlug, { shouldDirty: true });
  };

  const handleImageSelect = (images: TImage[]) => {
    setProductImages(images);
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSaving(true);
    try {
      const result = await updateProductAction({
        id: product.id,
        title: data.title,
        description: data.description ?? "",
        slug: data.slug,
        visibility: data.visibility,
        status: data.status,
        images: productImages,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Product updated successfully");
      form.reset(data);
      initialImagesRef.current = productImages;
      router.refresh();
    } catch {
      toast.error("Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    form.reset();
    setProductImages((product.images as unknown as TImage[]) || []);
    initialImagesRef.current = (product.images as unknown as TImage[]) || [];
    setShowUnsavedDialog(false);
  };

  const handleSave = () => {
    void form.handleSubmit(onSubmit)();
    setShowUnsavedDialog(false);
  };

  return (
    <>
      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 lg:grid-cols-[2fr_1fr]"
        >
          <div className="space-y-4">
            <BasicInformationSection
              categories={categories}
              onGenerateSlug={generateSlug}
            />

            <MediaSection
              productImages={productImages}
              onImageSelect={handleImageSelect}
            />

            <PricingSection />

            <ProductDetailsSection />
          </div>

          <div className="space-y-4">
            <VisibilityStatusSection />

            <MetadataSection />
          </div>
        </form>
      </FormProvider>

      <div className="fixed bottom-6 right-6 z-50">
        {isDirty && (
          <ButtonGroup>
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscard}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </ButtonGroup>
        )}
      </div>
    </>
  );
}
