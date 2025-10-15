/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Minimal size type based on actual schema
type Size = {
  value: string;
  unit?: string;
};

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string | null; // Just the size value string
  onSizeSelect: (size: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  disabled = false,
  compact = false,
}: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Size</span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {sizes.map((size, index) => {
            const sizeValue = size.unit
              ? `${size.value} ${size.unit}`
              : size.value;
            const isSelected = selectedSize === size.value;

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "relative h-8 justify-center text-xs",
                  isSelected && "ring-1 ring-primary"
                )}
                onClick={() => onSizeSelect(size.value)}
                disabled={disabled}
              >
                {isSelected && (
                  <Check className="absolute right-1 bottom-1 h-3 w-3" />
                )}
                <span className="font-medium">{sizeValue}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Size</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {sizes.map((size, index) => {
          const sizeValue = size.unit
            ? `${size.value} ${size.unit}`
            : size.value;
          const isSelected = selectedSize === size.value;

          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={cn(
                "relative h-12 justify-start",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onSizeSelect(size.value)}
              disabled={disabled}
            >
              {isSelected && (
                <Check className="absolute right-2 bottom-2 h-4 w-4" />
              )}
              <div className="text-left">
                <div className="font-medium">{sizeValue}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
