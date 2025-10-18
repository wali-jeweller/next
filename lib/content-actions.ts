"use server";

import { db } from "@/db";
import { contentPages, type ContentBlock } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { protectedAction } from "./protected-action";
import { z } from "zod";

const contentBlockSchema: z.ZodType<ContentBlock> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.enum(['header', 'section', 'grid', 'text', 'cta', 'custom']),
    data: z.record(z.unknown()),
    children: z.array(contentBlockSchema).optional(),
  })
);

const createContentPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  status: z.string().default("draft"),
  content: z.array(contentBlockSchema).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  ogImage: z.string().optional(),
});

const updateContentPageSchema = createContentPageSchema.partial().extend({
  id: z.string(),
});

export const createContentPage = protectedAction(
  createContentPageSchema,
  async (input) => {
    const [page] = await db
      .insert(contentPages)
      .values({
        title: input.title,
        slug: input.slug,
        description: input.description,
        status: input.status ?? "draft",
        content: input.content ?? [],
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        seoKeywords: input.seoKeywords,
        ogImage: input.ogImage,
      })
      .returning();

    revalidatePath("/admin/store");
    return { success: true, page };
  }
);

export const updateContentPage = protectedAction(
  updateContentPageSchema,
  async (input) => {
    const { id, ...data } = input;
    const [page] = await db
      .update(contentPages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contentPages.id, id))
      .returning();

    revalidatePath("/admin/store");
    revalidatePath(`/${page.slug}`);
    return { success: true, page };
  }
);

export const deleteContentPage = protectedAction(
  z.object({ id: z.string() }),
  async ({ id }) => {
    await db.delete(contentPages).where(eq(contentPages.id, id));
    revalidatePath("/admin/store");
    return { success: true };
  }
);

export const updateContentBlocks = protectedAction(
  z.object({
    id: z.string(),
    content: z.array(contentBlockSchema),
  }),
  async ({ id, content }) => {
    const [page] = await db
      .update(contentPages)
      .set({ content, updatedAt: new Date() })
      .where(eq(contentPages.id, id))
      .returning();

    revalidatePath("/admin/store");
    revalidatePath(`/${page.slug}`);
    return { success: true, page };
  }
);
