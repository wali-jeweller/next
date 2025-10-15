import { getPageById } from "@/lib/cms-queries";
import { PageEditor } from "./page-editor";
import { notFound } from "next/navigation";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Page</h1>
          <p className="text-muted-foreground">
            Add a new page to your website
          </p>
        </div>
        <PageEditor />
      </div>
    );
  }

  const page = await getPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Page</h1>
        <p className="text-muted-foreground">Make changes to {page.title}</p>
      </div>
      <PageEditor page={page} />
    </div>
  );
}
