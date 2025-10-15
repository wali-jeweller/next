"use client";

import * as React from "react";
import { useState } from "react";
import { Activity, ChevronDown, ChevronUp, FileText } from "lucide-react";
import Link from "next/link";

const pages = [
  { name: "Dashboard", href: "/admin/store", icon: Activity, children: null },
  {
    name: "Content",
    href: "#",
    icon: FileText,
    children: [
      { name: "Pages", href: "/admin/store/pages" },
      { name: "Homepage", href: "/admin/store/pages?type=homepage" },
    ],
  },
  {
    name: "Products",
    href: "#",
    icon: Activity,
    children: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add New", href: "/admin/products/new" },
      { name: "Categories", href: "/admin/categories" },
    ],
  },
  {
    name: "Orders",
    href: "#",
    icon: Activity,
    children: [
      { name: "All Orders", href: "#" },
      { name: "Pending", href: "#" },
      { name: "Shipped", href: "#" },
    ],
  },
  { name: "Customers", href: "#", icon: Activity, children: null },
  { name: "Analytics", href: "#", icon: Activity, children: null },
];

export function StoreSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (name: string) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex flex-col w-64 bg-gray-50 h-full border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-2xl font-bold">Store</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {pages.map((page) => (
          <div key={page.name}>
            <div
              className="flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => page.children && toggleSection(page.name)}
            >
              <div className="flex items-center">
                <page.icon className="w-6 h-6 mr-3" />
                <span>{page.name}</span>
              </div>
              {page.children && (
                <div>
                  {openSections[page.name] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              )}
            </div>
            {page.children && openSections[page.name] && (
              <div className="pl-8 space-y-1">
                {page.children.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className="block px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
