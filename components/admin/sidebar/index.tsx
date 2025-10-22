"use client";

import {
  CreditCard,
  Globe,
  Home,
  Ruler,
  Settings2,
  ShoppingBasket,
  Store,
  Tag,
  Tags,
  TicketPercent,
  TrendingUp,
  Users2,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { NavMain } from "@/components/admin/sidebar/nav-main";
import { NavSecondary } from "@/components/admin/sidebar/nav-secondary";
import { NavUser } from "@/components/admin/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const seedRoute = "admin";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/".concat(seedRoute),
      icon: Home,
    },
    {
      title: "Orders",
      url: "/".concat(seedRoute, "/orders"),
      icon: ShoppingBasket,
    },
    {
      title: "Products",
      url: "/".concat(seedRoute, "/products"),
      icon: Tag,
      items: [
        {
          title: "Collections",
          url: "/".concat(seedRoute, "/collections"),
          icon: Tags,
        },
        {
          title: "Sizes",
          url: "/".concat(seedRoute, "/sizes"),
          icon: Ruler,
        },
        {
          title: "Markets",
          url: "/".concat(seedRoute, "/markets"),
          icon: Globe,
        },
      ],
      isActive: true,
    },
    {
      title: "Customers",
      url: "/".concat(seedRoute, "/customers"),
      icon: Users2,
    },
    {
      title: "Payments",
      url: "/".concat(seedRoute, "/payments"),
      icon: CreditCard,
    },
    {
      title: "Promotions",
      url: "/".concat(seedRoute, "/promotions"),
      icon: TicketPercent,
    },
  ],
  navSecondary: [
    {
      title: "Store",
      url: "/".concat(seedRoute, "/store"),
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="h-full" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate tracking-wider">
                    Al-Wali Jewellers
                  </span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
