import { Header } from "@/components/web/header";
import { HeaderContent } from "@/components/web/header/content";
import { Footer } from "@/components/web/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { NavigationMenuProvider } from "@/components/ui/navigation-menu";
import { CartProvider } from "@/components/web/cart-provider";
import { WishlistProvider } from "@/components/web/wishlist-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <SpeedInsights />
        <NavigationMenuProvider>
          <Header>
            <HeaderContent />
          </Header>
        </NavigationMenuProvider>
        <main>{children}</main>
        <Footer />
        <Analytics />
      </WishlistProvider>
    </CartProvider>
  );
}
