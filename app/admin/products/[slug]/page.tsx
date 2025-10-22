import { notFound } from "next/navigation";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { ProductForm } from "./_components/product-form";
import { ProductPageHeader } from "./_components/header";

const getProduct = async (slug: string) => {
  "use cache";
  return await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  });
};

const getCategories = async () => {
  "use cache";
  return await db.query.categories.findMany();
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { user, redirectToSignIn } = await auth();

  if (!user) redirectToSignIn();

  const { slug } = await params;

  const product = await getProduct(slug);
  const categories = await getCategories();
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-2">
      <ProductPageHeader product={product} />
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
