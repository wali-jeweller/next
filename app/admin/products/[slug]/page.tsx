import { notFound } from "next/navigation";
import { db } from "@/db";
import { DetailCard } from "./_components/detail-card";
import { auth } from "@/lib/auth";
import { DetailForm } from "./_components/details-form";

const getProduct = async (slug: string) => {
  const product = await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  });
  return product;
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
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-3 lg:flex-row p-4">
      <DetailForm />
      {/* <MediaCard product={product} /> */}
      {/* <PriceCard product={product} /> */}
      <div className="space-y-3 lg:w-1/3">
        {/* <OrganizeCard product={product} /> */}
        {/* <MetadataCard product={product} /> */}
        {/* <AttributesCard product={product} /> */}
      </div>
    </div>
  );
}
