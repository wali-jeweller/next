import Link from "next/link";
import React from "react";
import { Icons } from "@/components/ui/icons";
import { Caption, Label } from "@/components/ui/typography";
import { Timestamp } from "./timestamp";
import { getCategories, getCollections } from "@/lib/queries";

// Static footer data
const customerCareLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "Shipping & Returns", href: "/shipping-and-returns" },
  { name: "Jewelry Care", href: "/care" },
  { name: "Size Guide", href: "/size-guide" },
];

const aboutLinks = [
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: Icons.instagram },
  { name: "TikTok", href: "https://tiktok.com", icon: Icons.tiktok },
  { name: "Pinterest", href: "https://pinterest.com", icon: Icons.pinterest },
  { name: "Facebook", href: "https://facebook.com", icon: Icons.facebook },
  { name: "Whatsapp", href: "https://whatsapp.com", icon: Icons.whatsapp },
];

const companyInfo = {
  name: "Al-Wali Jewellers",
  description:
    "Handcrafted jewelry that celebrates life's precious moments. Each piece tells a unique story.",
  address: {
    street: "Al Wali Jewellers, Ibn-e-Saeed Rd",
    area: "Canal Bank Housing Scheme",
    city: "Harbanspura, Lahore 54850",
  },
  hours: {
    weekdays: "Mon-Sat: 11:30am-10pm",
    sunday: "Sun: 2pm-10pm",
  },
};

export async function Footer() {
  const categories = await getCategories();
  const collections = await getCollections();

  return (
    <footer className="text-primary/90 bg-background/90 flex flex-col justify-between border-t p-4">
      <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 md:grid-cols-5">
        <div>
          <Label>CATEGORIES</Label>
          <ul className="space-y-1 mt-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}` || ""}
                  prefetch={false}
                  className="text-primary/80 hover:text-primary "
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Label>COLLECTIONS</Label>
          <ul className="space-y-1 mt-4">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}` || ""}
                  prefetch={false}
                  className="text-primary/80 hover:text-primary"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care section */}
        <div>
          <Label>CUSTOMER CARE</Label>
          <ul className="space-y-1 mt-4">
            {customerCareLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-primary/80 hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About Us section */}
        <div>
          <Label>ABOUT US</Label>
          <ul className="space-y-1 mt-4">
            {aboutLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-primary/80 hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Visit Us section */}
        <div>
          <Label>VISIT US</Label>
          <Caption className="mt-4 text-primary/80">
            {companyInfo.address.street},
            <br />
            {companyInfo.address.area},
            <br />
            {companyInfo.address.city}
          </Caption>
          <Caption className="mt-2 text-primary/80">
            {companyInfo.hours.weekdays}
            <br />
            {companyInfo.hours.sunday}
          </Caption>
          <div className="flex space-x-4 pt-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/80 hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section with copyright and policies */}
      <div className="border-t pt-4 text-center">
        <Caption>
          &copy; <Timestamp /> {companyInfo.name}. All rights reserved.
        </Caption>
      </div>
    </footer>
  );
}
