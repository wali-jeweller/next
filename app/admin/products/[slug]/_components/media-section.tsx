import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Upload } from "lucide-react";
import { ImageLibrarySheet } from "@/components/admin/image-library-sheet";
import type { TImage } from "@/db/schema";

interface MediaSectionProps {
  productImages: TImage[];
  onImageSelect: (images: TImage[]) => void;
}

export function MediaSection({
  productImages,
  onImageSelect,
}: MediaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>Upload and manage product images</CardDescription>
        <CardAction>
          <ImageLibrarySheet
            onSelect={onImageSelect}
            selectedImages={productImages}
            multiSelect={true}
            trigger={
              <Button variant="outline" type="button" size={"icon-sm"}>
                <Upload className="size-4" />
              </Button>
            }
          />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {productImages.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Assigned Images ({productImages.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {productImages.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <Upload className="size-6" />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle>No images assigned</EmptyTitle>
                <EmptyDescription>
                  Click the button above to select images from your library
                </EmptyDescription>
              </EmptyContent>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
