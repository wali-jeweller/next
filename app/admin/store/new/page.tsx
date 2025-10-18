import { ContentPageEditor } from "../_components/content-page-editor";

export default async function NewContentPagePage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Create New Page</h1>
        <p className="text-muted-foreground text-sm">
          Build your page with visual blocks
        </p>
      </div>
      <ContentPageEditor />
    </div>
  );
}
