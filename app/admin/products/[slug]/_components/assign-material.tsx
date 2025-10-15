"use client";

import { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TProduct } from "@/db/schema";
import { updateProductMaterialAction } from "../actions";

const materials = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  { value: "other", label: "Other" },
];

export function AssignMaterial({ product }: { product: TProduct }) {
  const [isPending, startTransition] = useTransition();
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    product.material || ""
  );

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
    startTransition(async () => {
      const result = await updateProductMaterialAction({
        productId: product.id,
        material: material as "gold" | "silver" | "platinum" | "other",
      });

      if (result?.error) {
        console.error("Failed to update material:", result.error);
      }
    });
  };

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="material">Material</Label>
      <Select
        value={selectedMaterial}
        onValueChange={handleMaterialChange}
        disabled={isPending}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Select material" />
        </SelectTrigger>
        <SelectContent align="end">
          {materials.map((material) => (
            <SelectItem key={material.value} value={material.value}>
              {material.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
