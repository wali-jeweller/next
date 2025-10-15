"use client";

import type { Table } from "@tanstack/react-table";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilterConfig } from "./data-table";
import {
  DataTableFacetedFilter,
  type Option,
} from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  filterColumn?: string;
  filters?: FilterConfig[];
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  filters,
  children,
}: DataTableToolbarProps<TData>) {
  "use no memo";

  const isFiltered =
    table.getState().columnFilters.length > 0 || globalFilter !== "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filters?.map((filter) => {
          const column = table?.getColumn(filter.columnKey);
          return column ? (
            <DataTableFacetedFilter
              key={filter.columnKey}
              column={column}
              title={filter.title}
              options={filter.options as Option[]}
            />
          ) : null;
        })}
        <DataTableViewOptions table={table} />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setGlobalFilter("");
            }}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
