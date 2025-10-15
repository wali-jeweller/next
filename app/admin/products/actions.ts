"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@repo/db";
import { products } from "@repo/db/schema";
import { protectedAction } from "@/lib/protected-action";
import { addRetryJob } from "@/lib/retry-queue";
import { productSchema } from "./types";

export const createProductAction = protectedAction(
  productSchema,
  async (data) => {
    let slug = "";
    try {
      const [product] = await db
        .insert(products)
        .values({
          ...data,
          metadata: {
            title: data.title,
            description: data.description,
          },
        })
        .returning();

      if (!product.slug) {
        throw new Error("No slug found");
      }
      slug = product.slug;
      revalidatePath("/products");
    } catch (error) {
      console.error(error);
      return { error: "Failed to create product" };
    }
    redirect(`/products/${slug}`);
  }
);

export const deleteProductAction = protectedAction(
  z.object({
    id: z.string(),
  }),
  async ({ id }) => {
    try {
      await db.delete(products).where(eq(products.id, id));
      revalidatePath("/products");
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete product" };
    }
  }
);

export const addProductImageAction = protectedAction(
  z.object({
    productId: z.string(),
    imageUrl: z.string(),
  }),
  async ({ productId, imageUrl }) => {
    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, productId),
      columns: { images: true },
    });
    try {
      await db
        .update(products)
        .set({
          images: [...(product?.images || []), { url: imageUrl, rank: 0 }],
        })
        .where(eq(products.id, productId));

      revalidatePath("/products");
      revalidatePath(`/products/${productId}`);
      return { success: "Image added successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to add image" };
    }
  }
);

export const addMultipleProductImagesAction = protectedAction(
  z.object({
    productId: z.string(),
    images: z.array(
      z.object({
        url: z.string(),
      })
    ),
  }),
  async ({ productId, images: imageData }) => {
    try {
      // Get current max rank
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { images: true },
      });

      // Prepare batch insert data
      const imagesToInsert = imageData.map((image) => ({
        productId,
        url: image.url,
        rank: (product?.images?.length ?? 0) + 1,
      }));

      // Batch insert all images
      await db
        .update(products)
        .set({
          images: [...(product?.images || []), ...imagesToInsert],
        })
        .where(eq(products.id, productId));

      revalidatePath("/products");
      revalidatePath(`/products/${productId}`);
      return { success: `${imageData.length} images added successfully` };
    } catch (error) {
      console.error(error);
      return { error: "Failed to add images" };
    }
  }
);

export const updateProductImagesAction = protectedAction(
  z.object({
    productId: z.string(),
    imageUrls: z.array(z.string()),
  }),
  async ({ productId, imageUrls }) => {
    try {
      // Convert URLs to the expected format with ranks
      const images = imageUrls.map((url, index) => ({
        url,
        alt: `Product image ${index + 1}`,
        rank: index,
      }));

      const existingProduct = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { images: true },
      });
      if (!existingProduct) {
        return { error: "Product not found" };
      }
      const existingImages = existingProduct.images || [];
      const newImages = images.filter(
        (image) => !existingImages.some((i) => i.url === image.url)
      );
      const updatedImages = [...existingImages, ...newImages];
      await db
        .update(products)
        .set({ images: updatedImages })
        .where(eq(products.id, productId));

      revalidatePath("/products");
      revalidatePath(`/products/${productId}`);
      return { success: "Product images updated successfully" };
    } catch (error) {
      console.error("Database update failed:", error);

      // Add to retry queue for later processing
      try {
        await addRetryJob("updateProductImages", { productId, imageUrls });
        return {
          success:
            "Images uploaded successfully. Database update queued for retry.",
          queued: true,
        };
      } catch (queueError) {
        console.error("Failed to add retry job:", queueError);
        return { error: "Failed to update product images" };
      }
    }
  }
);
