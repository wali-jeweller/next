"use client";

import { GripVertical } from "lucide-react";
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
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import type { TProduct } from "@repo/db/schema";
import { updateProductAttributesOrderAction } from "../actions";
import { AttributesAction } from "./attributes-action";
import { CreateAttribute } from "./create-attribute";

type AttributeWithRank = {
  name: string;
  value: string;
  rank: number;
};

export function AttributesCard({ product }: { product: TProduct }) {
  const [attributes, setAttributes] = React.useState<AttributeWithRank[]>(
    (
      product.attributes?.map((attr, index) => ({
        ...attr,
        rank: attr.rank ?? index,
      })) || []
    ).sort((a, b) => a.rank - b.rank)
  );
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setAttributes(
      (
        product.attributes?.map((attr, index) => ({
          ...attr,
          rank: attr.rank ?? index,
        })) || []
      ).sort((a, b) => a.rank - b.rank)
    );
  }, [product.attributes]);

  const updateAttributesOrder = (newAttributes: AttributeWithRank[]) => {
    setAttributes(newAttributes);
    startTransition(() => {
      updateProductAttributesOrderAction({
        productId: product.id,
        attributes: newAttributes.map((attr, index) => ({
          name: attr.name,
          value: attr.value,
          rank: index,
        })),
      });
    });
  };

  const handleMove = ({
    activeIndex,
    overIndex,
  }: {
    activeIndex: number;
    overIndex: number;
  }) => {
    if (activeIndex === overIndex) return;

    const newAttributes = [...attributes];
    const [movedItem] = newAttributes.splice(activeIndex, 1);
    newAttributes.splice(overIndex, 0, movedItem);

    updateAttributesOrder(newAttributes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attributes</CardTitle>
        <CardDescription>Manage product attributes</CardDescription>
        <CardAction>
          <CreateAttribute productId={product.id} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 border-t pt-4">
        {attributes.length > 0 ? (
          <Sortable
            value={attributes}
            onMove={handleMove}
            getItemValue={(item) => `${item.name}-${item.rank}`}
          >
            {attributes.map((attr, index) => (
              <SortableContent key={`${attr.name}-${attr.rank}`} asChild>
                <SortableItem
                  value={`${attr.name}-${attr.rank}`}
                  disabled={isPending}
                  className="flex items-center"
                >
                  <SortableItemHandle disabled={isPending} asChild>
                    <Button variant="ghost" size="sm">
                      <GripVertical />
                    </Button>
                  </SortableItemHandle>
                  <CardSubItem
                    label={attr.name}
                    value={attr.value}
                    className="w-full"
                  />
                  <AttributesAction
                    productId={product.id}
                    attributeIndex={index}
                    attribute={attr}
                  />
                </SortableItem>
              </SortableContent>
            ))}
          </Sortable>
        ) : (
          <div className="text-muted-foreground flex h-24 items-center justify-center">
            No attributes
          </div>
        )}
      </CardContent>
    </Card>
  );
}
