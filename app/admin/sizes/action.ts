"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@repo/db";
import { categories } from "@repo/db/schema";
import { protectedAction } from "@/lib/protected-action";
import { createSizeSchema, editSizeSchema } from "./types";

export const createSizeAction = protectedAction(
  createSizeSchema,
  async (data) => {
    try {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, data.categoryId),
      });

      if (!category) {
        return { error: "Category not found" };
      }

      const allSizes = [
        ...(category.sizes || []),
        {
          value: data.value,
          unit: data.unit || "",
        },
      ];

      await db
        .update(categories)
        .set({
          sizes: allSizes,
        })
        .where(eq(categories.id, data.categoryId));

      revalidatePath("/products/sizes");
      return { success: "Size created successfully" };
    } catch (error) {
      console.error("Error creating size:", error);
      return { error: "Failed to create size" };
    }
  }
);

export const editSizeAction = protectedAction(editSizeSchema, async (data) => {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, data.categoryId),
    });

    if (!category) {
      return { error: "Category not found" };
    }

    if (
      !category.sizes ||
      data.sizeIndex < 0 ||
      data.sizeIndex >= category.sizes.length
    ) {
      return { error: "Size not found" };
    }

    const updatedSizes = [...category.sizes];
    updatedSizes[data.sizeIndex] = {
      value: data.value,
      unit: data.unit || "",
    };

    await db
      .update(categories)
      .set({
        sizes: updatedSizes,
      })
      .where(eq(categories.id, data.categoryId));

    revalidatePath("/products/sizes");
    return { success: "Size updated successfully" };
  } catch (error) {
    console.error("Error updating size:", error);
    return { error: "Failed to update size" };
  }
});

const deleteSizeSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  sizeIndex: z.number().min(0, "Size index is required"),
});

export const deleteSizeAction = protectedAction(
  deleteSizeSchema,
  async (data) => {
    try {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, data.categoryId),
      });

      if (!category) {
        return { error: "Category not found" };
      }

      if (
        !category.sizes ||
        data.sizeIndex < 0 ||
        data.sizeIndex >= category.sizes.length
      ) {
        return { error: "Size not found" };
      }

      const updatedSizes = category.sizes.filter(
        (_, index) => index !== data.sizeIndex
      );

      await db
        .update(categories)
        .set({
          sizes: updatedSizes,
        })
        .where(eq(categories.id, data.categoryId));

      revalidatePath("/products/sizes");
      return { success: "Size deleted successfully" };
    } catch (error) {
      console.error("Error deleting size:", error);
      return { error: "Failed to delete size" };
    }
  }
);
