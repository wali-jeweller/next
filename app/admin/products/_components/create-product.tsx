"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { TCategory } from "@/db/schema";
import { cn } from "@/lib/utils";
import { createProductAction } from "../actions";
import { productSchema } from "../types";

export function CreateProduct({ categories }: { categories: TCategory[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusCircle />
          Create Product
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[40vw]">
        <SheetHeader>
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription>Create a new product</SheetDescription>
        </SheetHeader>
        <CreateProductForm categories={categories} />
      </SheetContent>
    </Sheet>
  );
}

type FormValues = z.infer<typeof productSchema>;

function CreateProductForm({ categories }: { categories: TCategory[] }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      visibility: "private",
      status: "new",
      categoryId: "",
    },
  });
  const onSubmit = async (values: FormValues) => {
    const encodedSlug = encodeURIComponent(values.slug);
    const { error } = await createProductAction({
      ...values,
      slug: encodedSlug,
    });
    if (error) {
      form.setError("title", {
        type: "manual",
        message: error,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-[150vh] space-y-5"
      >
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
                    className="rounded-s-none border-s-0 shadow-none"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div>
                <FormLabel>Category</FormLabel>
                <FormDescription>
                  Select a category for the product
                </FormDescription>
              </div>
              <div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
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
                    {productSchema.shape.visibility.options.map((value) => (
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
                    ))}
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
                    {productSchema.shape.status.options.map((value) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              value === "new" && "bg-green-500",
                              value === "featured" && "bg-blue-500",
                              value === "sale" && "bg-yellow-500",
                              value === "trending" && "bg-purple-500",
                              value === "coming_soon" && "bg-gray-500",
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
          <Button type="submit" className="w-full">
            Create
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
