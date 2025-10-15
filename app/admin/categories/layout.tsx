import { db } from "@/db";
import { CategoriesSidebar } from "./_components/categories-sidebar";
import type { Metadata } from "next";

const getAllCategories = async () => {
  return await db.query.categories.findMany({
    orderBy: (c, { desc }) => desc(c.createdAt),
  });
};

export const metadata: Metadata = {
  title: "Categories Management",
  description: "Manage your jewelry categories",
};

export default async function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getAllCategories();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Persistent across all category pages */}
      <div className="w-80 border-r bg-background flex-shrink-0 h-full">
        <CategoriesSidebar categories={categories} />
      </div>

      {/* Main Content Area - Changes based on current page */}
      <div className="flex-1 h-full overflow-hidden">{children}</div>
    </div>
  );
}
