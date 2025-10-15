"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import React from "react";

type NavStatus = "open" | "closed";

const NavigationMenuContext = React.createContext<{
  status: NavStatus;
  setStatus: React.Dispatch<React.SetStateAction<NavStatus>>;
}>({
  status: "closed",
  setStatus: () => {},
});
export function NavigationMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = React.useState<NavStatus>("closed");

  return (
    <NavigationMenuContext.Provider value={{ status, setStatus }}>
      {children}
    </NavigationMenuContext.Provider>
  );
}

export function useNavigationMenu() {
  const ctx = React.useContext(NavigationMenuContext);
  return ctx.status;
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  const { setStatus } = React.useContext(NavigationMenuContext);

  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      onValueChange={(value) => {
        setStatus(value ? "open" : "closed");
      }}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "group text-foreground hover:text-foreground/80 cursor-pointer px-3 py-2 leading-relaxed transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full md:absolute md:w-full",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
        "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        "group-data-[viewport=false]/navigation-menu:bg-background/95 group-data-[viewport=false]/navigation-menu:text-foreground",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden",
        "group-data-[viewport=false]/navigation-menu:shadow-lg group-data-[viewport=false]/navigation-menu:duration-300",
        "**:data-[slot=navigation-menu-link]:focus:ring-0",
        "**:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  children,
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "fixed top-full left-0 isolate z-50 -mt-3 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground relative mt-3 h-[var(--radix-navigation-menu-viewport-height)] w-screen overflow-hidden border-y",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2",
          className
        )}
        {...props}
      >
        {children}
      </NavigationMenuPrimitive.Viewport>
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:text-foreground text-foreground/80 cursor-pointer py-1 no-underline transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
};
