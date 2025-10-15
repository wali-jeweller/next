import { auth } from "@clerk/nextjs/server";
import { ProductTable } from "./_components/product-table";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) redirectToSignIn();

  return (
    <div className="space-y-4 p-4">
      <h3>Products</h3>
      <ProductTable />
    </div>
  );
}
