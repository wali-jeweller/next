"use client";

import { MoreVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MultipleImageUpload } from "@/components/file-upload";
import type { TProduct } from "@repo/db/schema";
import { updateProductImagesAction } from "../../actions";

export function ImageUploader({ product }: { product: TProduct }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Convert product images to URL array for the new component
  const imageUrls = product.images?.map((img) => img.url) || [];

  const handleImageChange = async (newUrls: string[]) => {
    try {
      const result = await updateProductImagesAction({
        productId: product.id,
        imageUrls: newUrls,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        toast.success(result.success);
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating product images:", error);
      toast.error("Failed to update product images");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Product Images</DialogTitle>
          <DialogDescription>
            Upload, remove, and reorder images for this product. Images will be
            automatically saved and ranked.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <MultipleImageUpload
            value={imageUrls}
            onChange={handleImageChange}
            maxFiles={10}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
