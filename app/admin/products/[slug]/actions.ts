"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  collectionProducts,
  productSlugRedirects,
  products,
} from "@/db/schema";
import { protectedAction } from "@/lib/protected-action";
import { updateProductSchema } from "../types";
import { attributesSchema, metadataSchema } from "./types";

export const updateProductAction = protectedAction(
  updateProductSchema,
  async (data) => {
    try {
      const currentProduct = await db.query.products.findFirst({
        where: eq(products.id, data.id),
        columns: { slug: true },
      });

      if (!currentProduct) {
        return { error: "Product not found" };
      }

      // If slug is changing, create a redirect record
      if (data.slug && data.slug !== currentProduct.slug) {
        // Check if redirect already exists for this old slug
        const existingRedirect = await db.query.productSlugRedirects.findFirst({
          where: eq(productSlugRedirects.oldSlug, currentProduct.slug),
        });

        if (!existingRedirect) {
          // Create new redirect record
          await db.insert(productSlugRedirects).values({
            productId: data.id,
            oldSlug: currentProduct.slug,
          });
        }
      }

      const [product] = await db
        .update(products)
        .set({
          ...data,
          // Type cast since we're migrating from old image format to new TImage format
          images: data.images as unknown as typeof products.$inferInsert.images,
        })
        .where(eq(products.id, data.id))
        .returning();

      revalidatePath("/products");
      revalidatePath(`/products/${product?.slug}`);

      if (data.slug && data.slug !== currentProduct.slug) {
        revalidatePath(`/products/${currentProduct.slug}`);
      }

      return { success: "Product updated successfully" };
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to update product" };
    }
  }
);

export const updateProductMetaDataAction = protectedAction(
  metadataSchema,
  async ({ id, title, description }) => {
    try {
      const [product] = await db
        .update(products)
        .set({ metadata: { title, description } })
        .where(eq(products.id, id))
        .returning();
      revalidatePath(`/products/${product?.slug}`);
      return { success: "Metadata updated" };
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to update metadata" };
    }
  }
);

export const assignToCollectionAction = protectedAction(
  z.object({
    collectionId: z.string(),
    productId: z.string(),
  }),
  async ({ collectionId, productId }) => {
    try {
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { id: true, slug: true },
      });

      if (!product) {
        return { error: "Product not found" };
      }

      const collection = await db.query.collections.findFirst({
        where: (c, { eq }) => eq(c.id, collectionId),
        columns: { id: true },
      });

      if (!collection) {
        return { error: "Collection not found" };
      }

      const existing = await db.query.collectionProducts.findFirst({
        where: (cp, { and, eq }) =>
          and(eq(cp.productId, productId), eq(cp.collectionId, collectionId)),
      });

      if (existing) {
        return { error: "Product is already assigned to this collection" };
      }

      await db.insert(collectionProducts).values({
        productId,
        collectionId,
      });

      revalidatePath(`/products/${product.slug}`);
      revalidatePath(`/products`);
      return { success: "Assigned to collection" };
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to assign collection" };
    }
  }
);

export const removeFromCollectionAction = protectedAction(
  z.object({
    collectionId: z.string(),
    productId: z.string(),
  }),
  async ({ collectionId, productId }) => {
    try {
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { id: true, slug: true },
      });

      if (!product) {
        return { error: "Product not found" };
      }

      await db
        .delete(collectionProducts)
        .where(
          and(
            eq(collectionProducts.productId, productId),
            eq(collectionProducts.collectionId, collectionId)
          )
        );

      revalidatePath(`/products/${product.slug}`);
      revalidatePath(`/products`);
      return { success: "Removed from collection" };
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to remove collection" };
    }
  }
);

export const assignToCategoryAction = protectedAction(
  z.object({
    categoryId: z.string(),
    productId: z.string(),
  }),
  async ({ categoryId, productId }) => {
    try {
      const category = await db.query.categories.findFirst({
        where: (c, { eq }) => eq(c.id, categoryId),
        columns: { id: true, title: true, slug: true },
      });

      if (!category) {
        return { error: "Category not found" };
      }

      const [product] = await db
        .update(products)
        .set({
          categoryId: category.id,
        })
        .where(eq(products.id, productId))
        .returning();

      revalidatePath(`/products/${product?.slug}`);
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to assign category" };
    }
  }
);

export const createProductAttributeAction = protectedAction(
  attributesSchema,
  async ({ productId, name, value }) => {
    try {
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { attributes: true },
      });

      if (!product) {
        return { error: "Product not found" };
      }

      const currentAttributes = product.attributes || [];

      const newAttribute = {
        name,
        value,
        rank: currentAttributes.length,
      };

      const updatedAttributes = [...currentAttributes, newAttribute];

      await db
        .update(products)
        .set({ attributes: updatedAttributes })
        .where(eq(products.id, productId));
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to create attribute" };
    }
  }
);

export const updateProductAttributeAction = protectedAction(
  attributesSchema.extend({
    attributeIndex: z.number().min(0, "Index is required"),
  }),
  async ({ attributeIndex, name, value, productId }) => {
    try {
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { attributes: true },
      });

      if (!product) {
        return { error: "Product not found" };
      }

      // Parse current attributes or initialize empty array
      const currentAttributes = product.attributes || [];

      // Update the specific attribute by index
      if (attributeIndex >= currentAttributes.length) {
        return { error: "Attribute index out of bounds" };
      }

      const updatedAttributes = [...currentAttributes];
      updatedAttributes[attributeIndex] = { name, value, rank: attributeIndex };

      await db
        .update(products)
        .set({ attributes: updatedAttributes })
        .where(eq(products.id, productId));
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to update attribute" };
    }
  }
);

export const deleteProductAttributeAction = protectedAction(
  z.object({
    attributeIndex: z.number().min(0, "Index is required"),
    productId: z.string().min(1, "Product ID is required"),
  }),
  async ({ attributeIndex, productId }) => {
    try {
      // Get current product data
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { attributes: true },
      });

      if (!product) {
        return { error: "Product not found" };
      }

      const currentAttributes = product.attributes || [];

      if (attributeIndex >= currentAttributes.length) {
        return { error: "Attribute index out of bounds" };
      }

      const updatedAttributes = currentAttributes.filter(
        (_, index) => index !== attributeIndex
      );

      await db
        .update(products)
        .set({ attributes: updatedAttributes })
        .where(eq(products.id, productId));
    } catch (errors) {
      console.error(errors);
      return { error: "Failed to delete attribute" };
    }
  }
);

export const updateProductAttributesOrderAction = protectedAction(
  z.object({
    productId: z.string().min(1, "ID is required"),
    attributes: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        value: z.string().min(1, "Value is required"),
        rank: z.number().min(0, "Rank is required"),
      })
    ),
  }),
  async ({ productId, attributes }) => {
    try {
      await db
        .update(products)
        .set({
          attributes: attributes.map((attr, index) => ({
            ...attr,
            rank: index,
          })),
        })
        .where(eq(products.id, productId));
    } catch (error) {
      console.error(error);
      return { error: "Failed to update attribute order" };
    }
  }
);

export const updateProductPriceAction = protectedAction(
  z.object({
    productId: z.string(),
    price: z.number().min(0, "Price must be a positive number"),
    weight: z.number().min(0, "Weight must be a positive number").optional(),
    makingCharges: z
      .number()
      .min(0, "Making charges must be a positive number")
      .optional(),
    discountedPrice: z.number().optional(),
  }),
  async (data) => {
    try {
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, data.productId),
        columns: { material: true },
      });

      if (!product) {
        return { error: "Product not found" };
      }

      const updateData: Record<string, unknown> = {
        price: data.price,
        discountedPrice: data.discountedPrice,
      };

      if (data.weight !== undefined) {
        updateData.weight = data.weight;
      }

      if (data.makingCharges !== undefined) {
        updateData.makingCharges = data.makingCharges;
      }

      if (
        product.material?.toLowerCase() === "gold" &&
        data.weight &&
        data.weight > 0
      ) {
        const ratePerGram = await db.query.dailyMaterial.findFirst({
          orderBy: (dgr, { desc }) => desc(dgr.createdAt),
        });
        if (ratePerGram) {
          const basePrice = Math.round(data.weight * ratePerGram.ratePerGram);
          const makingCharges = data.makingCharges || 0;
          updateData.price = basePrice + makingCharges;
        }
      }

      await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, data.productId));
    } catch (error) {
      console.error(error);
      return { error: "Failed to update product price" };
    }
  }
);

export const updateProductMaterialAction = protectedAction(
  z.object({
    productId: z.string(),
    material: z.enum(["gold", "silver", "platinum", "other"]),
  }),
  async (data) => {
    try {
      await db
        .update(products)
        .set({
          material: data.material,
        })
        .where(eq(products.id, data.productId));
    } catch (error) {
      console.error(error);
      return { error: "Failed to update product material" };
    }
  }
);

export const updateProductGenderAction = protectedAction(
  z.object({
    productId: z.string(),
    gender: z.enum(["male", "female", "unisex"]),
  }),
  async (data) => {
    try {
      await db
        .update(products)
        .set({
          gender: data.gender,
        })
        .where(eq(products.id, data.productId));
    } catch (error) {
      console.error(error);
      return { error: "Failed to update product gender" };
    }
  }
);

export const deleteProductImageAction = protectedAction(
  z.object({
    imageUrl: z.string(),
    productId: z.string(),
  }),
  async ({ imageUrl, productId }) => {
    try {
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, productId),
        columns: { images: true },
      });
      if (!product) {
        return { success: false, error: "Product not found" };
      }
      await db
        .update(products)
        .set({
          images: product.images?.filter((image) => image.url !== imageUrl),
        })
        .where(eq(products.id, productId));
      if (product.images?.length === 1) {
        await db
          .update(products)
          .set({ images: [] })
          .where(eq(products.id, productId));
      }
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }
);

export const updateProductImageOrderAction = protectedAction(
  z.object({
    productId: z.string().min(1, "Product ID is required"),
    images: z
      .array(
        z.object({
          url: z.string().min(1, "Image URL is required"),
          rank: z.coerce.number().int(),
        })
      )
      .min(1, "At least one image is required"),
  }),
  async ({ productId, images: imageList }) => {
    try {
      await db
        .update(products)
        .set({ images: imageList })
        .where(eq(products.id, productId));
    } catch (error) {
      console.error(error);
      return { error: "Failed to update images order" };
    }
  }
);
