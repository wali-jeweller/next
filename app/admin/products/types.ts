import { z } from "zod";
import { visibilityEnum, productStatusEnum } from "@repo/db/schema";

export const productSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(3).max(1000),
  slug: z.string().min(3).max(200),
  visibility: z.enum(visibilityEnum),
  status: z.enum(productStatusEnum),
  categoryId: z.string().min(1, "Category is required"),
});

export const updateProductSchema = productSchema
  .omit({
    categoryId: true,
  })
  .extend({
    id: z.string(),
  });
