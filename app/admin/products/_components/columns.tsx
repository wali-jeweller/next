"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableActions } from "./product-table-actions";
import { StatusBadge, VisibilityBadge } from "./status-badge";
import { ProductsWithRelations } from "./product-table";

export const columns: ColumnDef<ProductsWithRelations[number]>[] = [
  {
    accessorKey: "thumbnail",
    header: "",
    cell: ({ row }) => (
      <Image
        src={row.original.images?.[0]?.url || "/placeholder.png"}
        alt={row.original.title}
        width={100}
        height={100}
        className="h-12 w-12 rounded-sm object-cover"
        unoptimized
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Button variant={"link"} asChild>
        <Link href={`/products/${row.original.slug}`} prefetch={false}>
          {row.original.title}
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      const categoryId = row.original.categoryId;
      if (!category) return "N/A";

      return (
        <Badge variant="outline" className="text-xs">
          {category?.title || categoryId}
        </Badge>
      );
    },
    // TanStack passes (row, columnId, filterValue) for custom filterFns.
    filterFn: (row, _columnId, value) => {
      const filterValues = Array.isArray(value) ? value : [value];
      const categoryId = row.original.categoryId;

      if (!categoryId) {
        return filterValues.includes("none");
      }

      return filterValues.includes(categoryId.toString());
    },
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) => {
      const collections =
        row.original.collectionProducts
          ?.map((x) => x.collection)
          .filter(Boolean) || [];

      return (
        <div className="flex flex-wrap gap-1">
          {collections.map((c) => (
            <Badge key={c?.id} variant="outline" className="text-xs">
              {c?.title}
            </Badge>
          ))}
          {collections.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{collections.length - 2}
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, _columnId, value) => {
      const filterValues = Array.isArray(value) ? value : [value];
      const collections =
        row.original.collectionProducts
          ?.map((x) => x.collection)
          .filter(Boolean) || [];

      if (collections.length === 0) {
        return filterValues.includes("none");
      }

      return collections.some((c) => c && filterValues.includes(c.id));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, _columnId, value) => {
      const filterValues = Array.isArray(value) ? value : [value];
      return filterValues.includes(row.original.status || "");
    },
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => <VisibilityBadge visibility={row.original.visibility} />,
    filterFn: (row, _columnId, value) => {
      const filterValues = Array.isArray(value) ? value : [value];
      return filterValues.includes(row.original.visibility || "");
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender;
      if (!gender) return "N/A";

      const genderLabels: Record<string, string> = {
        men: "Men",
        women: "Women",
        baby: "Baby",
        unisex: "Unisex",
      };

      return (
        <Badge variant="outline" className="text-xs">
          {genderLabels[gender] || gender}
        </Badge>
      );
    },
    filterFn: (row, _columnId, value) => {
      const filterValues = Array.isArray(value) ? value : [value];
      const gender = row.original.gender || "none";
      return filterValues.includes(gender);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <TableActions product={row.original} />;
    },
  },
];
