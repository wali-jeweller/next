import Link from "next/link";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { HeaderCartSheet } from "./header-cart-sheet";
import { HeaderWishlistSheet } from "./header-wishlist-sheet";
import { getCategories, getCollections } from "@/lib/queries";
import { Suspense } from "react";
import { HeaderUserSheet } from "./header-user-sheet";

export async function HeaderContent() {
  const categories = await getCategories();
  const collections = await getCollections();
  return (
    <div className="grid w-full grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div className="flex items-center gap-1">
        <MobileNav categories={categories} collections={collections} />
        <Link
          href="/"
          className="tracking-wide text-lg text-foreground hover:text-foreground/80 whitespace-nowrap"
        >
          AL-WALI JEWELLERS
        </Link>
      </div>
      <div className="hidden lg:block">
        <DesktopNav categories={categories} collections={collections} />
      </div>
      <Suspense>
        <div className="flex items-center justify-end gap-2">
          <HeaderUserSheet />
          <HeaderWishlistSheet />
          <HeaderCartSheet />
        </div>
      </Suspense>
    </div>
  );
}
