import { Pagination } from "@/components/pagination";
import { getProducts, type ProductsQueryParams } from "@/lib/products-api";

type SearchParams = Record<string, string | string[] | undefined>;

export async function ProductsPagination({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Convert SearchParams to ProductsQueryParams
  const queryParams: ProductsQueryParams = {
    page: Array.isArray(searchParams?.page)
      ? parseInt(searchParams.page[0], 10)
      : parseInt(searchParams?.page || "1", 10),
    per_page: Array.isArray(searchParams?.per_page)
      ? parseInt(searchParams.per_page[0], 10)
      : parseInt(searchParams?.per_page || "24", 10),
    materials: Array.isArray(searchParams?.materials)
      ? searchParams.materials[0]
      : searchParams?.materials,
    genders: Array.isArray(searchParams?.genders)
      ? searchParams.genders[0]
      : searchParams?.genders,
    categories: Array.isArray(searchParams?.categories)
      ? searchParams.categories[0]
      : searchParams?.categories,
    priceMin: searchParams?.priceMin
      ? Number(
          Array.isArray(searchParams.priceMin)
            ? searchParams.priceMin[0]
            : searchParams.priceMin
        )
      : undefined,
    priceMax: searchParams?.priceMax
      ? Number(
          Array.isArray(searchParams.priceMax)
            ? searchParams.priceMax[0]
            : searchParams.priceMax
        )
      : undefined,
    sort: Array.isArray(searchParams?.sort)
      ? searchParams.sort[0]
      : searchParams?.sort,
    collection: Array.isArray(searchParams?.collection)
      ? searchParams.collection[0]
      : searchParams?.collection,
  };

  // Use the getProducts function from lib
  const { totalItems, currentPage, perPage } = await getProducts(queryParams);

  return (
    <Pagination
      totalItems={totalItems}
      perPage={perPage}
      currentPage={currentPage}
      pathname="/products"
      searchParams={searchParams}
    />
  );
}
