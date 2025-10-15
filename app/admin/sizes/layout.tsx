import { auth } from "@clerk/nextjs/server";
import { db } from "@repo/db";
import { SizesSidebar } from "./_components/sizes-sidebar";
import type { Metadata } from "next";

const getAllCategoriesWithSizes = async () => {
  const categories = await db.query.categories.findMany({
    orderBy: (c, { asc }) => asc(c.title),
  });

  // Filter categories that have sizes
  return categories.filter(
    (category) => category.sizes && category.sizes.length > 0
  );
};

export const metadata: Metadata = {
  title: "Sizes Management",
  description: "Manage product sizes across categories",
};

export default async function SizesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) redirectToSignIn();

  const categoriesWithSizes = await getAllCategoriesWithSizes();

  return (
    <div className="flex h-screen">
      {/* Sidebar - Persistent across all size pages */}
      <div className="w-80 border-r bg-background flex-shrink-0 h-full">
        <SizesSidebar categories={categoriesWithSizes} />
      </div>

      {/* Main Content Area - Changes based on current page */}
      <div className="flex-1 h-full overflow-hidden">{children}</div>
    </div>
  );
}
