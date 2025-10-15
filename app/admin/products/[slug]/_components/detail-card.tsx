"use client";

import { MoreVertical } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardSubItem,
  CardTitle,
} from "@/components/ui/card";
import type { TProduct } from "@repo/db/schema";
import { StatusBadge, VisibilityBadge } from "../../_components/status-badge";
import { UpdateProductDetails } from "./update-details";

export function DetailCard({ product }: { product: TProduct }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <UpdateProductDetails product={product} open={open} setOpen={setOpen} />
      <Card>
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
              <MoreVertical />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2 border-t pt-4">
          <CardSubItem
            label="Visibility"
            value={<VisibilityBadge visibility={product.visibility} />}
          />
          <CardSubItem
            label="Status"
            value={<StatusBadge status={product.status} />}
          />
          <CardSubItem label="Description" value={product.description} />
          <CardSubItem
            label="Slug"
            value={product.slug ?? `/${product.title}`}
          />
        </CardContent>
      </Card>
    </>
  );
}
