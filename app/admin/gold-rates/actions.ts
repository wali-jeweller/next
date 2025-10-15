"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { dailyGoldRates, products } from "@/db/schema";
import { protectedAction } from "@/lib/protected-action";

export const setDailyRateAction = protectedAction(
  z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    ratePerGram: z.number().int().min(0, "Rate must be a positive number"),
  }),
  async ({ date, ratePerGram }) => {
    try {
      const existing = await db.query.dailyGoldRates.findFirst({
        where: (dgr, { eq }) => eq(dgr.date, date),
      });

      if (existing) {
        await db
          .update(dailyGoldRates)
          .set({ ratePerGram, updatedAt: new Date() })
          .where(eq(dailyGoldRates.date, date));
      } else {
        await db.insert(dailyGoldRates).values({
          ratePerGram,
          date,
          createdAt: new Date(),
        });
      }

      // Update prices for all gold products based on the new rate
      const goldProducts = await db.query.products.findMany({
        where: (p, { eq }) => eq(p.material, "gold"),
      });

      for (const product of goldProducts) {
        if (product.weight) {
          const newPrice = Math.round(product.weight * ratePerGram);
          await db
            .update(products)
            .set({
              price: newPrice,
              updatedAt: new Date(),
            })
            .where(eq(products.id, product.id));
        }
      }

      await updateAllGoldProductPricesAction({});
      revalidatePath("/gold-rates");
      revalidatePath("/products");
      return { success: true };
    } catch (error) {
      console.error("Failed to set daily rate:", error);
      return { error: "Failed to set daily rate" };
    }
  }
);

export const updateAllGoldProductPricesAction = protectedAction(
  z.object({}),
  async () => {
    try {
      // Get the latest gold rate
      const latestRate = await db.query.dailyGoldRates.findFirst({
        orderBy: (dgr, { desc }) => desc(dgr.date),
      });

      if (!latestRate) {
        return { error: "No gold rate found. Please set a gold rate first." };
      }

      // Update prices for all gold products
      const goldProducts = await db.query.products.findMany({
        where: (p, { eq }) => eq(p.material, "gold"),
      });

      let updatedCount = 0;
      for (const product of goldProducts) {
        if (product.weight) {
          const newPrice = Math.round(product.weight * latestRate.ratePerGram);
          await db
            .update(products)
            .set({
              price: newPrice,
              updatedAt: new Date(),
            })
            .where(eq(products.id, product.id));
          updatedCount++;
        }
      }

      revalidatePath("/gold-rates");
      revalidatePath("/products");
      return { success: true, updatedCount };
    } catch (error) {
      console.error("Failed to update gold product prices:", error);
      return { error: "Failed to update gold product prices" };
    }
  }
);

export const deleteDailyRateAction = protectedAction(
  z.object({
    date: z.string(),
  }),
  async ({ date }) => {
    try {
      await db.delete(dailyGoldRates).where(eq(dailyGoldRates.date, date));

      revalidatePath("/gold-rates");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete daily rate:", error);
      return { error: "Failed to delete daily rate" };
    }
  }
);
