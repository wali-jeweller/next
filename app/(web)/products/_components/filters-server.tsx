"use cache";

import { db } from "@/db";
import { Filter } from "./filter";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function FiltersServer() {
  // Optimized price stats
  const [{ min, max }] = await db
    .select({ min: sql<number>`min(price)`, max: sql<number>`max(price)` })
    .from(products);
  const priceRange = { min: min ?? 0, max: max ?? 1000 };

  // Optimized materials and genders using groupBy
  const materialsRows = await db
    .select({ material: products.material })
    .from(products)
    .groupBy(products.material);
  const gendersRows = await db
    .select({ gender: products.gender })
    .from(products)
    .groupBy(products.gender);
  const uniqueMaterials = materialsRows
    .map((r) => r.material)
    .filter(Boolean) as string[];
  const uniqueGenders = gendersRows
    .map((r) => r.gender)
    .filter(Boolean) as string[];

  // Categories that have products
  const categoryIdsRows = await db
    .select({ categoryId: products.categoryId })
    .from(products)
    .where(sql`category_id is not null`)
    .groupBy(products.categoryId);
  const categoryIds = categoryIdsRows
    .map((r) => r.categoryId)
    .filter(Boolean) as string[];
  const categoriesWithProducts = await db.query.categories.findMany({
    where: (c, { inArray }) => inArray(c.id, categoryIds),
  });

  return (
    <Filter
      materials={uniqueMaterials}
      genders={uniqueGenders}
      categories={categoriesWithProducts}
      priceRange={priceRange}
    />
  );
}
