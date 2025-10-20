/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Search, Image as ImageIcon, Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TImage } from "@/db/schema";

interface ImageLibrarySheetProps {
  onSelect: (images: TImage[]) => void;
  selectedImages?: TImage[];
  trigger?: React.ReactNode;
  multiSelect?: boolean;
}

export function ImageLibrarySheet({
  onSelect,
  selectedImages = [],
  trigger,
  multiSelect = true,
}: ImageLibrarySheetProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<TImage[]>(selectedImages);
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch images query
  const { data: imagesData, isLoading: loading } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await fetch("/api/images");
      if (!response.ok) throw new Error("Failed to fetch images");
      return response.json();
    },
    enabled: open,
  });

  const images: TImage[] = imagesData?.images || [];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file: File) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Successfully uploaded ${data.images.length} image(s)`);
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onError: (error) => {
      toast.error("Failed to upload images");
      console.error(error);
    },
  });

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadMutation.mutate([...acceptedFiles]);
      }
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    multiple: true,
    noClick: true, // We'll handle clicks manually
  });

  const filteredImages = images.filter((img: TImage) =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleImage = (image: TImage) => {
    if (multiSelect) {
      setSelected((prev) =>
        prev.find((img) => img.id === image.id)
          ? prev.filter((img) => img.id !== image.id)
          : [...prev, image]
      );
    } else {
      setSelected([image]);
    }
  };

  const handleSelect = () => {
    onSelect(selected);
    setOpen(false);
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
    // Reset input
    e.target.value = "";
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {trigger || (
            <Button variant="outline">
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Images
            </Button>
          )}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Image Library</SheetTitle>
            <SheetDescription>
              Select images from your library or drag & drop to upload
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Images Grid - Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                "relative min-h-[400px] rounded-lg border-2 border-dashed transition-colors p-4",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              )}
            >
              <input {...getInputProps()} />

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {/* Upload Placeholder - First Item */}
                  <button
                    type="button"
                    onClick={handlePlaceholderClick}
                    className="relative aspect-square rounded-lg border border-dashed border-muted-foreground/50 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center group"
                  >
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground group-hover:text-primary">
                        Upload
                      </p>
                    </div>
                  </button>

                  {/* Existing Images */}
                  {filteredImages.map((image: TImage) => {
                    const isSelected = selected.find(
                      (img) => img.id === image.id
                    );
                    return (
                      <button
                        key={image.id}
                        onClick={() => toggleImage(image)}
                        type="button"
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                          isSelected
                            ? "border-primary ring-2 ring-primary ring-offset-2"
                            : "border-transparent hover:border-muted-foreground/50"
                        )}
                      >
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="object-cover w-full h-full"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              ✓
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Drag overlay */}
              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg pointer-events-none z-10">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-primary">
                      Drop images here to upload
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Progress Overlay */}
              {uploadMutation.isPending && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <Loader2 className="h-16 w-16 animate-spin text-primary" />
                      <button
                        onClick={() => {
                          toast.info("Upload cannot be cancelled");
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background border-2 border-primary hover:bg-destructive hover:border-destructive transition-colors flex items-center justify-center group"
                      >
                        <X className="h-4 w-4 text-primary group-hover:text-destructive-foreground" />
                      </button>
                    </div>
                    <p className="mt-4 text-sm font-medium">
                      Uploading images...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Count and Actions */}
            {selected.length > 0 && (
              <div className="sticky bottom-0 bg-background border-t pt-4 flex items-center justify-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {selected.length} image(s) selected
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelected([])}>
                    Clear
                  </Button>
                  <Button onClick={handleSelect}>
                    Select {selected.length} Image(s)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
