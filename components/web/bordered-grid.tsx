import { cn } from "@/lib/utils";

type BorderedGridProps = {
  children: React.ReactNode;
  className?: string;
};

export function BorderedGrid({ children, className }: BorderedGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        "[&>*]:border-r [&>*]:border-b [&>*]:p-4 [&>*]:flex [&>*]:flex-col [&>*]:gap-2 [&>*]:overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
