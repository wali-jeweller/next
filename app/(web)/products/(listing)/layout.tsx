import { H2, Text } from "@/components/ui/typography";
import { Sort } from "../_components/sort";
import FiltersServer from "../_components/filters-server";
import FiltersSkeleton from "../_components/filters-skeleton";
import { Suspense } from "react";

export default function ProductsListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-18">
      <div className="flex items-center justify-between border-y py-8 px-4">
        <div>
          <H2 className="mb-1">Browse Products</H2>
          <Text className="max-w-prose text-sm lg:text-base">
            Use filters and sorting to find your perfect piece
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={<FiltersSkeleton />}>
            <FiltersServer />
          </Suspense>
          <Sort />
        </div>
      </div>
      {children}
    </div>
  );
}
