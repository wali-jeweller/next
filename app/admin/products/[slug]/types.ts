import { z } from "zod";

export const metadataSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const attributesSchema = z.object({
  productId: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
});
