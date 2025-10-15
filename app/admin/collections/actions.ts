"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { collections, collectionProducts } from "@/db/schema";
import { protectedAction } from "@/lib/protected-action";
import { collectionSchema, updateCollectionSchema } from "./types";

export const createCollectionAction = protectedAction(
  collectionSchema,
  async (data) => {
    try {
      await db.insert(collections).values(data);
      revalidatePath("/collections");
      revalidatePath(`/collections/${data.slug}`);
      revalidatePath("/collections/new");
      return { success: "Collection created successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to create collection" };
    }
  }
);

export const updateCollectionAction = protectedAction(
  updateCollectionSchema,
  async (data) => {
    try {
      await db.update(collections).set(data).where(eq(collections.id, data.id));
      revalidatePath("/collections");
      revalidatePath(`/collections/${data.slug}`);
      // Also revalidate the layout and any parent pages
      revalidatePath("/collections", "layout");
      return { success: "Collection updated successfully" };
    } catch (error) {
      console.error("Database update failed:", error);
    }
  }
);

export const deleteCollectionAction = protectedAction(
  z.object({ id: z.string() }),
  async (data) => {
    try {
      await db.delete(collections).where(eq(collections.id, data.id));
      revalidatePath("/collections");
      return { success: "Collection deleted successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete collection" };
    }
  }
);

// Product assignment actions
export const assignProductsToCollectionAction = protectedAction(
  z.object({
    collectionId: z.string(),
    productIds: z.array(z.string()),
  }),
  async (data) => {
    try {
      // Remove existing assignments
      await db
        .delete(collectionProducts)
        .where(eq(collectionProducts.collectionId, data.collectionId));

      // Add new assignments with ranks
      if (data.productIds.length > 0) {
        const assignments = data.productIds.map((productId, index) => ({
          collectionId: data.collectionId,
          productId,
          rank: index + 1,
        }));

        await db.insert(collectionProducts).values(assignments);
      }

      revalidatePath("/collections");
      revalidatePath(`/collections/${data.collectionId}`);
      revalidatePath("/collections", "layout");
      return { success: "Products assigned successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to assign products" };
    }
  }
);

export const unassignProductFromCollectionAction = protectedAction(
  z.object({
    collectionId: z.string(),
    productId: z.string(),
  }),
  async (data) => {
    try {
      await db
        .delete(collectionProducts)
        .where(
          and(
            eq(collectionProducts.collectionId, data.collectionId),
            eq(collectionProducts.productId, data.productId)
          )
        );

      revalidatePath("/collections");
      revalidatePath(`/collections/${data.collectionId}`);
      revalidatePath("/collections", "layout");
      return { success: "Product unassigned successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to unassign product" };
    }
  }
);

export const updateProductRanksAction = protectedAction(
  z.object({
    collectionId: z.string(),
    productRanks: z.array(
      z.object({
        productId: z.string(),
        rank: z.number(),
      })
    ),
  }),
  async (data) => {
    try {
      // Update ranks for each product
      for (const { productId, rank } of data.productRanks) {
        await db
          .update(collectionProducts)
          .set({ rank })
          .where(
            and(
              eq(collectionProducts.collectionId, data.collectionId),
              eq(collectionProducts.productId, productId)
            )
          );
      }

      revalidatePath("/collections");
      revalidatePath(`/collections/${data.collectionId}`);
      revalidatePath("/collections", "layout");
      return { success: "Product order updated successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to update product order" };
    }
  }
);
