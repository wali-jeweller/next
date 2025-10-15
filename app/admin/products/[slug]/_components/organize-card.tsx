import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@repo/db";
import type { TProduct } from "@repo/db/schema";
import { AssignCategory } from "./assign-category";
import { AssignCollection } from "./assign-collection";
import { AssignGender } from "./assign-gender";
import { AssignMaterial } from "./assign-material";

async function getData() {
  const [collections, categories] = await Promise.all([
    db.query.collections.findMany(),
    db.query.categories.findMany(),
  ]);
  return { collections, categories };
}

export async function OrganizeCard({ product }: { product: TProduct }) {
  const { collections, categories } = await getData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organize</CardTitle>
        <CardDescription>Manage product organization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 border-t pt-4">
        <AssignMaterial product={product} />
        <AssignGender product={product} />
        <AssignCategory categories={categories} product={product} />
        <AssignCollection collections={collections} product={product} />
      </CardContent>
    </Card>
  );
}
