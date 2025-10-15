import { StoreSidebar } from "./sidebar";

export default function StorePage() {
  return (
    <div className="flex h-screen">
      <StoreSidebar />
      <main className="flex-1 p-6">store</main>
    </div>
  );
}
