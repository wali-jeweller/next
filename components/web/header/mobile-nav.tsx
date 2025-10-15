"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { H2, H4 } from "@/components/ui/typography";

import {
  ABOUT_LINK_GROUPS,
  MATERIAL_LINKS,
  QUICK_LINKS,
  SEASONAL_COLLECTIONS,
  SPECIAL_COLLECTIONS,
  SimpleNavItem,
  type NavLinkConfig,
  withSlug,
} from "./nav-data";

const navLinkClass =
  "block py-2 font-light tracking-wide text-foreground transition-colors hover:text-foreground";

type LinkListProps = {
  links: NavLinkConfig[];
  onNavigate: () => void;
};

function LinkList({ links, onNavigate }: LinkListProps) {
  return (
    <div className="space-y-2 pl-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={navLinkClass}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <H4 className="font-light tracking-wide">{title}</H4>
      {children}
    </div>
  );
}

export function MobileNav({
  categories,
  collections,
}: {
  categories: SimpleNavItem[];
  collections: SimpleNavItem[];
}) {
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const { style: bodyStyle } = document.body;
    const { style: rootStyle } = document.documentElement;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyPosition = bodyStyle.position;
    const previousBodyTop = bodyStyle.top;
    const previousBodyWidth = bodyStyle.width;
    const previousRootOverflow = rootStyle.overflow;
    const scrollY = window.scrollY;

    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";
    rootStyle.overflow = "hidden";

    return () => {
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.position = previousBodyPosition;
      bodyStyle.top = previousBodyTop;
      bodyStyle.width = previousBodyWidth;
      rootStyle.overflow = previousRootOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const navigableCategories = withSlug(categories);
  const navigableCollections = withSlug(collections);

  const categoryLinks = navigableCategories.slice(0, 6).map((category) => ({
    href: `/categories/${category.slug}`,
    label: category.title,
  }));

  const collectionLinks = navigableCollections
    .slice(0, 6)
    .map((collection) => ({
      href: `/collections/${collection.slug}`,
      label: collection.title,
    }));

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={toggleMenu}
        className="relative z-50 h-10 w-10 text-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-40 h-screen w-screen overflow-y-auto bg-background/95 backdrop-blur-lg"
          >
            <div className="absolute top-4 right-0 flex w-full items-center justify-center px-6">
              <H2 className="font-light tracking-wide text-xl lg:text-3xl">
                <Link href="/" onClick={closeMenu}>
                  AL-WALI JEWELLERS
                </Link>
              </H2>
            </div>

            <nav className="flex h-full flex-col px-6 pb-8 pt-24">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center justify-between py-4 text-lg font-light tracking-wide">
                    <span>Products</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <Section title="Shop by Material">
                    <LinkList links={MATERIAL_LINKS} onNavigate={closeMenu} />
                  </Section>

                  <Section title="Shop by Category">
                    <LinkList links={categoryLinks} onNavigate={closeMenu} />
                    <Link
                      href="/categories"
                      className="block py-2 font-light tracking-wide text-foreground transition-colors hover:text-foreground/80"
                      onClick={closeMenu}
                    >
                      View All Categories
                    </Link>
                  </Section>

                  <Section title="Quick Links">
                    <LinkList links={QUICK_LINKS} onNavigate={closeMenu} />
                  </Section>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center justify-between py-4 text-lg font-light tracking-wide">
                    <span>Collections</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <Section title="Featured Collections">
                    <LinkList links={collectionLinks} onNavigate={closeMenu} />
                    <Link
                      href="/collections"
                      className="block py-2 font-light tracking-wide text-foreground transition-colors hover:text-foreground/80"
                      onClick={closeMenu}
                    >
                      View All Collections
                    </Link>
                  </Section>

                  <Section title="Special Collections">
                    <LinkList
                      links={SPECIAL_COLLECTIONS}
                      onNavigate={closeMenu}
                    />
                  </Section>

                  <Section title="Seasonal Collections">
                    <LinkList
                      links={SEASONAL_COLLECTIONS}
                      onNavigate={closeMenu}
                    />
                  </Section>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center justify-between py-4 text-lg font-light tracking-wide">
                    <span>About</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  {ABOUT_LINK_GROUPS.map((group) => (
                    <Section key={group.title} title={group.title}>
                      <LinkList links={group.links} onNavigate={closeMenu} />
                    </Section>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
