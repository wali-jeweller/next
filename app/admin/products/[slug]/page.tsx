import { notFound } from "next/navigation";
import { db } from "@/db";
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
    <div>
      <DetailForm />
    </div>
  );
}
