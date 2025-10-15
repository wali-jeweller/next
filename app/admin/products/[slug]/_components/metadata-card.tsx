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
import { UpdateMetadata } from "./update-metadata";

export function MetadataCard({ product }: { product: TProduct }) {
  const metadata = product.metadata as {
    title: string | null;
    description: string | null;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
        <CardDescription>Manage product metadata</CardDescription>
        <CardAction>
          <UpdateMetadata
            id={product.id}
            title={metadata?.title ?? ""}
            description={metadata?.description ?? ""}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 border-t pt-4">
        <CardSubItem label="Meta Title" value={metadata?.title ?? "N/A"} />
        <CardSubItem
          label="Meta Description"
          value={metadata?.description ?? "N/A"}
        />
      </CardContent>
    </Card>
  );
}
