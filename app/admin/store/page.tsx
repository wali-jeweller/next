import { getContentPages } from "@/lib/content-queries";
import { ContentPagesTable } from "./_components/content-pages-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function StorePage() {
  const pages = await getContentPages();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Static Pages</h1>
          <p className="text-muted-foreground">
            Create and manage your website pages with visual editor
          </p>
        </div>
        <Link href="/admin/store/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </Link>
      </div>

      <ContentPagesTable pages={pages} />
    </div>
  );
}
