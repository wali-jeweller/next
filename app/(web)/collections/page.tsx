import { H3, Text } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/queries";
import { Page, Header, Section, Grid } from "@/components/web/page-layout";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <Page>
      <Header
        title="Curated Collections"
        subtitle="Discover our handpicked jewelry collections"
        description="Each collection tells a unique story, carefully curated to inspire and delight."
      />

      <Section spacing="normal" border="none">
        {collections.length > 0 ? (
          <Grid cols={3} gap="small" className="max-w-7xl mx-auto">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
              >
                <div className="group cursor-pointer">
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden border border-border/50">
                    <Image
                      src={collection.thumbnail || "/placeholder.png"}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <H3 className="font-medium transition-colors group-hover:text-foreground">
                      {collection.title}
                    </H3>
                    <Text className="line-clamp-2 text-sm text-muted-foreground group-hover:text-foreground/80">
                      {collection.description}
                    </Text>
                  </div>
                </div>
              </Link>
            ))}
          </Grid>
        ) : (
          <div className="text-center py-16">
            <Text className="text-muted-foreground">
              No collections available at the moment.
            </Text>
          </div>
        )}
      </Section>
    </Page>
  );
}
