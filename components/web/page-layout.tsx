import type React from "react";
import { H1, H2, H3, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// Main Page Container
interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export function Page({ children, className }: PageProps) {
  return <div className={cn("mt-15 lg:mt-18", className)}>{children}</div>;
}

// Page Header Component
interface HeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export function Header({
  title,
  subtitle,
  description,
  className,
}: HeaderProps) {
  return (
    <section className={cn("py-12", className)}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <H1 className="mb-4">{title}</H1>
        {subtitle && <Text className="text-lg mb-2">{subtitle}</Text>}
        {description && (
          <Text className="max-w-2xl mx-auto text-foreground/70 text-sm">
            {description}
          </Text>
        )}
      </div>
    </section>
  );
}

// Content Container
interface ContentProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl" | "none";
}

export function Content({
  children,
  className,
  maxWidth = "4xl",
}: ContentProps) {
  const maxWidthClasses = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    none: "",
  };

  return (
    <div
      className={cn(
        `${maxWidthClasses[maxWidth]} mx-auto px-4 py-12`,
        className
      )}
    >
      {children}
    </div>
  );
}

// Section Component
interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  border?: "top" | "bottom" | "both" | "none";
  spacing?: "normal" | "tight" | "loose";
}

export function Section({
  children,
  title,
  subtitle,
  className,
  border = "top",
  spacing = "normal",
}: SectionProps) {
  const borderClasses = {
    top: "border-t",
    bottom: "border-b",
    both: "border-y",
    none: "",
  };

  const spacingClasses = {
    tight: "py-8",
    normal: "py-12",
    loose: "py-16",
  };

  return (
    <section
      className={cn(borderClasses[border], spacingClasses[spacing], className)}
    >
      {(title || subtitle) && (
        <div className="text-center mb-4 lg:mb-8">
          {title && <H2>{title}</H2>}
          {subtitle && (
            <Text className="text-muted-foreground">{subtitle}</Text>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// Grid Component
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  gap?: "small" | "medium" | "large" | "none";
}

export function Grid({
  children,
  cols = 2,
  className,
  gap = "medium",
}: GridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
  };

  const gapClasses = {
    small: "gap-6",
    medium: "gap-8",
    large: "gap-16",
    none: "",
  };

  return (
    <div
      className={cn("grid mx-auto", gridCols[cols], gapClasses[gap], className)}
    >
      {children}
    </div>
  );
}

// Table Components
interface TableProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "4xl" | "5xl" | "6xl";
}

export function Table({ children, className, maxWidth = "4xl" }: TableProps) {
  const maxWidthClasses = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
  };

  return (
    <div className={cn(`${maxWidthClasses[maxWidth]} mx-auto`, className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">{children}</table>
      </div>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b">{children}</tr>
    </thead>
  );
}

export function TableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("text-left py-3 font-medium text-foreground", className)}>
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="text-foreground/80">{children}</tbody>;
}

export function TableRow({
  children,
  isLast = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return <tr className={cn(!isLast && "border-b")}>{children}</tr>;
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("py-3 font-light", className)}>{children}</td>;
}

// CTA Section Component
interface CTAProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CTA({
  title,
  subtitle,
  description,
  children,
  className,
}: CTAProps) {
  return (
    <section className={cn("border-t py-16", className)}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <H3 className="text-2xl mb-6">{title}</H3>
        {subtitle && (
          <Text className="text-muted-foreground mb-2">{subtitle}</Text>
        )}
        {description && (
          <Text className="max-w-xl mx-auto mb-8">{description}</Text>
        )}
        {children && <div className="space-y-4">{children}</div>}
      </div>
    </section>
  );
}
