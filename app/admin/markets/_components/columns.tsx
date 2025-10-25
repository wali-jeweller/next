"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { TMarket, TMaterialRate } from "@/db/schema";
import { materialEnum } from "@/db/schema";
import { MarketActions } from "./market-actions";

export type MarketWithRates = TMarket & {
  materialRates?: TMaterialRate[];
};

const formatCurrency = (currency: string) => {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    AED: "د.إ",
    EUR: "€",
    GBP: "£",
  };
  return currencySymbols[currency] || currency;
};

const formatMaterialName = (material: string) => {
  return material.charAt(0).toUpperCase() + material.slice(1);
};

export const columns: ColumnDef<MarketWithRates>[] = [
  {
    accessorKey: "name",
    header: "Market Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.region}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        {row.original.code}
      </Badge>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-lg">{formatCurrency(row.original.currency)}</span>
        <span className="text-sm text-muted-foreground">
          {row.original.currency}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "materialRates",
    header: "Material Rates",
    cell: ({ row }) => {
      const rates = row.original.materialRates || [];

      if (rates.length === 0) {
        return (
          <span className="text-sm text-muted-foreground">No rates set</span>
        );
      }

      const activeRates = rates.filter(
        (rate) => !rate.effectiveTo || new Date(rate.effectiveTo) > new Date()
      );

      return (
        <div className="flex flex-wrap gap-1">
          {materialEnum.map((material) => {
            const rate = activeRates.find((r) => r.material === material);
            if (!rate) return null;

            return (
              <Badge
                key={material}
                variant="secondary"
                className="text-xs font-normal"
              >
                {formatMaterialName(material)}:{" "}
                {formatCurrency(row.original.currency)}
                {rate.pricePerGram}/g
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
    filterFn: (row, _columnId, value) => {
      const filterValues = Array.isArray(value) ? value : [value];
      return filterValues.includes(
        row.original.isActive ? "active" : "inactive"
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <MarketActions market={row.original} />,
  },
];
