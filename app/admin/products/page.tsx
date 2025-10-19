import { auth } from "@/lib/auth";
import { ProductTable } from "./_components/product-table";

export default async function Page() {
  const { user, redirectToSignIn } = await auth();

  if (!user) redirectToSignIn();

  return (
    <div className="space-y-4 p-4">
      <h3>Products</h3>
      <ProductTable />
    </div>
  );
}
