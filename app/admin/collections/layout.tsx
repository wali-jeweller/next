import { db } from "@/db";
import { CollectionsSidebar } from "./_components/collections-sidebar";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";

const getAllCollections = async () => {
  return await db.query.collections.findMany({
    orderBy: (c, { desc }) => desc(c.createdAt),
  });
};

export const metadata: Metadata = {
  title: "Collections Management",
  description: "Manage your jewelry collections and products",
};

export default async function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, redirectToSignIn } = await auth();

  if (!user) redirectToSignIn();

  const collections = await getAllCollections();

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r bg-background flex-shrink-0 h-full">
        <CollectionsSidebar collections={collections} />
      </div>

      <div className="flex-1 h-full overflow-hidden">{children}</div>
    </div>
  );
}
