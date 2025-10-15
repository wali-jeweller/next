import { Metadata } from "next";
import {
  Page,
  Header,
  Content,
  Section,
  Grid,
} from "@/components/web/page-layout";
import { H2, H3, Text, Caption, Subtitle } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description:
      "Explore our latest articles, insights, and stories about jewelry, fashion, and timeless elegance.",
  };
}

export default async function BlogPage() {
  return (
    <Page>
      <Header
        title="Our Blog"
        subtitle="Stories, Insights & Inspiration"
        description="Discover the world of fine jewelry through our curated articles, expert insights, and behind-the-scenes stories from our atelier."
      />

      <Content>
        <Section title="Featured Articles" spacing="loose">
          <Grid cols={1} gap="large">
            <article className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-8">
                <Caption className="mb-2">Featured Story</Caption>
                <H2 className="mb-4">
                  The Art of Diamond Setting: A Master's Perspective
                </H2>
                <Subtitle className="mb-6">
                  Go behind the scenes with our master setter as he shares the
                  intricate process of creating the perfect diamond setting.
                </Subtitle>
                <Text className="mb-6">
                  For over three decades, Master Setter Giovanni Rossi has been
                  perfecting the delicate art of diamond setting at our atelier.
                  In this exclusive interview, he shares his insights into the
                  precision, patience, and passion required to create settings
                  that showcase each diamond's unique beauty while ensuring
                  lasting security and elegance.
                </Text>
                <div className="flex items-center justify-between">
                  <Caption>December 15, 2024 • 8 min read</Caption>
                  <Button variant="outline">Read More</Button>
                </div>
              </div>
            </article>
          </Grid>
        </Section>

        <Section title="Latest Articles" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <article className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <Caption className="mb-2">Jewelry Care</Caption>
                <H3 className="mb-3">
                  Winter Jewelry Care: Protecting Your Pieces in Cold Weather
                </H3>
                <Text className="mb-4">
                  Cold weather can affect your jewelry in unexpected ways. Learn
                  how to protect your precious pieces during the winter months
                  and keep them looking their best.
                </Text>
                <div className="flex items-center justify-between">
                  <Caption>December 10, 2024</Caption>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </article>

            <article className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <Caption className="mb-2">Trends</Caption>
                <H3 className="mb-3">
                  2025 Jewelry Trends: What's Coming Next Year
                </H3>
                <Text className="mb-4">
                  From vintage-inspired designs to sustainable materials,
                  discover the jewelry trends that will define 2025 and how to
                  incorporate them into your collection.
                </Text>
                <div className="flex items-center justify-between">
                  <Caption>December 8, 2024</Caption>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </article>

            <article className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <Caption className="mb-2">Education</Caption>
                <H3 className="mb-3">
                  Understanding Diamond Cuts: A Complete Guide
                </H3>
                <Text className="mb-4">
                  The cut of a diamond affects its brilliance more than any
                  other factor. Learn about different cuts and how to choose the
                  perfect one for your needs.
                </Text>
                <div className="flex items-center justify-between">
                  <Caption>December 5, 2024</Caption>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </article>

            <article className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <Caption className="mb-2">Behind the Scenes</Caption>
                <H3 className="mb-3">
                  From Sketch to Sparkle: The Custom Design Process
                </H3>
                <Text className="mb-4">
                  Follow the journey of a custom engagement ring from initial
                  concept to final creation, showcasing the artistry and
                  precision involved in bespoke jewelry.
                </Text>
                <div className="flex items-center justify-between">
                  <Caption>December 1, 2024</Caption>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </article>

            <article className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <Caption className="mb-2">Sustainability</Caption>
                <H3 className="mb-3">
                  Ethical Sourcing: Our Commitment to Responsible Jewelry
                </H3>
                <Text className="mb-4">
                  Learn about our ethical sourcing practices and how we ensure
                  every piece in our collection meets the highest standards of
                  social and environmental responsibility.
                </Text>
                <div className="flex items-center justify-between">
                  <Caption>November 28, 2024</Caption>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </article>

            <article className="border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <div className="p-6">
                <Caption className="mb-2">Style Guide</Caption>
                <H3 className="mb-3">
                  Layering Necklaces: A Modern Approach to Classic Elegance
                </H3>
                <Text className="mb-4">
                  Master the art of layering necklaces with our expert tips and
                  styling suggestions. Create stunning combinations that reflect
                  your personal style.
                </Text>
                <div className="flex items-center justify-between">
                  <Caption>November 25, 2024</Caption>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </div>
            </article>
          </Grid>
        </Section>

        <Section title="Categories" border="top" spacing="loose">
          <Grid cols={4} gap="medium">
            <div className="text-center p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <H3 className="mb-2">Education</H3>
              <Text className="text-sm">12 Articles</Text>
            </div>
            <div className="text-center p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <H3 className="mb-2">Care & Maintenance</H3>
              <Text className="text-sm">8 Articles</Text>
            </div>
            <div className="text-center p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <H3 className="mb-2">Trends & Style</H3>
              <Text className="text-sm">15 Articles</Text>
            </div>
            <div className="text-center p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <H3 className="mb-2">Behind the Scenes</H3>
              <Text className="text-sm">6 Articles</Text>
            </div>
          </Grid>
        </Section>

        <Section title="Newsletter" border="top" spacing="loose">
          <div className="max-w-2xl mx-auto text-center">
            <H2 className="mb-4">Stay Updated</H2>
            <Subtitle className="mb-8">
              Subscribe to our newsletter for the latest articles, jewelry care
              tips, and exclusive insights from our master craftsmen.
            </Subtitle>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-md bg-background"
              />
              <Button>Subscribe</Button>
            </div>
            <Text className="text-sm text-foreground/70 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </Text>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
