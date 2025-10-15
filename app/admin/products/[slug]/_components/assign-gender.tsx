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
import { updateProductGenderAction } from "../actions";

type Gender = "male" | "female" | "unisex";

const genders: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

export function AssignGender({ product }: { product: TProduct }) {
  const [isPending, startTransition] = useTransition();
  const [selectedGender, setSelectedGender] = useState<Gender>(
    (product.gender as Gender) || "unisex"
  );

  const handleGenderChange = (gender: Gender) => {
    setSelectedGender(gender);
    startTransition(async () => {
      const result = await updateProductGenderAction({
        productId: product.id,
        gender,
      });

      if (result?.error) {
        console.error("Failed to update gender:", result.error);
      }
    });
  };

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="gender">Gender</Label>
      <Select
        value={selectedGender}
        onValueChange={handleGenderChange}
        disabled={isPending}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent align="end">
          {genders.map((gender) => (
            <SelectItem key={gender.value} value={gender.value}>
              {gender.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
