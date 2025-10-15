"use server";

import { db } from "@/db";
import { pages, pageSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { protectedAction } from "./protected-action";
import { z } from "zod";

const createPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  status: z.string().default("draft"),
  type: z.string().default("page"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  ogImage: z.string().optional(),
});

const updatePageSchema = createPageSchema.partial().extend({
  id: z.string(),
});

const createSectionSchema = z.object({
  pageId: z.string(),
  title: z.string().optional(),
  type: z.string(),
  content: z.any().optional(),
  order: z.number().default(0),
  isVisible: z.boolean().default(true),
});

const updateSectionSchema = createSectionSchema.partial().extend({
  id: z.string(),
});

export const createPage = protectedAction(createPageSchema, async (input) => {
  const [page] = await db
    .insert(pages)
    .values({
      title: input.title,
      slug: input.slug,
      description: input.description,
      status: input.status ?? "draft",
      type: input.type ?? "page",
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      seoKeywords: input.seoKeywords,
      ogImage: input.ogImage,
    })
    .returning();

  revalidatePath("/admin/store/pages");
  return { success: true, page };
});

export const updatePage = protectedAction(updatePageSchema, async (input) => {
  const { id, ...data } = input;
  const [page] = await db
    .update(pages)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pages.id, id))
    .returning();

  revalidatePath("/admin/store/pages");
  revalidatePath(`/${page.slug}`);
  return { success: true, page };
});

export const deletePage = protectedAction(
  z.object({ id: z.string() }),
  async ({ id }) => {
    await db.delete(pages).where(eq(pages.id, id));
    revalidatePath("/admin/store/pages");
    return { success: true };
  }
);

export const createSection = protectedAction(
  createSectionSchema,
  async (input) => {
    const [section] = await db
      .insert(pageSections)
      .values({
        pageId: input.pageId,
        title: input.title,
        type: input.type,
        content: input.content,
        order: input.order ?? 0,
        isVisible: input.isVisible ?? true,
      })
      .returning();

    revalidatePath("/admin/store/pages");
    return { success: true, section };
  }
);

export const updateSection = protectedAction(
  updateSectionSchema,
  async (input) => {
    const { id, ...data } = input;
    const [section] = await db
      .update(pageSections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pageSections.id, id))
      .returning();

    revalidatePath("/admin/store/pages");
    return { success: true, section };
  }
);

export const deleteSection = protectedAction(
  z.object({ id: z.string() }),
  async ({ id }) => {
    await db.delete(pageSections).where(eq(pageSections.id, id));
    revalidatePath("/admin/store/pages");
    return { success: true };
  }
);

export const reorderSections = protectedAction(
  z.object({
    sections: z.array(
      z.object({
        id: z.string(),
        order: z.number(),
      })
    ),
  }),
  async ({ sections }) => {
    await Promise.all(
      sections.map(({ id, order }) =>
        db.update(pageSections).set({ order }).where(eq(pageSections.id, id))
      )
    );

    revalidatePath("/admin/store/pages");
    return { success: true };
  }
);
