import { notFound } from "next/navigation";
import { db } from "@/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ruler, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const getCategoryData = async (slug: string) => {
  "use cache";
  const category = await db.query.categories.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
  });

  return category;
};

export default async function Page({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const categoryData = await getCategoryData(categorySlug);

  if (!categoryData) notFound();

  return (
    <div className="h-full overflow-y-auto">
      <header className="border-b p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              {categoryData.title} Sizes
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage sizes for this category • {categoryData.sizes?.length || 0}{" "}
              sizes
            </p>
          </div>

          <Button asChild size="sm">
            <Link href={`/sizes/${categorySlug}/new`}>
              <Plus className="w-4 h-4 mr-2" />
              Add Size
            </Link>
          </Button>
        </div>
      </header>

      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Category Info */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {categoryData.thumbnail ? (
                  <Image
                    src={categoryData.thumbnail}
                    alt={categoryData.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {categoryData.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-medium">{categoryData.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {categoryData.description || "No description"}
                </p>
              </div>
            </div>
          </div>

          {/* Sizes Grid */}
          {categoryData.sizes && categoryData.sizes.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium">Current Sizes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryData.sizes.map((size, index) => (
                  <Link
                    key={index}
                    href={`/sizes/${categorySlug}/edit/${index}`}
                    className="group p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {size.value} {size.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click to edit
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Ruler className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No sizes yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first size to get started
              </p>
              <Button asChild>
                <Link href={`/sizes/${categorySlug}/new`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Size
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
