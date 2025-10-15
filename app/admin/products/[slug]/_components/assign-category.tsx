"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TCategory, TProduct } from "@/db/schema";
import { cn } from "@/lib/utils";
import { assignToCategoryAction } from "../actions";

export const AssignCategory = ({
  categories,
  product,
}: {
  categories: TCategory[];
  product: TProduct;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const currentCategoryName = categories.find(
    (category) => category.id === product.categoryId
  )?.title;

  const handleAssignCategory = async (categoryId: string) => {
    startTransition(async () => {
      const res = await assignToCategoryAction({
        categoryId,
        productId: product.id,
      });
      if (res?.error) {
        toast.error(res.error);
      }
      toast.success("Category assigned successfully");
      setOpen(false);
    });
  };

  return (
    <div className="flex justify-between">
      <Label htmlFor="category">Category</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between"
            size={"sm"}
          >
            {product.categoryId ? currentCategoryName : "No category assigned"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <Command>
            <CommandInput placeholder="Search collections..." />
            <CommandList>
              <CommandEmpty>No collection found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={() => {
                      handleAssignCategory(category.id);
                    }}
                    disabled={isPending}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        product.categoryId === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
