"use client";

import { ListFilter } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format-price";

interface FilterProps {
  materials?: string[];
  genders?: string[];
  categories?: Array<{
    id: string;
    title: string;
    slug: string | null;
  }>;
  priceRange?: { min: number; max: number };
}

export function Filter({
  materials = [],
  genders = [],
  categories = [],
  priceRange = { min: 0, max: 1000 },
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // URL state (applied filters) - read-only for initialization
  const [selectedMaterials] = useQueryState("materials", {
    defaultValue: "",
    serialize: (value) => value,
    parse: (value) => value || "",
  });
  const [selectedGenders] = useQueryState("genders", {
    defaultValue: "",
    serialize: (value) => value,
    parse: (value) => value || "",
  });
  const [selectedCategories] = useQueryState("categories", {
    defaultValue: "",
    serialize: (value) => value,
    parse: (value) => value || "",
  });
  const [priceMin] = useQueryState("priceMin", {
    defaultValue: priceRange.min,
    serialize: (value) => value.toString(),
    parse: (value) => parseInt(value) || priceRange.min,
  });
  const [priceMax] = useQueryState("priceMax", {
    defaultValue: priceRange.max,
    serialize: (value) => value.toString(),
    parse: (value) => parseInt(value) || priceRange.max,
  });

  // Local state (temporary filters before applying)
  const [tempMaterials, setTempMaterials] = useState<string[]>([]);
  const [tempGenders, setTempGenders] = useState<string[]>([]);
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);

  // Initialize temp state when sheet opens or URL state changes
  useEffect(() => {
    setTempMaterials(selectedMaterials ? selectedMaterials.split(",") : []);
    setTempGenders(selectedGenders ? selectedGenders.split(",") : []);
    setTempCategories(selectedCategories ? selectedCategories.split(",") : []);
    setTempPriceRange([priceMin, priceMax]);
  }, [
    selectedMaterials,
    selectedGenders,
    selectedCategories,
    priceMin,
    priceMax,
    isOpen,
  ]);

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setTempMaterials((prev) => [...prev, material]);
    } else {
      setTempMaterials((prev) => prev.filter((m) => m !== material));
    }
  };

  const handleGenderChange = (gender: string, checked: boolean) => {
    if (checked) {
      setTempGenders((prev) => [...prev, gender]);
    } else {
      setTempGenders((prev) => prev.filter((g) => g !== gender));
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setTempCategories((prev) => [...prev, categoryId]);
    } else {
      setTempCategories((prev) => prev.filter((c) => c !== categoryId));
    }
  };

  const handlePriceChange = (values: number[]) => {
    setTempPriceRange([values[0], values[1]]);
  };

  const applyFilters = () => {
    // Force page reset to 1 when filters change
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("page"); // Reset to page 1

    if (tempMaterials.length > 0) {
      searchParams.set("materials", tempMaterials.join(","));
    } else {
      searchParams.delete("materials");
    }

    if (tempGenders.length > 0) {
      searchParams.set("genders", tempGenders.join(","));
    } else {
      searchParams.delete("genders");
    }

    if (tempCategories.length > 0) {
      searchParams.set("categories", tempCategories.join(","));
    } else {
      searchParams.delete("categories");
    }

    if (tempPriceRange[0] !== priceRange.min) {
      searchParams.set("priceMin", tempPriceRange[0].toString());
    } else {
      searchParams.delete("priceMin");
    }

    if (tempPriceRange[1] !== priceRange.max) {
      searchParams.set("priceMax", tempPriceRange[1].toString());
    } else {
      searchParams.delete("priceMax");
    }

    // Use Next.js router for client-side navigation
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    router.push(newUrl);

    setIsOpen(false);
  };

  const clearAllFilters = () => {
    setTempMaterials([]);
    setTempGenders([]);
    setTempCategories([]);
    setTempPriceRange([priceRange.min, priceRange.max]);
  };

  const hasActiveFilters =
    selectedMaterials ||
    selectedGenders ||
    selectedCategories ||
    priceMin !== priceRange.min ||
    priceMax !== priceRange.max;

  const hasChanges =
    JSON.stringify(tempMaterials.sort()) !==
      JSON.stringify(
        (selectedMaterials ? selectedMaterials.split(",") : []).sort()
      ) ||
    JSON.stringify(tempGenders.sort()) !==
      JSON.stringify(
        (selectedGenders ? selectedGenders.split(",") : []).sort()
      ) ||
    JSON.stringify(tempCategories.sort()) !==
      JSON.stringify(
        (selectedCategories ? selectedCategories.split(",") : []).sort()
      ) ||
    tempPriceRange[0] !== priceMin ||
    tempPriceRange[1] !== priceMax;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ListFilter className="h-4 w-4" />
          {hasActiveFilters && (
            <div className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex min-w-1/5 flex-col sm:w-96">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Price Range */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="px-2">
              <Slider
                value={tempPriceRange}
                onValueChange={handlePriceChange}
                max={priceRange.max}
                min={priceRange.min}
                step={10}
                className="w-full"
              />
              <div className="text-muted-foreground mt-2 flex justify-between text-sm">
                <span>{formatPrice(tempPriceRange[0])}</span>
                <span>{formatPrice(tempPriceRange[1])}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          {categories.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Category</Label>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={tempCategories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="cursor-pointer text-sm font-normal capitalize"
                    >
                      {category.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && materials.length > 0 && <Separator />}

          {/* Materials */}
          {materials.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Material</Label>
              <div className="space-y-3">
                {materials.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={`material-${material}`}
                      checked={tempMaterials.includes(material)}
                      onCheckedChange={(checked) =>
                        handleMaterialChange(material, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`material-${material}`}
                      className="cursor-pointer text-sm font-normal capitalize"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {materials.length > 0 && genders.length > 0 && <Separator />}

          {/* Gender */}
          {genders.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Gender</Label>
              <div className="space-y-3">
                {genders.map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gender-${gender}`}
                      checked={tempGenders.includes(gender)}
                      onCheckedChange={(checked) =>
                        handleGenderChange(gender, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`gender-${gender}`}
                      className="cursor-pointer text-sm font-normal capitalize"
                    >
                      {gender}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6">
          <Button variant="secondary" onClick={clearAllFilters}>
            Clear all
          </Button>
          <Button onClick={applyFilters} disabled={!hasChanges}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
