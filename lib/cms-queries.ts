import "server-only";
import { db } from "@/db";
import { pages, pageSections } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getPages() {
  return await db.query.pages.findMany({
    orderBy: desc(pages.updatedAt),
    with: {
      sections: {
        orderBy: (sections, { asc }) => [asc(sections.order)],
      },
    },
  });
}

export async function getPublishedPages() {
  return await db.query.pages.findMany({
    where: eq(pages.status, "published"),
    orderBy: desc(pages.updatedAt),
  });
}

export async function getPageBySlug(slug: string) {
  return await db.query.pages.findFirst({
    where: eq(pages.slug, slug),
    with: {
      sections: {
        where: eq(pageSections.isVisible, true),
        orderBy: (sections, { asc }) => [asc(sections.order)],
      },
    },
  });
}

export async function getPageById(id: string) {
  return await db.query.pages.findFirst({
    where: eq(pages.id, id),
    with: {
      sections: {
        orderBy: (sections, { asc }) => [asc(sections.order)],
      },
    },
  });
}

export async function getHomepage() {
  return await db.query.pages.findFirst({
    where: and(eq(pages.type, "homepage"), eq(pages.status, "published")),
    with: {
      sections: {
        where: eq(pageSections.isVisible, true),
        orderBy: (sections, { asc }) => [asc(sections.order)],
      },
    },
  });
}
