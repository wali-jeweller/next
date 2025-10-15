import z from "zod";

export const createSizeSchema = z.object({
	categoryId: z.string().min(1, "Category is required"),
	value: z.string().min(1, "Value is required"),
	unit: z.string().optional(),
});

export const editSizeSchema = createSizeSchema.extend({
	sizeIndex: z.number().min(0, "Size index is required"),
});
