"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TPageSection } from "@/db/schema";

type SectionEditorProps = {
  section?: TPageSection;
  onSave: (type: string, content: Record<string, unknown>) => void;
  onCancel: () => void;
};

const SECTION_TYPES = [
  { value: "hero", label: "Hero Banner" },
  { value: "text", label: "Text Content" },
  { value: "image_text", label: "Image + Text" },
  { value: "gallery", label: "Image Gallery" },
  { value: "cta", label: "Call to Action" },
  { value: "features", label: "Features Grid" },
  { value: "custom", label: "Custom HTML" },
];

export function SectionEditor({
  section,
  onSave,
  onCancel,
}: SectionEditorProps) {
  const [type, setType] = useState(section?.type || "text");
  const [content, setContent] = useState<Record<string, unknown>>(
    (section?.content as Record<string, unknown>) || {}
  );

  const handleSave = () => {
    onSave(type, content);
  };

  const updateContent = (key: string, value: unknown) => {
    setContent({ ...content, [key]: value });
  };

  const renderFields = () => {
    switch (type) {
      case "hero":
        return (
          <>
            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input
                value={(content.title as string) || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Welcome to our store"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={(content.subtitle as string) || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
                placeholder="Your tagline here"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input
                value={(content.image as string) || ""}
                onChange={(e) => updateContent("image", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={(content.buttonText as string) || ""}
                onChange={(e) => updateContent("buttonText", e.target.value)}
                placeholder="Shop Now"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input
                value={(content.buttonLink as string) || ""}
                onChange={(e) => updateContent("buttonLink", e.target.value)}
                placeholder="/products"
              />
            </div>
          </>
        );

      case "text":
        return (
          <>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={(content.heading as string) || ""}
                onChange={(e) => updateContent("heading", e.target.value)}
                placeholder="Section heading"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={(content.body as string) || ""}
                onChange={(e) => updateContent("body", e.target.value)}
                placeholder="Your content here..."
                rows={8}
              />
            </div>
          </>
        );

      case "image_text":
        return (
          <>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={(content.heading as string) || ""}
                onChange={(e) => updateContent("heading", e.target.value)}
                placeholder="Section heading"
              />
            </div>
            <div className="space-y-2">
              <Label>Text</Label>
              <Textarea
                value={(content.text as string) || ""}
                onChange={(e) => updateContent("text", e.target.value)}
                placeholder="Your text here..."
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={(content.image as string) || ""}
                onChange={(e) => updateContent("image", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Image Position</Label>
              <Select
                value={(content.imagePosition as string) || "left"}
                onValueChange={(value) => updateContent("imagePosition", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "cta":
        return (
          <>
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={(content.heading as string) || ""}
                onChange={(e) => updateContent("heading", e.target.value)}
                placeholder="Ready to get started?"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={(content.description as string) || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                placeholder="Description text"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={(content.buttonText as string) || ""}
                onChange={(e) => updateContent("buttonText", e.target.value)}
                placeholder="Get Started"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input
                value={(content.buttonLink as string) || ""}
                onChange={(e) => updateContent("buttonLink", e.target.value)}
                placeholder="/contact"
              />
            </div>
          </>
        );

      case "custom":
        return (
          <div className="space-y-2">
            <Label>Custom HTML/Content (JSON)</Label>
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              placeholder='{"key": "value"}'
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label>Content (JSON)</Label>
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              placeholder='{"key": "value"}'
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderFields()}

      <div className="flex items-center gap-2 pt-4">
        <Button onClick={handleSave}>Save Section</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
