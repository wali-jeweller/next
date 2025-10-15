"use client";

import { TProduct } from "@/db/schema";
import { BorderedGrid } from "./bordered-grid";
import Link from "next/link";
import { ProductItem } from "./product-item";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

export function PaginatedProducts({ products }: { products: TProduct[] }) {
  const ITEMS_PER_PAGE = 40;

  const [page = 1, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ scroll: true })
  );

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  const currentPage = Math.min(
    Math.max(0, Number(page ?? 1) - 1),
    Math.max(0, totalPages - 1)
  );

  const start = currentPage * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = products.slice(start, end);

  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  return (
    <div>
      <BorderedGrid>
        {pageItems.map((product) => (
          <Link
            href={`/products/${product.slug}`}
            key={product.id}
            className="group"
            prefetch={false}
          >
            <ProductItem product={product} carousel />
          </Link>
        ))}
      </BorderedGrid>

      <nav aria-label="Pagination">
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            onClick={() => setPage(Math.max(1, Number(page ?? 1) - 1))}
            variant={"outline"}
            disabled={!hasPrev}
          >
            Prev
          </Button>

          {(() => {
            const currentOneBased = currentPage + 1;

            // show all pages if there are few, otherwise show [1, current, last]
            const pagesToShow =
              totalPages <= 3
                ? Array.from({ length: totalPages }, (_, i) => i + 1)
                : Array.from(new Set([1, currentOneBased, totalPages])).sort(
                    (a, b) => a - b
                  );

            return pagesToShow.map((p, idx) => {
              const prev = pagesToShow[idx - 1];
              const showDots = prev && p - prev > 1;
              return (
                <span key={p} className="inline-flex items-center">
                  {showDots && (
                    <span className="px-2 text-muted-foreground">…</span>
                  )}
                  <Button
                    onClick={() => setPage(p)}
                    aria-current={p === Number(page) ? "page" : undefined}
                    variant={p === Number(page) ? "default" : "outline"}
                  >
                    {p}
                  </Button>
                </span>
              );
            });
          })()}

          <Button
            onClick={() => setPage(Math.min(totalPages, Number(page ?? 1) + 1))}
            disabled={!hasNext}
            variant={"outline"}
          >
            Next
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </div>
      </nav>
    </div>
  );
}
