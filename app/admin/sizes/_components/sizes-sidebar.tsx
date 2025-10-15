"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TCategory } from "@repo/db/schema";
import { CreateSizeButton } from "@/components/size-form";
import { Ruler } from "lucide-react";

interface SizesSidebarProps {
  categories: TCategory[];
}

export function SizesSidebar({ categories }: SizesSidebarProps) {
  const pathname = usePathname();

  const isActive = (categorySlug: string) => {
    return pathname === `/sizes/${categorySlug}`;
  };

  // Calculate total sizes
  const totalSizes = categories.reduce((acc, category) => {
    return acc + (category.sizes?.length || 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sizes</h2>
          <CreateSizeButton />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {categories.length} categories
          </Badge>
          <Badge variant="outline" className="text-xs">
            {totalSizes} sizes
          </Badge>
        </div>
      </div>

      {/* Categories List */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-3 space-y-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/sizes/${category.slug}`}
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
                <div className="flex items-center gap-1 mt-1">
                  <Ruler className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {category.sizes?.length || 0} sizes
                  </p>
                </div>
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
              <Ruler className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm">No sizes yet</p>
              <p className="text-xs mt-1">Create sizes in categories first</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
