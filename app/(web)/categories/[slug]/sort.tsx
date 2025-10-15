"use client";

import { ArrowDownNarrowWide, RotateCcw } from "lucide-react";
import { useQueryState } from "nuqs";
import { Select as SelectPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function Sort() {
  const [sort, setSort] = useQueryState("sort");

  const hasActiveSort = sort && sort !== "";

  const resetSort = () => {
    setSort(null);
  };

  return (
    <Select value={sort || undefined} onValueChange={setSort}>
      <SelectPrimitive.Trigger>
        <Button variant="outline" size="icon" className="relative" asChild>
          <div>
            <ArrowDownNarrowWide className="size-4" />
            {hasActiveSort && (
              <div className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full" />
            )}
          </div>
        </Button>
      </SelectPrimitive.Trigger>
      <SelectContent align="end" className="rounded-none shadow-none">
        <SelectItem value="price-asc" className="rounded-none">
          Price: Low to High
        </SelectItem>
        <SelectItem value="price-desc" className="rounded-none">
          Price: High to Low
        </SelectItem>
        <SelectItem value="newest" className="rounded-none">
          Newest
        </SelectItem>
        <SelectItem value="oldest" className="rounded-none">
          Oldest
        </SelectItem>
        {hasActiveSort && (
          <>
            <Separator className="my-1" />
            <div
              className="hover:bg-accent flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm"
              onClick={resetSort}
            >
              <RotateCcw className="h-4 w-4" />
              Reset Sort
            </div>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
