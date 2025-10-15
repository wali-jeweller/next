"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format-price";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";
import { type TProduct } from "@repo/db/schema";

async function searchProducts(
  query: string
): Promise<{ products: TProduct[] }> {
  if (!query.trim()) return { products: [] };

  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&limit=12`
  );
  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

// Recent Searches Component
function RecentSearches({
  onSearchSelect,
}: {
  onSearchSelect: (term: string) => void;
}) {
  const recentTerms = [
    "Gold Necklace",
    "Silver Ring",
    "Diamond Earrings",
    "Wedding Bands",
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-foreground text-sm font-medium">Recent Searches</h3>
      <div className="space-y-2">
        {recentTerms.map((term) => (
          <button
            key={term}
            onClick={() => onSearchSelect(term)}
            className="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-left text-sm transition-colors"
          >
            <Search className="size-3" />
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

// Popular Products Component
function PopularProducts({
  onClose,
  popularProducts,
}: {
  onClose: () => void;
  popularProducts: TProduct[] | null;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-foreground text-sm font-medium">Popular Products</h3>
      <div className="grid grid-cols-4 gap-3">
        {popularProducts?.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="hover:bg-muted/50 group block rounded p-2 transition-colors"
          >
            <div className="bg-muted mb-2 aspect-square overflow-hidden rounded-none">
              <Image
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.title}
                width={80}
                height={80}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="line-clamp-1 text-xs font-medium">
              {product.title}
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              {formatPrice(
                product.discountedPrice &&
                  product.discountedPrice > 0 &&
                  product.discountedPrice < product.price
                  ? product.discountedPrice
                  : product.price
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Quick Links Component
function QuickLinks({ onClose }: { onClose: () => void }) {
  const quickLinks = [
    { href: "/categories", label: "Browse Categories" },
    { href: "/collections", label: "New Collections" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-foreground text-sm font-medium">Quick Links</h3>
      <div className="space-y-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <div className="bg-primary h-2 w-2 rounded-full" />
            {link.label}
          </Link>
        ))}
        <div className="border-t pt-4">
          <div className="text-muted-foreground mb-2 text-xs">Need Help?</div>
          <a
            href="tel:+1-800-JEWELRY"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Call Us: +1-800-JEWELRY
          </a>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function SearchEmptyState({
  onSearchSelect,
  onClose,
  popularProducts,
}: {
  onSearchSelect: (term: string) => void;
  onClose: () => void;
  popularProducts: TProduct[] | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-2">
        <RecentSearches onSearchSelect={onSearchSelect} />
      </div>
      <div className="lg:col-span-7">
        <PopularProducts onClose={onClose} popularProducts={popularProducts} />
      </div>
      <div className="lg:col-span-3">
        <QuickLinks onClose={onClose} />
      </div>
    </div>
  );
}

// Loading State Component
function SearchLoading() {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <div className="border-primary mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-t-transparent" />
      <p>Searching...</p>
    </div>
  );
}

// No Results Component
function SearchNoResults({ query }: { query: string }) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <p>No products found for &quot;{query}&quot;</p>
    </div>
  );
}

// Search Results Component
function SearchResults({
  products,
  onProductClick,
}: {
  products: TProduct[];
  onProductClick: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          onClick={onProductClick}
          className="hover:bg-muted/50 group block p-3 transition-colors"
        >
          <div className="bg-muted mb-3 aspect-square overflow-hidden">
            <Image
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.title}
              width={200}
              height={200}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <h3 className="mb-2 line-clamp-2 text-sm font-medium">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            {product.discountedPrice &&
            product.discountedPrice > 0 &&
            product.discountedPrice < product.price ? (
              <>
                <span className="text-primary font-mono text-sm">
                  {formatPrice(product.discountedPrice)}
                </span>
                <span className="text-muted-foreground text-xs line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="outline" className="rounded-none text-xs">
                  Sale
                </Badge>
              </>
            ) : (
              <span className="text-primary font-mono text-sm">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function SearchDropdown({
  popularProducts,
}: {
  popularProducts: TProduct[] | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedSearchQuery],
    queryFn: () => searchProducts(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  const handleProductClick = () => {
    handleClose();
  };

  const handleSearchSelect = (term: string) => {
    setSearchQuery(term);
  };

  const renderSearchContent = () => {
    // Show empty state if no search query or debounced query is too short
    if (debouncedSearchQuery.length < 2) {
      return (
        <SearchEmptyState
          onSearchSelect={handleSearchSelect}
          onClose={handleClose}
          popularProducts={popularProducts}
        />
      );
    }

    // Show loading if query is being debounced or API is loading
    if (
      isLoading ||
      (searchQuery.length >= 2 && searchQuery !== debouncedSearchQuery)
    ) {
      return <SearchLoading />;
    }

    if (data?.products.length === 0) {
      return <SearchNoResults query={debouncedSearchQuery} />;
    }

    return (
      <SearchResults
        products={data?.products || []}
        onProductClick={handleProductClick}
      />
    );
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus(); // optional: focus after clearing
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="size-[18px] stroke-[1.6]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="mt-2 w-screen max-w-none rounded-none border-0 p-0 shadow-none"
        align="center"
        sideOffset={0}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="text-muted-foreground absolute left-0 top-1/2 size-4 -translate-y-1/2 transform" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outline"
              className="px-6"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={searchQuery.length === 0}
              className="absolute right-0 top-1/2 -translate-y-1/2 transform"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Search Content */}
          <div className="min-h-[300px]">{renderSearchContent()}</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
