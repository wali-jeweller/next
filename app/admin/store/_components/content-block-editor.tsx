"use client";

import { useState } from "react";
import { ContentBlock } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Type,
  Layout,
  Grid as GridIcon,
  Heading1,
  MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentBlockEditorProps = {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  disabled?: boolean;
};

const BLOCK_TYPES = [
  { value: "header", label: "Header", icon: Heading1, color: "text-blue-500" },
  { value: "section", label: "Section", icon: Layout, color: "text-green-500" },
  { value: "grid", label: "Grid", icon: GridIcon, color: "text-purple-500" },
  { value: "text", label: "Text", icon: Type, color: "text-orange-500" },
  { value: "cta", label: "CTA", icon: MousePointerClick, color: "text-red-500" },
] as const;

export function ContentBlockEditor({
  blocks,
  onChange,
  disabled,
}: ContentBlockEditorProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedBlocks(newExpanded);
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      data: getDefaultData(type),
      children: [],
    };
    onChange([...blocks, newBlock]);
    setExpandedBlocks(new Set([...expandedBlocks, newBlock.id]));
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
    const newExpanded = new Set(expandedBlocks);
    newExpanded.delete(id);
    setExpandedBlocks(newExpanded);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];
    onChange(newBlocks);
  };

  if (disabled) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <Layout className="h-12 w-12 mx-auto opacity-20" />
          <p>Save page metadata to start editing content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {blocks.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No blocks yet</CardTitle>
            <CardDescription>
              Start building your page by adding content blocks
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              isExpanded={expandedBlocks.has(block.id)}
              onToggleExpand={() => toggleExpand(block.id)}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onDelete={() => deleteBlock(block.id)}
              onMove={moveBlock}
            />
          ))}
        </div>
      )}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Add Block</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {BLOCK_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(type.value)}
                  className="flex flex-col h-auto py-3 gap-2"
                >
                  <Icon className={cn("h-5 w-5", type.color)} />
                  <span className="text-xs">{type.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type BlockEditorProps = {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onMove: (index: number, direction: "up" | "down") => void;
};

function BlockEditor({
  block,
  index,
  totalBlocks,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onMove,
}: BlockEditorProps) {
  const blockType = BLOCK_TYPES.find((t) => t.value === block.type);
  const Icon = blockType?.icon || Layout;

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <Icon className={cn("h-4 w-4", blockType?.color)} />
          <CardTitle className="text-sm flex-1">
            {blockType?.label || block.type}
          </CardTitle>
          <div className="flex items-center gap-1">
            {index > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMove(index, "up")}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            {index < totalBlocks - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMove(index, "down")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-4 pt-0 border-t">
          <BlockFields
            block={block}
            onUpdate={(data) => onUpdate({ data })}
          />
        </CardContent>
      )}
    </Card>
  );
}

type BlockFieldsProps = {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
};

function BlockFields({ block, onUpdate }: BlockFieldsProps) {
  const updateField = (key: string, value: unknown) => {
    onUpdate({ ...block.data, [key]: value });
  };

  switch (block.type) {
    case "header":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={(block.data.title as string) || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Page header title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.data.subtitle as string) || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Optional subtitle"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={(block.data.description as string) || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>
        </div>
      );

    case "section":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.data.title as string) || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Section title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.data.subtitle as string) || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Section subtitle"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Border</Label>
              <Select
                value={(block.data.border as string) || "top"}
                onValueChange={(value) => updateField("border", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Spacing</Label>
              <Select
                value={(block.data.spacing as string) || "normal"}
                onValueChange={(value) => updateField("spacing", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tight">Tight</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="loose">Loose</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "grid":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select
                value={String(block.data.cols || 2)}
                onValueChange={(value) => updateField("cols", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                  <SelectItem value="5">5 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gap</Label>
              <Select
                value={(block.data.gap as string) || "medium"}
                onValueChange={(value) => updateField("gap", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Items (one per line)</Label>
            <Textarea
              value={(block.data.items as string) || ""}
              onChange={(e) => updateField("items", e.target.value)}
              placeholder="Grid item 1&#10;Grid item 2&#10;Grid item 3"
              rows={5}
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={(block.data.content as string) || ""}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Text content..."
              rows={8}
            />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={(block.data.title as string) || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Call to action title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.data.subtitle as string) || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Optional subtitle"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={(block.data.description as string) || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={(block.data.buttonText as string) || ""}
              onChange={(e) => updateField("buttonText", e.target.value)}
              placeholder="Learn More"
            />
          </div>
          <div className="space-y-2">
            <Label>Button Link</Label>
            <Input
              value={(block.data.buttonLink as string) || ""}
              onChange={(e) => updateField("buttonLink", e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-sm text-muted-foreground">
          No editor available for this block type
        </div>
      );
  }
}

function getDefaultData(type: ContentBlock["type"]): Record<string, unknown> {
  switch (type) {
    case "header":
      return {
        title: "Page Title",
        subtitle: "",
        description: "",
      };
    case "section":
      return {
        title: "",
        subtitle: "",
        border: "top",
        spacing: "normal",
      };
    case "grid":
      return {
        cols: 2,
        gap: "medium",
        items: "",
      };
    case "text":
      return {
        content: "",
      };
    case "cta":
      return {
        title: "Get in Touch",
        subtitle: "",
        description: "",
        buttonText: "Contact Us",
        buttonLink: "/contact",
      };
    default:
      return {};
  }
}
