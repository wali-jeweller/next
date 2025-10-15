import { getPages } from "@/lib/cms-queries";
import { PagesTable } from "./pages-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">
            Manage your website pages and content
          </p>
        </div>
        <Link href="/admin/store/pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </Link>
      </div>

      <PagesTable pages={pages} />
    </div>
  );
}
