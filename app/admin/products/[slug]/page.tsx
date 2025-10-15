import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";
import { db } from "@repo/db";
import { AttributesCard } from "./_components/attributes-card";
import { DetailCard } from "./_components/detail-card";
import { MediaCard } from "./_components/media-card";
import { MetadataCard } from "./_components/metadata-card";
import { OrganizeCard } from "./_components/organize-card";
import { PriceCard } from "./_components/price-card";

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
  const { userId, redirectToSignIn } = await auth();

  if (!userId) redirectToSignIn();

  const { slug } = await params;

  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-3 lg:flex-row p-4">
      <div className="w-full space-y-3 lg:w-2/3">
        <DetailCard product={product} />
        <MediaCard product={product} />
        <React.Suspense fallback={<div>Loading...</div>}>
          <PriceCard product={product} />
        </React.Suspense>
      </div>
      <div className="space-y-3 lg:w-1/3">
        <React.Suspense fallback={<div>Loading...</div>}>
          <OrganizeCard product={product} />
        </React.Suspense>
        <MetadataCard product={product} />
        <AttributesCard product={product} />
      </div>
    </div>
  );
}
