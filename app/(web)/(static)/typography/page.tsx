import { Metadata } from "next";
import {
  Page,
  Header,
  Content,
  Section,
  Grid,
} from "@/components/web/page-layout";
import {
  H1,
  H2,
  H3,
  H4,
  Text,
  Caption,
  Price,
  Label,
  Subtitle,
} from "@/components/ui/typography";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Typography System",
    description:
      "Explore our comprehensive typography system with examples and usage guidelines.",
  };
}

async function Info() {
  "use cache";
  return (
    <div className="text-center">
      <Text className="text-sm text-foreground/70">
        Last Updated: {new Date().toISOString()}
      </Text>
    </div>
  );
}

export default async function TypographyPage() {
  return (
    <Page>
      <Header
        title="Typography System"
        subtitle="Beautiful, Consistent Typography"
        description="Our typography system ensures consistent, readable, and beautiful text across all pages and components."
      />
      <Info />
      <Content>
        <Section title="Headings" spacing="loose">
          <div className="space-y-12">
            <div>
              <Label className="mb-4 block">H1 - Main Page Titles</Label>
              <H1>Crafting Timeless Beauty Since 1985</H1>
              <Text className="mt-4 text-sm text-foreground/70">
                Used for main page titles and hero sections. Large, impactful,
                and designed to grab attention while maintaining elegance.
              </Text>
            </div>

            <div>
              <Label className="mb-4 block">H2 - Section Titles</Label>
              <H2>Our Exquisite Collection</H2>
              <Text className="mt-4 text-sm text-foreground/70">
                Perfect for major section headings and important content
                divisions. Provides clear hierarchy and visual structure.
              </Text>
            </div>

            <div>
              <Label className="mb-4 block">H3 - Subsection Titles</Label>
              <H3>Diamond Engagement Rings</H3>
              <Text className="mt-4 text-sm text-foreground/70">
                Used for subsections, product categories, and content groupings.
                Maintains readability while establishing clear information
                hierarchy.
              </Text>
            </div>

            <div>
              <Label className="mb-4 block">H4 - Minor Headings</Label>
              <H4>Care Instructions</H4>
              <Text className="mt-4 text-sm text-foreground/70">
                For smaller headings, FAQ questions, and detailed content
                organization. Subtle yet distinct from body text.
              </Text>
            </div>
          </div>
        </Section>

        <Section title="Body Text & Content" border="top" spacing="loose">
          <div className="space-y-12">
            <div>
              <Label className="mb-4 block">Text - Primary Body Text</Label>
              <Text>
                Every piece in our collection tells a story of passion,
                precision, and artistry passed down through generations of
                master jewelers. From the initial sketch to the final polish,
                each item undergoes meticulous attention to detail, ensuring
                that every customer receives a masterpiece that will be
                treasured for generations to come.
              </Text>
              <Text className="mt-4 text-sm text-foreground/70">
                Our primary text style for paragraphs, descriptions, and main
                content. Optimized for readability with comfortable line height
                and spacing.
              </Text>
            </div>

            <div>
              <Label className="mb-4 block">Subtitle - Supporting Text</Label>
              <Subtitle>
                Discover the perfect piece that reflects your unique story and
                celebrates life's most precious moments.
              </Subtitle>
              <Text className="mt-4 text-sm text-foreground/70">
                Used for introductory text, supporting descriptions, and content
                that bridges headings and body text. Slightly larger and lighter
                than body text.
              </Text>
            </div>
          </div>
        </Section>

        <Section title="Specialized Typography" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <Label className="mb-4 block">Price - Product Pricing</Label>
              <div className="space-y-4">
                <Price className="text-2xl">$2,450</Price>
                <Price className="text-lg">$850</Price>
                <Price className="text-base">$125</Price>
              </div>
              <Text className="mt-4 text-sm text-foreground/70">
                Monospace font for consistent number alignment. Used for all
                pricing displays, ensuring clarity and professional appearance.
              </Text>
            </div>

            <div>
              <Label className="mb-4 block">Caption - Descriptive Text</Label>
              <div className="space-y-4">
                <Caption>18K White Gold</Caption>
                <Caption>Certified Diamond</Caption>
                <Caption>Handcrafted in NYC</Caption>
              </div>
              <Text className="mt-4 text-sm text-foreground/70">
                Small, uppercase text for product specifications, image
                captions, and supplementary information. Provides context
                without overwhelming.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Labels & Navigation" border="top" spacing="loose">
          <div className="space-y-8">
            <div>
              <Label className="mb-4 block">Label - Form Labels & UI</Label>
              <div className="space-y-3">
                <Label>Product Category</Label>
                <Label>Ring Size</Label>
                <Label>Metal Type</Label>
              </div>
              <Text className="mt-4 text-sm text-foreground/70">
                Uppercase, spaced text for form labels, navigation items, and UI
                elements. Ensures consistency across interactive components.
              </Text>
            </div>
          </div>
        </Section>

        <Section title="Typography in Context" border="top" spacing="loose">
          <div className="space-y-16">
            <div className="border border-border rounded-lg p-8">
              <H2 className="mb-6">Product Showcase Example</H2>
              <Grid cols={2} gap="large">
                <div>
                  <Caption className="mb-2">Featured Collection</Caption>
                  <H3 className="mb-4">Vintage-Inspired Engagement Rings</H3>
                  <Text className="mb-6">
                    Our vintage-inspired collection captures the romance and
                    elegance of bygone eras while incorporating modern
                    craftsmanship techniques. Each ring is carefully designed to
                    honor classic styles while meeting contemporary standards of
                    quality and durability.
                  </Text>
                  <div className="flex items-center gap-4">
                    <Price className="text-xl">Starting at $1,850</Price>
                    <Label>View Collection</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <Subtitle>
                    Timeless designs that celebrate your unique love story
                  </Subtitle>
                  <ul className="space-y-2">
                    <li>
                      <Text>• Ethically sourced diamonds</Text>
                    </li>
                    <li>
                      <Text>• Handcrafted settings</Text>
                    </li>
                    <li>
                      <Text>• Lifetime warranty included</Text>
                    </li>
                    <li>
                      <Text>• Custom sizing available</Text>
                    </li>
                  </ul>
                </div>
              </Grid>
            </div>

            <div className="border border-border rounded-lg p-8">
              <H2 className="mb-6">Article Layout Example</H2>
              <Caption className="mb-2">Jewelry Care Guide</Caption>
              <H3 className="mb-4">How to Clean Your Diamond Jewelry</H3>
              <Subtitle className="mb-6">
                Proper care ensures your diamonds maintain their brilliance for
                generations
              </Subtitle>
              <Text className="mb-6">
                Diamonds are among the hardest natural substances on Earth, but
                they still require proper care to maintain their beauty and
                brilliance. Regular cleaning and maintenance will keep your
                diamond jewelry looking as stunning as the day you first wore
                it.
              </Text>
              <H4 className="mb-4">Daily Care Tips</H4>
              <Text className="mb-4">
                Remove your diamond jewelry before engaging in physical
                activities, applying lotions or perfumes, or doing household
                chores. Store each piece separately in a soft cloth pouch or
                lined jewelry box to prevent scratching.
              </Text>
              <Caption>
                Professional cleaning recommended every 6 months
              </Caption>
            </div>
          </div>
        </Section>

        <Section title="Typography Guidelines" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Best Practices</H3>
              <ul className="space-y-3">
                <li>
                  <Text>
                    • Use heading hierarchy consistently (H1 → H2 → H3 → H4)
                  </Text>
                </li>
                <li>
                  <Text>
                    • Maintain adequate white space between text elements
                  </Text>
                </li>
                <li>
                  <Text>• Use Price component for all monetary values</Text>
                </li>
                <li>
                  <Text>
                    • Apply Caption for metadata and supplementary information
                  </Text>
                </li>
                <li>
                  <Text>
                    • Use Label for form elements and navigation items
                  </Text>
                </li>
                <li>
                  <Text>
                    • Keep line lengths comfortable for reading (45-75
                    characters)
                  </Text>
                </li>
              </ul>
            </div>

            <div>
              <H3 className="mb-4">Accessibility Features</H3>
              <ul className="space-y-3">
                <li>
                  <Text>• High contrast ratios for all text elements</Text>
                </li>
                <li>
                  <Text>• Scalable fonts that work with browser zoom</Text>
                </li>
                <li>
                  <Text>• Semantic HTML structure for screen readers</Text>
                </li>
                <li>
                  <Text>
                    • Consistent focus indicators for keyboard navigation
                  </Text>
                </li>
                <li>
                  <Text>• Responsive text sizing across all devices</Text>
                </li>
                <li>
                  <Text>• Clear visual hierarchy for content organization</Text>
                </li>
              </ul>
            </div>
          </Grid>
        </Section>

        <Section title="Technical Specifications" border="top" spacing="loose">
          <div className="max-w-4xl mx-auto">
            <Grid cols={3} gap="large">
              <div className="text-center">
                <H3 className="mb-4">Font Family</H3>
                <Text>Geist Sans</Text>
                <Text className="text-sm text-foreground/70 mt-2">
                  Modern, clean typeface optimized for digital reading
                </Text>
              </div>

              <div className="text-center">
                <H3 className="mb-4">Responsive Scaling</H3>
                <Text>Mobile → Desktop</Text>
                <Text className="text-sm text-foreground/70 mt-2">
                  Fluid typography that adapts to screen size
                </Text>
              </div>

              <div className="text-center">
                <H3 className="mb-4">Performance</H3>
                <Text>Optimized Loading</Text>
                <Text className="text-sm text-foreground/70 mt-2">
                  Efficient font loading with fallback systems
                </Text>
              </div>
            </Grid>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
