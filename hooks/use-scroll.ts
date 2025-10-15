import { useEffect, useRef, useState } from "react";

/**
 * Hook to manage header visibility based on scroll direction.
 * Hides header on scroll down, shows on scroll up or near top.
 * @param menuOpen - whether the menu is open (disables hide when true)
 */
export function useScroll(menuOpen: boolean): boolean {
  const [visible, setVisible] = useState(true);
  const prevScrollPos = useRef<number>(
    typeof window !== "undefined" ? window.scrollY : 0,
  );

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) return;
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos.current > currentScrollPos;
      setVisible(isScrollingUp || currentScrollPos < 10);
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  return visible;
}
