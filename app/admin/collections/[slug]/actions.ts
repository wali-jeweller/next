"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { collectionProducts } from "@/db/schema";
import { protectedAction } from "@/lib/protected-action";

export const bulkAssignToCollectionAction = protectedAction(
  z.object({
    collectionId: z.string(),
    productIds: z.array(z.string()),
  }),
  async ({ collectionId, productIds }) => {
    try {
      // Validate collection exists
      const collection = await db.query.collections.findFirst({
        where: (c, { eq }) => eq(c.id, collectionId),
        columns: { slug: true, id: true },
      });

      if (!collection) {
        return { error: "Collection not found" };
      }

      // Determine already linked products
      const existing = await db
        .select({ productId: collectionProducts.productId })
        .from(collectionProducts)
        .where(
          and(
            eq(collectionProducts.collectionId, collectionId),
            inArray(collectionProducts.productId, productIds)
          )
        );

      const existingIds = new Set(existing.map((e) => e.productId));
      const toInsert = productIds.filter((id) => !existingIds.has(id));

      if (toInsert.length > 0) {
        await db
          .insert(collectionProducts)
          .values(toInsert.map((pid) => ({ collectionId, productId: pid })));
      }

      revalidatePath(`/collections/${collection.slug}`);
      return {
        success: true,
        added: toInsert.length,
        skipped: productIds.length - toInsert.length,
      };
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to assign products to collection" };
    }
  }
);

export const bulkRemoveFromCollectionAction = protectedAction(
  z.object({
    collectionId: z.string(),
    productIds: z.array(z.string()),
  }),
  async ({ collectionId, productIds }) => {
    try {
      // Validate collection exists
      const collection = await db.query.collections.findFirst({
        where: (c, { eq }) => eq(c.id, collectionId),
        columns: { slug: true, id: true },
      });

      if (!collection) {
        return { error: "Collection not found" };
      }

      await db
        .delete(collectionProducts)
        .where(
          and(
            eq(collectionProducts.collectionId, collectionId),
            inArray(collectionProducts.productId, productIds)
          )
        );

      revalidatePath(`/collections/${collection.slug}`);
      return { success: true, removed: productIds.length };
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to remove products from collection" };
    }
  }
);
