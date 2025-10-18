import "server-only";
import { db } from "@/db";
import { contentPages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getContentPages() {
  return await db.query.contentPages.findMany({
    orderBy: desc(contentPages.updatedAt),
  });
}

export async function getPublishedContentPages() {
  return await db.query.contentPages.findMany({
    where: eq(contentPages.status, "published"),
    orderBy: desc(contentPages.updatedAt),
  });
}

export async function getContentPageBySlug(slug: string) {
  return await db.query.contentPages.findFirst({
    where: eq(contentPages.slug, slug),
  });
}

export async function getContentPageById(id: string) {
  return await db.query.contentPages.findFirst({
    where: eq(contentPages.id, id),
  });
}
