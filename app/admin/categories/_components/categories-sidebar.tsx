"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TCategory } from "@/db/schema";
import { CreateCategoryButton } from "@/components/admin/category-form";

interface CategoriesSidebarProps {
  categories: TCategory[];
}

export function CategoriesSidebar({ categories }: CategoriesSidebarProps) {
  const pathname = usePathname();

  const isActive = (categorySlug: string) => {
    return pathname === `/categories/${categorySlug}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <CreateCategoryButton />
        </div>
        <Badge variant="secondary" className="text-xs">
          {categories.length} categories
        </Badge>
      </div>

      {/* Categories List */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-3 space-y-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors",
                isActive(category.slug) && "bg-muted border border-border"
              )}
            >
              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {category.thumbnail ? (
                  <Image
                    src={category.thumbnail}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      {category.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {category.title}
                </p>
                {category.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {category.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  /{category.slug}
                </p>
              </div>

              {isActive(category.slug) && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              )}
            </Link>
          ))}

          {categories.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No categories yet</p>
              <p className="text-xs mt-1">Create your first category</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
