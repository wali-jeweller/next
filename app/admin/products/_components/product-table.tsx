import { DataTable, type FilterConfig } from "@/components/admin/data-table";
import { db } from "@/db";
import { columns } from "./columns";
import { CreateProduct } from "./create-product";

const getProducts = async () => {
  "use cache";
  return db.query.products.findMany({
    with: {
      category: true,
      collectionProducts: {
        with: {
          collection: true,
        },
      },
    },
  });
};

const getCategories = async () => {
  "use cache";
  return db.query.categories.findMany();
};

export type ProductsWithRelations = Awaited<ReturnType<typeof getProducts>>;

export async function ProductTable() {
  const [productsData, categoriesList] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filters: FilterConfig[] = [
    {
      columnKey: "categoryId",
      title: "Category",
      options: [
        { label: "No Category", value: "none" },
        ...categoriesList.map((category) => ({
          label: category.title,
          value: category.id,
        })),
      ],
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={productsData}
      filterColumn="title"
      filters={filters}
    >
      <CreateProduct categories={categoriesList} />
    </DataTable>
  );
}
