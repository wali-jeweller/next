"use client";

import { Upload, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string | string[]; // Single URL or array of URLs
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  accept?: string;
}

interface UploadedFile {
  url: string;
  key: string;
  name: string;
}

export function FileUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
  disabled = false,
  className,
  accept = "image/*",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const existingFiles = Array.isArray(value) ? value : value ? [value] : [];

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    try {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 10 }));

      // Get presigned URL
      const presignedResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!presignedResponse.ok) {
        const error = await presignedResponse.json();
        throw new Error(error.error || "Failed to get presigned URL");
      }

      const { uploadUrl, publicUrl, fileKey } = await presignedResponse.json();

      setUploadProgress((prev) => ({ ...prev, [file.name]: 30 }));

      // Upload directly to R2 using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to R2");
      }

      setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

      return {
        url: publicUrl,
        key: fileKey,
        name: file.name,
      };
    } catch (error) {
      console.error(`Upload error for ${file.name}:`, error);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
      throw error;
    }
  };

  const handleUpload = async (files: File[]) => {
    if (disabled) return;

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        try {
          return await uploadFile(file);
        } catch {
          toast.error(`Failed to upload ${file.name}`);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadedFile[];

      if (successfulUploads.length === 0) {
        toast.error("No files were uploaded successfully");
        return;
      }

      const newUrls = successfulUploads.map((upload) => upload.url);

      if (multiple) {
        const currentUrls = Array.isArray(value) ? value : [];
        const updatedUrls = [...currentUrls, ...newUrls];
        onChange(updatedUrls.slice(0, maxFiles)); // Respect maxFiles limit
      } else {
        // For single uploads, always replace the existing value
        onChange(newUrls[0]);
      }

      toast.success(
        successfulUploads.length === 1
          ? "Image uploaded successfully"
          : `${successfulUploads.length} images uploaded successfully`
      );
    } catch (error) {
      toast.error("Upload failed");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return;

      const remainingSlots = multiple ? maxFiles - existingFiles.length : 1;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      if (filesToUpload.length < acceptedFiles.length) {
        toast.warning(
          `Only ${filesToUpload.length} files can be uploaded (limit: ${maxFiles})`
        );
      }

      if (filesToUpload.length > 0) {
        handleUpload(filesToUpload);
      }
    },
    [disabled, existingFiles.length, maxFiles, multiple, handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
    disabled: disabled || isUploading,
    maxFiles: multiple ? maxFiles - existingFiles.length : 1,
  });

  const canUploadMore = multiple ? existingFiles.length < maxFiles : true; // For single uploads, always allow uploading (to replace existing)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="flex-1">{fileName}</span>
              <span>{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload dropzone */}
      {canUploadMore && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50",
            isDragActive && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "pointer-events-none opacity-75"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="text-sm">
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <div>
                  <p className="font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-muted-foreground">
                    {accept === "image/*" ? "Images only" : "Files"} (max 10MB
                    each)
                  </p>
                  {multiple && (
                    <p className="text-muted-foreground text-xs">
                      {maxFiles - existingFiles.length} more files allowed
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info text */}
      {!canUploadMore && multiple && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum {maxFiles} files reached
        </p>
      )}
    </div>
  );
}

// Simpler single image upload component
interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  className,
}: ImageUploadProps) {
  const handleChange = (newValue: string | string[]) => {
    // For single image upload, we expect a string
    if (typeof newValue === "string") {
      onChange(newValue);
    } else if (Array.isArray(newValue) && newValue.length > 0) {
      onChange(newValue[0]); // Take the first image
    } else {
      onChange("");
    }
  };

  return (
    <FileUpload
      value={value}
      onChange={handleChange}
      multiple={false}
      maxFiles={1}
      disabled={disabled}
      className={className}
      accept="image/*"
    />
  );
}

// Multiple images upload component
interface MultipleImageUploadProps {
  value?: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function MultipleImageUpload({
  value,
  onChange,
  maxFiles = 10,
  disabled = false,
  className,
}: MultipleImageUploadProps) {
  const handleChange = (newValue: string | string[]) => {
    // For multiple image upload, we expect an array
    if (Array.isArray(newValue)) {
      onChange(newValue);
    } else if (typeof newValue === "string") {
      onChange(newValue ? [newValue] : []);
    } else {
      onChange([]);
    }
  };

  return (
    <FileUpload
      value={value}
      onChange={handleChange}
      multiple={true}
      maxFiles={maxFiles}
      disabled={disabled}
      className={className}
      accept="image/*"
    />
  );
}
