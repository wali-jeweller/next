export interface SimpleNavItem {
  id: string;
  title: string;
  slug: string | null;
  thumbnail?: string | null;
}

export type NavLinkConfig = {
  href: string;
  label: string;
};

export type NavLinkGroup = {
  title: string;
  links: NavLinkConfig[];
};

export const MATERIAL_LINKS: NavLinkConfig[] = [
  { href: "/products?material=gold", label: "Gold Collection" },
  { href: "/products?material=silver", label: "Silver Collection" },
  { href: "/products?material=diamond", label: "Diamond Collection" },
  { href: "/products?material=platinum", label: "Platinum Collection" },
  { href: "/products?material=pearl", label: "Pearl Collection" },
  { href: "/products?material=emerald", label: "Emerald Collection" },
];

export const QUICK_LINKS: NavLinkConfig[] = [
  { href: "/products?material=sapphire", label: "Sapphire Collection" },
  { href: "/products?material=ruby", label: "Ruby Collection" },
  { href: "/products?material=opal", label: "Opal Collection" },
  { href: "/products?material=amethyst", label: "Amethyst Collection" },
  { href: "/products?material=topaz", label: "Topaz Collection" },
  { href: "/products?material=garnet", label: "Garnet Collection" },
];

export const SPECIAL_COLLECTIONS: NavLinkConfig[] = [
  { href: "/collections/engagement", label: "Engagement Rings" },
  { href: "/collections/wedding", label: "Wedding Bands" },
  { href: "/collections/anniversary", label: "Anniversary Jewelry" },
  { href: "/collections/birthday", label: "Birthday Jewelry" },
  { href: "/collections/graduation", label: "Graduation Jewelry" },
  { href: "/collections/holiday", label: "Holiday Collection" },
];

export const SEASONAL_COLLECTIONS: NavLinkConfig[] = [
  { href: "/collections/spring", label: "Spring Collection" },
  { href: "/collections/summer", label: "Summer Collection" },
  { href: "/collections/autumn", label: "Autumn Collection" },
  { href: "/collections/winter", label: "Winter Collection" },
];

export const ABOUT_LINK_GROUPS: NavLinkGroup[] = [
  {
    title: "Our Story",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/shipping-and-returns", label: "Shipping & Returns" },
      { href: "/care", label: "Jewelry Care" },
      { href: "/size-guide", label: "Size Guide" },
    ],
  },
];

export const placeholderImage = "/placeholder.png";

export function withSlug<T extends SimpleNavItem>(
  items: T[]
): (T & { slug: string })[] {
  return items.filter((item): item is T & { slug: string } =>
    Boolean(item.slug)
  );
}
