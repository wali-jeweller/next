"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TPage, TPageSection } from "@/db/schema";
import { createSection, updateSection, deleteSection } from "@/lib/cms-actions";
import { Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { SectionEditor } from "./section-editor";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type SectionBuilderProps = {
  page: TPage & { sections: TPageSection[] };
};

export function SectionBuilder({ page }: SectionBuilderProps) {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSection = async (
    type: string,
    content: Record<string, unknown>
  ) => {
    try {
      await createSection({
        pageId: page.id,
        type,
        content,
        order: page.sections.length,
        isVisible: true,
      });
      toast.success("Section added successfully");
      setIsAdding(false);
      router.refresh();
    } catch {
      toast.error("Failed to add section");
    }
  };

  const handleUpdateSection = async (
    id: string,
    data: Record<string, unknown>
  ) => {
    try {
      await updateSection({ id, ...data });
      toast.success("Section updated successfully");
      setEditingSection(null);
      router.refresh();
    } catch {
      toast.error("Failed to update section");
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) {
      return;
    }

    try {
      await deleteSection({ id });
      toast.success("Section deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete section");
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      await updateSection({ id, isVisible: !isVisible });
      toast.success("Section visibility updated");
      router.refresh();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Page Sections</h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>New Section</CardTitle>
          </CardHeader>
          <CardContent>
            <SectionEditor
              onSave={handleAddSection}
              onCancel={() => setIsAdding(false)}
            />
          </CardContent>
        </Card>
      )}

      {page.sections.length === 0 && !isAdding ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No sections yet. Add your first section to start building your
              page.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {page.sections.map((section) => (
            <Card
              key={section.id}
              className={!section.isVisible ? "opacity-60" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <div>
                      <CardTitle className="text-lg">
                        {section.title || `${section.type} Section`}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{section.type}</Badge>
                        <Badge
                          variant={section.isVisible ? "default" : "secondary"}
                        >
                          {section.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleToggleVisibility(section.id, section.isVisible)
                      }
                    >
                      {section.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingSection(
                          editingSection === section.id ? null : section.id
                        )
                      }
                    >
                      {editingSection === section.id ? "Cancel" : "Edit"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {editingSection === section.id && (
                <CardContent className="border-t">
                  <SectionEditor
                    section={section}
                    onSave={(type: string, content: Record<string, unknown>) =>
                      handleUpdateSection(section.id, { type, content })
                    }
                    onCancel={() => setEditingSection(null)}
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
