import { cva } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

export const typography = cva("font-geist", {
  variants: {
    variant: {
      h1: "text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.02em] leading-[1.1] text-balance text-foreground",
      h2: "text-2xl sm:text-3xl md:text-4xl font-normal tracking-[-0.015em] leading-[1.15] text-balance text-foreground",
      h3: "text-xl sm:text-2xl md:text-3xl font-normal tracking-[-0.01em] leading-[1.25] text-balance text-foreground",
      h4: "text-lg sm:text-xl md:text-2xl font-normal tracking-[0.01em] leading-[1.35] text-balance text-foreground",
      text: "text-sm sm:text-base md:text-lg leading-relaxed text-foreground/80 tracking-[0.01em] text-pretty",
      caption:
        "text-[10px] sm:text-xs md:text-sm text-foreground/90 tracking-[0.12em] uppercase font-medium text-balance leading-relaxed",
      price:
        "font-mono font-normal tracking-tight tabular-nums text-foreground",
      subtitle:
        "text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 font-light tracking-[0.02em] leading-[1.5] text-pretty",
      label:
        "text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-foreground/90 leading-relaxed",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export function H1({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1 className={cn(typography({ variant: "h1" }), className)} {...props}>
      {children}
    </h1>
  );
}

export function H2({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 className={cn(typography({ variant: "h2" }), className)} {...props}>
      {children}
    </h2>
  );
}

export function H3({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3 className={cn(typography({ variant: "h3" }), className)} {...props}>
      {children}
    </h3>
  );
}

export function H4({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h4">) {
  return (
    <h4 className={cn(typography({ variant: "h4" }), className)} {...props}>
      {children}
    </h4>
  );
}

export function Text({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn(typography({ variant: "text" }), className)} {...props}>
      {children}
    </p>
  );
}

export function Caption({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn(typography({ variant: "caption" }), className)} {...props}>
      {children}
    </p>
  );
}

export function Price({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(typography({ variant: "price" }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function Subtitle({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(typography({ variant: "subtitle" }), className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Label({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(typography({ variant: "label" }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
