import { z } from "zod";
import {
  genderEnum,
  materialEnum,
  productStatusEnum,
  visibilityEnum,
} from "@/db/schema";

export const marketPricingSchema = z.object({
  marketId: z.string(),
  marketName: z.string(),
  currency: z.string(),
  basePrice: z.number().min(0).nullable(),
  makingCharges: z.number().min(0).default(0),
  discountPercentage: z.number().min(0).max(100).default(0),
});

export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters")
    .nullable(),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug must be at most 200 characters"),
  categoryId: z.string(),
  visibility: z.enum(visibilityEnum),
  status: z.enum(productStatusEnum),
  material: z.enum(materialEnum).nullable(),
  weight: z.number().min(0, "Weight must be positive").nullable(),
  gender: z.enum(genderEnum).nullable(),
  metaTitle: z
    .string()
    .trim()
    .max(60, "Meta title must be at most 60 characters"),
  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description must be at most 160 characters"),
  marketPricing: z.array(marketPricingSchema),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type MarketPricingFormValue = z.infer<typeof marketPricingSchema>;
