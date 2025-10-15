import { z } from "zod";

export const collectionSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(1000, { message: "Description must be at most 1000 characters long" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(100, { message: "Slug must be at most 100 characters long" }),
  thumbnail: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  id: z.string(),
});

export const updateCollectionSchema = collectionSchema;
