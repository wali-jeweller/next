import { getContentPageById } from "@/lib/content-queries";
import { ContentPageEditor } from "../_components/content-page-editor";
import { notFound } from "next/navigation";

export default async function EditContentPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getContentPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Edit: {page.title}</h1>
        <p className="text-muted-foreground text-sm">
          Visual content editor with live preview
        </p>
      </div>
      <ContentPageEditor page={page} />
    </div>
  );
}
