/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

function ImageUploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: ImageUploadDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Generate previews
    const previewUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
      },
      multiple: true,
    });

  const handleUpload = async () => {
    if (acceptedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      acceptedFiles.forEach((file: File) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      toast.success(`Successfully uploaded ${data.images.length} image(s)`);

      // Cleanup previews
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);

      onUploadComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to upload images");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Drag and drop images or click to browse. Supports PNG, JPG, WEBP,
            and GIF.
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">
              Drop the files here...
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Drag & drop images here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                You can upload multiple images at once
              </p>
            </div>
          )}
        </div>

        {previews.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-medium">
              {previews.length} file(s) selected
            </p>
            <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || previews.length === 0}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {previews.length > 0 && `(${previews.length})`}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [images, setImages] = useState<TImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<TImage[]>(selectedImages);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/images");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      toast.error("Failed to load images");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  const filteredImages = images.filter((img) =>
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
              Select images from your library or upload new ones
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-6">
            {/* Search and Upload */}
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
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>

            {/* Images Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-semibold">No images found</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "Upload your first image to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredImages.map((image) => {
                  const isSelected = selected.find(
                    (img) => img.id === image.id
                  );
                  return (
                    <button
                      key={image.id}
                      onClick={() => toggleImage(image)}
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

            {/* Selected Count and Actions */}
            {selected.length > 0 && (
              <div className="sticky bottom-0 bg-background border-t pt-4 flex items-center justify-between">
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

      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={fetchImages}
      />
    </>
  );
}
