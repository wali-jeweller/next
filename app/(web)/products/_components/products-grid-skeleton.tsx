import { BorderedGrid } from "@/components/web/bordered-grid";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsGridSkeleton() {
  return (
    <>
      <BorderedGrid>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 justify-center items-center"
          >
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </BorderedGrid>
      <div className="border-t py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2">
          <Skeleton className="h-8 w-16" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </>
  );
}
