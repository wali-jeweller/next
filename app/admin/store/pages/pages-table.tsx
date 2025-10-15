"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { deletePage } from "@/lib/cms-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TPage, TPageSection } from "@/db/schema";

type PagesTableProps = {
  pages: (TPage & { sections: TPageSection[] })[];
};

export function PagesTable({ pages }: PagesTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete the page "${slug}"?`)) {
      return;
    }

    try {
      await deletePage({ id });
      toast.success("Page deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete page");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sections</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No pages found. Create your first page to get started.
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell className="font-mono text-sm">{page.slug}</TableCell>
                <TableCell>
                  <Badge variant="outline">{page.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      page.status === "published"
                        ? "default"
                        : page.status === "draft"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {page.status}
                  </Badge>
                </TableCell>
                <TableCell>{page.sections?.length || 0}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(
                    page.updatedAt || page.createdAt
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/${page.slug}`} target="_blank">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/store/pages/${page.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(page.id, page.slug)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
