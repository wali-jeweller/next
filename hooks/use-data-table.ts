"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  parseAsInteger,
  parseAsJson,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useState } from "react";

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  defaultPageSize?: number;
  enableMultiRowSelection?: boolean;
  enableGlobalFilter?: boolean;
}

export function useDataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  defaultPageSize = 10,
  enableMultiRowSelection = true,
  enableGlobalFilter = true,
}: UseDataTableProps<TData, TValue>) {
  // URL-based state management with nuqs
  const [globalFilter, setGlobalFilter] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    })
  );

  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0).withOptions({
      clearOnDefault: true,
    })
  );

  const [pageSize, setPageSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(defaultPageSize).withOptions({
      clearOnDefault: true,
    })
  );

  const [sortingState, setSortingState] = useQueryState(
    "sort",
    parseAsJson((value: unknown): SortingState => {
      if (Array.isArray(value)) return value as SortingState;
      return [];
    })
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
      })
  );

  const [columnFiltersState, setColumnFiltersState] = useQueryState(
    "filters",
    parseAsJson((value: unknown): ColumnFiltersState => {
      // Support both array and single-object encodings coming from the URL.
      // Some serializers encode a single filter as an object instead of an
      // array. Normalize that to an array so the table receives consistent
      // ColumnFiltersState.
      if (Array.isArray(value)) return value as ColumnFiltersState;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return [value as unknown as { id: string; value: unknown }];
      }
      return [];
    })
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
      })
  );

  const [columnVisibilityState, setColumnVisibilityState] = useQueryState(
    "columns",
    parseAsJson((value: unknown): VisibilityState => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as VisibilityState;
      }
      return {};
    })
      .withDefault({})
      .withOptions({
        clearOnDefault: true,
      })
  );

  // Local state for row selection (doesn't need to be in URL)
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / (pageSize ?? defaultPageSize)),
    state: {
      sorting: sortingState ?? [],
      columnVisibility: columnVisibilityState ?? {},
      rowSelection,
      columnFilters: columnFiltersState ?? [],
      globalFilter: enableGlobalFilter ? globalFilter ?? "" : "",
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize ?? defaultPageSize,
      },
    },
    enableRowSelection: enableMultiRowSelection,
    enableMultiRowSelection,
    enableGlobalFilter,
    manualPagination: false,
    autoResetPageIndex: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFiltersState,
    onColumnVisibilityChange: setColumnVisibilityState,
    onGlobalFilterChange: enableGlobalFilter ? setGlobalFilter : undefined,
    onPaginationChange: (updater) => {
      const currentPagination = {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize ?? defaultPageSize,
      };

      if (typeof updater === "function") {
        const newPagination = updater(currentPagination);
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Helper functions for easier state management
  const resetFilters = () => {
    if (enableGlobalFilter) setGlobalFilter("");
    setColumnFiltersState([]);
    setPageIndex(0);
  };

  const resetTable = () => {
    resetFilters();
    setSortingState([]);
    setColumnVisibilityState({});
    setRowSelection({});
  };

  const resetPagination = () => {
    setPageIndex(0);
    setPageSize(defaultPageSize);
  };

  const goToPage = (page: number) => {
    const totalPages = table.getPageCount();
    const safePageIndex = Math.max(0, Math.min(page, totalPages - 1));
    setPageIndex(safePageIndex);
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPageIndex(0); // Reset to first page when changing page size
  };

  // Computed values
  const isFiltered =
    (enableGlobalFilter && globalFilter !== "") ||
    columnFiltersState.length > 0 ||
    sortingState.length > 0;

  const selectedRowCount = Object.keys(rowSelection).length;
  const totalRows = table.getFilteredRowModel().rows.length;

  return {
    table,
    // State
    globalFilter: enableGlobalFilter ? globalFilter ?? "" : "",
    setGlobalFilter: enableGlobalFilter ? setGlobalFilter : () => {},
    filterColumn,
    pageIndex: pageIndex ?? 0,
    pageSize: pageSize ?? defaultPageSize,
    setPageIndex,
    setPageSize,
    sorting: sortingState ?? [],
    setSorting: setSortingState,
    columnFilters: columnFiltersState ?? [],
    setColumnFilters: setColumnFiltersState,
    columnVisibility: columnVisibilityState ?? {},
    setColumnVisibility: setColumnVisibilityState,
    rowSelection,
    setRowSelection,
    // Helper functions
    resetFilters,
    resetTable,
    resetPagination,
    goToPage,
    changePageSize,
    // Computed values
    isFiltered,
    selectedRowCount,
    totalRows,
    // Configuration
    enableMultiRowSelection,
    enableGlobalFilter,
  };
}
