"use client";

import { MoreVertical } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import type { TProduct } from "@/db/schema";
import { StatusBadge, VisibilityBadge } from "../../_components/status-badge";
import { UpdateProductDetails } from "./update-details";
import { Item } from "@/components/ui/item";

export function DetailCard({ product }: { product: TProduct }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <UpdateProductDetails product={product} open={open} setOpen={setOpen} />
    </>
  );
}
