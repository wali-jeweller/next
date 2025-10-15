"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { TProduct } from "@repo/db/schema";
import { cn } from "@/lib/utils";
import { updateProductSchema } from "../../types";
import { updateProductAction } from "../actions";

type Props = {
  product: TProduct;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export function UpdateProductDetails({ product, open, setOpen }: Props) {
  return (
    <Sheet open={open ?? false} onOpenChange={setOpen}>
      <SheetContent className="min-w-[40vw]">
        <SheetHeader>
          <SheetTitle>Update Product</SheetTitle>
          <SheetDescription>Update product details</SheetDescription>
        </SheetHeader>
        <CreateProductForm product={product} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

type FormValues = z.infer<typeof updateProductSchema>;

function CreateProductForm({
  product,
  setOpen,
}: {
  product: TProduct;
  setOpen?: (open: boolean) => void;
}) {
  const [isPending, startTransition] = React.useTransition();
  const [slugChanged, setSlugChanged] = React.useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      title: product.title,
      description: product.description ?? "",
      slug: product.slug ?? "",
      visibility: product.visibility as "public" | "private",
      status: product.status as
        | "new"
        | "featured"
        | "sale"
        | "trending"
        | "coming_soon"
        | "available_on_order"
        | "out_of_stock",
    },
  });
  const onSubmit = async (values: FormValues) => {
    startTransition(async () => {
      const res = await updateProductAction({
        ...values,
      });
      if (res?.error) {
        form.setError("title", {
          type: "manual",
          message: res.error,
        });
      } else {
        setOpen?.(false);
        if (slugChanged) {
          router.push(`/products/${values.slug}`);
        }
      }
    });
  };

  const generateSlug = () => {
    const title = form.getValues("title"); // Get current title
    const newSlug = encodeURIComponent(
      title.trim().toLowerCase().replace(/\s+/g, "-")
    );
    form.setValue("slug", newSlug);
    setSlugChanged(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="relative flex">
                  <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                    /
                  </span>
                  <Input
                    {...field}
                    className="rounded-s-none rounded-e-none border-s-0 shadow-none"
                  />
                  <Button
                    type="button"
                    className="rounded-s-none border-s-0"
                    variant="secondary"
                    onClick={() => generateSlug()}
                  >
                    Generate
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Visibility</FormLabel>
                <FormDescription>
                  Control the visibility of the product
                </FormDescription>
              </div>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {updateProductSchema.shape.visibility.options.map(
                      (value) => (
                        <SelectItem key={value} value={value}>
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                value === "public" && "bg-green-500",
                                value === "private" && "bg-gray-500"
                              )}
                            >
                              {" "}
                            </span>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </span>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Status</FormLabel>
                <FormDescription>
                  Control the status of the product
                </FormDescription>
              </div>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {updateProductSchema.shape.status.options.map((value) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              value === "new" && "bg-green-500",
                              value === "featured" && "bg-blue-500",
                              value === "sale" && "bg-yellow-500",
                              value === "trending" && "bg-gray-500",
                              value === "coming_soon" && "bg-cyan-500",
                              value === "available_on_order" && "bg-orange-500",
                              value === "out_of_stock" && "bg-red-500"
                            )}
                          >
                            {" "}
                          </span>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <SheetFooter>
          <Button type="submit" loading={isPending}>
            Update
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
