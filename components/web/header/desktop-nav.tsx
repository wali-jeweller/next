import { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { H4 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import {
  ABOUT_LINK_GROUPS,
  MATERIAL_LINKS,
  QUICK_LINKS,
  SEASONAL_COLLECTIONS,
  SPECIAL_COLLECTIONS,
  SimpleNavItem,
  placeholderImage,
  withSlug,
} from "./nav-data";

const baseLinkClass =
  "font-normal tracking-wide transition-colors text-foreground/80 hover:text-foreground";

type MenuSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

function MenuSection({ title, children, className }: MenuSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <H4 className="mb-4 tracking-wide">{title}</H4>
        {children}
      </div>
    </div>
  );
}

type MenuLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

function MenuLink({ href, className, children }: MenuLinkProps) {
  return (
    <NavigationMenuLink asChild>
      <Link href={href} className={cn(baseLinkClass, "block", className)}>
        {children}
      </Link>
    </NavigationMenuLink>
  );
}

export function DesktopNav({
  categories,
  collections,
}: {
  categories: SimpleNavItem[];
  collections: SimpleNavItem[];
}) {
  const navigableCategories = withSlug(categories);
  const navigableCollections = withSlug(collections);

  const categoryList = navigableCategories.slice(0, 6);
  const featuredCategories = navigableCategories.slice(0, 4);
  const featuredCollections = navigableCollections.slice(0, 4);

  return (
    <NavigationMenu className="max-w-fit">
      <NavigationMenuList className="flex items-center justify-center gap-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base tracking-wide transition-colors hover:text-foreground/80">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mx-auto p-8">
            <div className="mx-auto grid w-fit grid-cols-5 gap-8">
              <MenuSection title="Shop by Material">
                <div className="space-y-3">
                  {MATERIAL_LINKS.map((link) => (
                    <MenuLink key={link.href} href={link.href}>
                      {link.label}
                    </MenuLink>
                  ))}
                </div>
              </MenuSection>

              <MenuSection title="Shop by Category">
                <div className="space-y-3">
                  {categoryList.map((category) => (
                    <MenuLink
                      key={category.id}
                      href={`/categories/${category.slug}`}
                    >
                      {category.title}
                    </MenuLink>
                  ))}
                  <MenuLink
                    href="/categories"
                    className="mt-2 flex items-center gap-2 !text-foreground hover:!text-foreground/80"
                  >
                    View All Categories
                    <ArrowRightIcon className="h-3 w-3" />
                  </MenuLink>
                </div>
              </MenuSection>

              <MenuSection title="Featured" className="col-span-2">
                <div className="grid grid-cols-2 gap-1">
                  {featuredCategories.map((category) => (
                    <NavigationMenuLink asChild key={category.id}>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="group flex flex-col gap-2"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={category.thumbnail || placeholderImage}
                            alt={category.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="text-sm font-light tracking-wide leading-none">
                          {category.title}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </MenuSection>

              <MenuSection title="Quick Links">
                <div className="space-y-3">
                  {QUICK_LINKS.map((link) => (
                    <MenuLink key={link.href} href={link.href}>
                      {link.label}
                    </MenuLink>
                  ))}
                </div>
              </MenuSection>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base tracking-wide transition-colors hover:text-foreground/80">
            Collections
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mx-auto p-8">
            <div className="mx-auto grid w-[800px] grid-cols-4 gap-8">
              <MenuSection title="Featured Collections">
                <div className="space-y-3">
                  {navigableCollections.slice(0, 6).map((collection) => (
                    <MenuLink
                      key={collection.id}
                      href={`/collections/${collection.slug}`}
                    >
                      {collection.title}
                    </MenuLink>
                  ))}
                </div>
              </MenuSection>

              <MenuSection title="Special Collections">
                <div className="space-y-3">
                  {SPECIAL_COLLECTIONS.map((link) => (
                    <MenuLink key={link.href} href={link.href}>
                      {link.label}
                    </MenuLink>
                  ))}
                </div>
              </MenuSection>

              <MenuSection title="Seasonal Collections">
                <div className="space-y-3">
                  {SEASONAL_COLLECTIONS.map((link) => (
                    <MenuLink key={link.href} href={link.href}>
                      {link.label}
                    </MenuLink>
                  ))}
                </div>
              </MenuSection>

              <MenuSection title="Featured">
                <div className="grid grid-cols-1 gap-4">
                  {featuredCollections.map((collection) => (
                    <NavigationMenuLink asChild key={collection.id}>
                      <Link
                        href={`/collections/${collection.slug}`}
                        className="group flex flex-col gap-3"
                      >
                        <div className="relative aspect-square overflow-hidden bg-muted/20">
                          <Image
                            src={collection.thumbnail || placeholderImage}
                            alt={collection.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="text-sm font-light tracking-wide leading-none">
                          {collection.title}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
                <MenuLink
                  href="/collections"
                  className="flex items-center gap-2 !text-foreground hover:!text-foreground/80"
                >
                  View All Collections
                  <ArrowRightIcon className="h-3 w-3" />
                </MenuLink>
              </MenuSection>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base tracking-wide transition-colors hover:text-foreground/80">
            About
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-8">
            <div className="mx-auto grid w-[800px] grid-cols-3 gap-8">
              {ABOUT_LINK_GROUPS.map((group) => (
                <MenuSection key={group.title} title={group.title}>
                  <div className="space-y-3">
                    {group.links.map((link) => (
                      <MenuLink key={link.href} href={link.href}>
                        {link.label}
                      </MenuLink>
                    ))}
                  </div>
                </MenuSection>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
