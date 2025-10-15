import Link from "next/link";
import { cn } from "@/lib/utils";

export function LinkButton({
  children,
  href,
  className,
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(
        "relative overflow-hidden text-primary/90 hover:text-background py-3 px-4 border transition-colors duration-300 ease-out group",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute bottom-0 left-0 right-0 h-0 bg-primary group-hover:h-full transition-all duration-400 ease-out"></div>
    </Link>
  );
}
