import { db } from "@/db";
import { collectionProducts } from "@/db/schema";
import { cacheTag } from "next/cache";

export const getCollection = async (slug: string) => {
  "use cache";
  return await db.query.collections.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
    with: {
      collectionProducts: {
        with: {
          product: true,
        },
      },
    },
  });
};

export const getCollections = async () => {
  "use cache";
  return await db.query.collections.findMany();
};

export const getProductsInCollection = async (collectionId: string) => {
  "use cache";
  return await db.query.products.findMany({
    where: (p, { eq }) => eq(collectionProducts.collectionId, collectionId),
  });
};

export const getCategories = async () => {
  "use cache";
  return await db.query.categories.findMany();
};

export const getCategory = async (slug: string) => {
  "use cache";
  return await db.query.categories.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
    with: {
      products: true,
    },
  });
};

export const getProduct = async (slug: string) => {
  "use cache";
  cacheTag("product", slug);
  return await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  });
};

export const getProducts = async () => {
  "use cache";
  cacheTag("products");
  return await db.query.products.findMany();
};
