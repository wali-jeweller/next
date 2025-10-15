"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { protectedAction } from "@/lib/protected-action";
import { categorySchema, updateCategorySchema } from "./types";

export const createCategoryAction = protectedAction(
  categorySchema,
  async (data) => {
    try {
      await db.insert(categories).values(data);
      revalidatePath("/categories");
      return { success: "Category created successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to create category" };
    }
  }
);

export const updateCategoryAction = protectedAction(
  updateCategorySchema,
  async (data) => {
    try {
      await db.update(categories).set(data).where(eq(categories.id, data.id));
      revalidatePath("/categories");
      return { success: "Category updated successfully" };
    } catch (error) {
      console.error("Database update failed:", error);
    }
  }
);

export const deleteCategoryAction = protectedAction(
  z.object({ id: z.string() }),
  async (data) => {
    try {
      await db.delete(categories).where(eq(categories.id, data.id));
      revalidatePath("/categories");
      return { success: "Category deleted successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete category" };
    }
  }
);
