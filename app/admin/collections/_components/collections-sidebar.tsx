"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TCollection } from "@/db/schema";
import { CreateCollectionButton } from "@/components/admin/collection-form";

interface CollectionsSidebarProps {
  collections: TCollection[];
}

export function CollectionsSidebar({ collections }: CollectionsSidebarProps) {
  const pathname = usePathname();

  const isActive = (collectionSlug: string) => {
    return pathname === `/collections/${collectionSlug}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Collections</h2>
          <CreateCollectionButton />
        </div>
        <Badge variant="secondary" className="text-xs">
          {collections.length} collections
        </Badge>
      </div>

      {/* Collections List */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-3 space-y-1">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors",
                isActive(collection.slug) && "bg-muted border border-border"
              )}
            >
              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {collection.thumbnail ? (
                  <Image
                    src={collection.thumbnail}
                    alt={collection.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      {collection.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {collection.description && (
                  <p className="text-sm text-foreground truncate">
                    {collection.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  /{collection.slug}
                </p>
              </div>

              {isActive(collection.slug) && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              )}
            </Link>
          ))}

          {collections.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No collections yet</p>
              <p className="text-xs mt-1">Create your first collection</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
