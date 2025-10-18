"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createContentPage,
  updateContentPage,
  updateContentBlocks,
} from "@/lib/content-actions";
import { TContentPage, ContentBlock } from "@/db/schema";
import { ContentBlockEditor } from "./content-block-editor";
import { ContentPreview } from "./content-preview";
import { Save, Eye, Code, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type ContentPageEditorProps = {
  page?: TContentPage;
};

export function ContentPageEditor({ page }: ContentPageEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("editor");
  
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    description: page?.description || "",
    status: page?.status || "draft",
    seoTitle: page?.seoTitle || "",
    seoDescription: page?.seoDescription || "",
    seoKeywords: page?.seoKeywords || "",
    ogImage: page?.ogImage || "",
  });

  const [blocks, setBlocks] = useState<ContentBlock[]>(
    (page?.content as ContentBlock[]) || []
  );

  const handleSaveMetadata = async () => {
    startTransition(async () => {
      try {
        if (page) {
          await updateContentPage({ id: page.id, ...formData });
          toast.success("Metadata updated successfully");
        } else {
          const result = await createContentPage(formData);
          toast.success("Page created successfully");
          if (result.page) {
            router.push(`/admin/store/content/${result.page.id}`);
          }
        }
        router.refresh();
      } catch {
        toast.error("Failed to save page");
      }
    });
  };

  const handleSaveBlocks = async () => {
    if (!page) {
      toast.error("Please save page metadata first");
      return;
    }

    startTransition(async () => {
      try {
        await updateContentBlocks({ id: page.id, content: blocks });
        toast.success("Content updated successfully");
        router.refresh();
      } catch {
        toast.error("Failed to save content");
      }
    });
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-96 border-r overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/store">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button onClick={handleSaveMetadata} disabled={isPending} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>

          <Separator />

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Page title"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Slug *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateSlug}
                  >
                    Generate
                  </Button>
                </div>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="page-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seoTitle: e.target.value })
                  }
                  placeholder="Title for search engines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoDescription: e.target.value,
                    })
                  }
                  placeholder="Description for search engines"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, seoKeywords: e.target.value })
                  }
                  placeholder="keyword1, keyword2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  value={formData.ogImage}
                  onChange={(e) =>
                    setFormData({ ...formData, ogImage: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b p-2 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="editor">
                <Code className="mr-2 h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {page && (
            <Button onClick={handleSaveBlocks} disabled={isPending} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Content
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "editor" ? (
            <ContentBlockEditor
              blocks={blocks}
              onChange={setBlocks}
              disabled={!page}
            />
          ) : (
            <ContentPreview blocks={blocks} title={formData.title} />
          )}
        </div>
      </div>
    </div>
  );
}
