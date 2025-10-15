import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { Page, Header, Section, Grid } from "@/components/web/page-layout";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <Page>
      <Header
        title="All Categories"
        description="Browse our complete collection of jewelry categories"
      />

      <Section className="py-0 pb-8 px-0">
        <Grid cols={5} gap="none">
          {categories.map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              key={category.id}
              prefetch={false}
              className="flex flex-col overflow-hidden gap-2 p-4 border-r border-b hover:bg-muted/20 transition-colors"
            >
              <Image
                src={category.thumbnail ?? "/placeholder.png"}
                alt={category.title}
                width={500}
                height={500}
                className="aspect-square h-full w-full object-cover"
              />
              <div className="text-center text-sm font-medium tracking-wide text-primary/90">
                {category.title}
              </div>
            </Link>
          ))}
        </Grid>
      </Section>
    </Page>
  );
}
