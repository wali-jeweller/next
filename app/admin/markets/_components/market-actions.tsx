"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MarketFormDialog } from "./market-form-dialog";
import { deleteMarketAction, updateMarketAction } from "../actions";
import { toast } from "sonner";
import type { MarketWithRates } from "./columns";

interface MarketActionsProps {
  market: MarketWithRates;
}

export function MarketActions({ market }: MarketActionsProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = async (data: {
    name: string;
    code: string;
    currency: string;
    region: string;
    isActive: boolean;
    materialRates: Array<{
      material: "gold" | "silver" | "platinum" | "pladium" | "other";
      pricePerGram: number;
    }>;
  }) => {
    const result = await updateMarketAction({
      id: market.id,
      ...data,
    });

    if (result.success) {
      toast.success("Market updated successfully");
      setEditOpen(false);
    } else {
      toast.error(result.error || "Failed to update market");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteMarketAction(market.id);

    if (result.success) {
      toast.success("Market deleted successfully");
      setDeleteOpen(false);
    } else {
      toast.error(result.error || "Failed to delete market");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(market.id)}
          >
            Copy market ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit market
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete market
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MarketFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        mode="edit"
        defaultValues={{
          name: market.name,
          code: market.code,
          currency: market.currency,
          region: market.region,
          isActive: market.isActive ?? true,
          materialRates: (market.materialRates || []).map(
            (rate: { material: string; pricePerGram: number }) => ({
              material: rate.material as
                | "gold"
                | "silver"
                | "platinum"
                | "pladium"
                | "other",
              pricePerGram: rate.pricePerGram,
            })
          ),
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              market "{market.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
