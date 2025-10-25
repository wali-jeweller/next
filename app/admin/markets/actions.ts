"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { markets, materialRates, materialEnum } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface CreateMarketInput {
  name: string;
  code: string;
  currency: string;
  region: string;
  isActive: boolean;
  materialRates: Array<{
    material: (typeof materialEnum)[number];
    pricePerGram: number;
  }>;
}

export async function createMarketAction(input: CreateMarketInput) {
  try {
    const result = await db.transaction(async (tx) => {
      // Create the market
      const [market] = await tx
        .insert(markets)
        .values({
          name: input.name,
          code: input.code,
          currency: input.currency,
          region: input.region,
          isActive: input.isActive,
        })
        .returning();

      if (!market) {
        throw new Error("Failed to create market");
      }

      // Create material rates if any have non-zero values
      const ratesToInsert = input.materialRates
        .filter((rate) => rate.pricePerGram > 0)
        .map((rate) => ({
          marketId: market.id,
          material: rate.material,
          pricePerGram: rate.pricePerGram,
        }));

      if (ratesToInsert.length > 0) {
        await tx.insert(materialRates).values(ratesToInsert);
      }

      return market;
    });

    revalidatePath("/admin/markets");
    return { success: true, market: result };
  } catch (error) {
    console.error("Error creating market:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create market",
    };
  }
}

export interface UpdateMarketInput extends CreateMarketInput {
  id: string;
}

export async function updateMarketAction(input: UpdateMarketInput) {
  try {
    const result = await db.transaction(async (tx) => {
      // Update the market
      const [market] = await tx
        .update(markets)
        .set({
          name: input.name,
          code: input.code,
          currency: input.currency,
          region: input.region,
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(eq(markets.id, input.id))
        .returning();

      if (!market) {
        throw new Error("Market not found");
      }

      // Delete existing material rates
      await tx
        .delete(materialRates)
        .where(eq(materialRates.marketId, input.id));

      // Insert new material rates
      const ratesToInsert = input.materialRates
        .filter((rate) => rate.pricePerGram > 0)
        .map((rate) => ({
          marketId: market.id,
          material: rate.material,
          pricePerGram: rate.pricePerGram,
        }));

      if (ratesToInsert.length > 0) {
        await tx.insert(materialRates).values(ratesToInsert);
      }

      return market;
    });

    revalidatePath("/admin/markets");
    return { success: true, market: result };
  } catch (error) {
    console.error("Error updating market:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update market",
    };
  }
}

export async function deleteMarketAction(marketId: string) {
  try {
    await db.delete(markets).where(eq(markets.id, marketId));

    revalidatePath("/admin/markets");
    return { success: true };
  } catch (error) {
    console.error("Error deleting market:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete market",
    };
  }
}
