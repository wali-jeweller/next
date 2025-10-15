import { PaginatedProducts } from "@/components/web/paginated-products";
import { getProducts } from "@/lib/queries";

export default async function ProductsPage() {
  const products = await getProducts();

  return <PaginatedProducts products={products} />;
}
