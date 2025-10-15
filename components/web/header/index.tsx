"use client";

import { motion } from "motion/react";
import { useScroll as useScrollVisibility } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { useNavigationMenu } from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header({ children }: { children: React.ReactNode }) {
  const status = useNavigationMenu();
  const mobile = useIsMobile();
  const menuOpen = status === "open";
  const visible = useScrollVisibility(menuOpen);

  const animateY = mobile ? 0 : visible ? 0 : "-100%";

  return (
    <motion.header
      animate={{ y: animateY }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-colors duration-200 origin-top",
        menuOpen
          ? "bg-background/95 backdrop-blur-sm border-b"
          : "bg-white/95 backdrop-blur-3xl"
      )}
    >
      <div className="p-3 lg:px-4 lg:py-2">{children}</div>
    </motion.header>
  );
}
