import { Metadata } from "next";
import {
  Page,
  Header,
  Content,
  Section,
  Grid,
} from "@/components/web/page-layout";
import { H3, Text, Subtitle } from "@/components/ui/typography";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Jewelry Care Guide",
    description:
      "Learn how to properly care for and maintain your precious jewelry to keep it beautiful for generations.",
  };
}

export default async function CarePage() {
  return (
    <Page>
      <Header
        title="Jewelry Care Guide"
        subtitle="Preserving Beauty for Generations"
        description="Proper care ensures your precious jewelry maintains its brilliance and beauty for years to come. Follow our expert guidelines to protect your investment."
      />

      <Content>
        <Section title="General Care Guidelines" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Daily Care</H3>
              <ul className="space-y-3">
                <li>
                  <Text>
                    • Remove jewelry before showering, swimming, or exercising
                  </Text>
                </li>
                <li>
                  <Text>
                    • Apply perfumes, lotions, and cosmetics before putting on
                    jewelry
                  </Text>
                </li>
                <li>
                  <Text>• Store pieces separately to prevent scratching</Text>
                </li>
                <li>
                  <Text>• Clean regularly with appropriate methods</Text>
                </li>
                <li>
                  <Text>• Inspect clasps and settings periodically</Text>
                </li>
              </ul>
            </div>
            <div>
              <H3 className="mb-4">What to Avoid</H3>
              <ul className="space-y-3">
                <li>
                  <Text>• Harsh chemicals and cleaning products</Text>
                </li>
                <li>
                  <Text>• Extreme temperatures</Text>
                </li>
                <li>
                  <Text>• Impact and rough handling</Text>
                </li>
                <li>
                  <Text>• Storing different metals together</Text>
                </li>
                <li>
                  <Text>• Wearing during physical activities</Text>
                </li>
              </ul>
            </div>
          </Grid>
        </Section>

        <Section title="Care by Metal Type" border="top" spacing="loose">
          <Grid cols={1} gap="large">
            <div>
              <H3 className="mb-4">Gold Jewelry</H3>
              <Grid cols={2} gap="medium">
                <div>
                  <Text className="mb-4">
                    <strong>Cleaning:</strong> Use warm soapy water and a soft
                    brush. For deeper cleaning, use a jewelry cleaning solution
                    specifically designed for gold.
                  </Text>
                  <Text className="mb-4">
                    <strong>Storage:</strong> Store in individual soft pouches
                    or lined jewelry boxes to prevent scratching.
                  </Text>
                </div>
                <div>
                  <Text className="mb-4">
                    <strong>Special Notes:</strong> Higher karat gold (18k, 22k)
                    is softer and requires more gentle handling. White gold may
                    need periodic re-rhodium plating.
                  </Text>
                  <Text>
                    <strong>Professional Care:</strong> Have settings checked
                    annually and consider professional cleaning every 6 months.
                  </Text>
                </div>
              </Grid>
            </div>

            <div>
              <H3 className="mb-4">Silver Jewelry</H3>
              <Grid cols={2} gap="medium">
                <div>
                  <Text className="mb-4">
                    <strong>Cleaning:</strong> Use a silver polishing cloth for
                    light tarnish. For heavier tarnish, use silver cleaning
                    solution or paste.
                  </Text>
                  <Text className="mb-4">
                    <strong>Tarnish Prevention:</strong> Store in anti-tarnish
                    pouches or with anti-tarnish strips in airtight containers.
                  </Text>
                </div>
                <div>
                  <Text className="mb-4">
                    <strong>Special Notes:</strong> Sterling silver naturally
                    tarnishes when exposed to air and moisture. Regular wear
                    actually helps prevent tarnishing.
                  </Text>
                  <Text>
                    <strong>Avoid:</strong> Rubber, latex, and sulfur-containing
                    materials that accelerate tarnishing.
                  </Text>
                </div>
              </Grid>
            </div>

            <div>
              <H3 className="mb-4">Platinum Jewelry</H3>
              <Grid cols={2} gap="medium">
                <div>
                  <Text className="mb-4">
                    <strong>Cleaning:</strong> Soak in warm soapy water and
                    gently scrub with a soft brush. Platinum is durable and can
                    handle regular cleaning.
                  </Text>
                  <Text className="mb-4">
                    <strong>Maintenance:</strong> Platinum develops a natural
                    patina over time, which many prefer for its vintage look.
                  </Text>
                </div>
                <div>
                  <Text className="mb-4">
                    <strong>Professional Care:</strong> If you prefer the
                    original high polish, have it professionally polished
                    annually.
                  </Text>
                  <Text>
                    <strong>Durability:</strong> Platinum is extremely durable
                    and hypoallergenic, making it ideal for everyday wear.
                  </Text>
                </div>
              </Grid>
            </div>
          </Grid>
        </Section>

        <Section title="Gemstone Care" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Diamonds</H3>
              <Text className="mb-4">
                <strong>Cleaning:</strong> Diamonds are durable and can be
                cleaned with warm soapy water and a soft brush. Ultrasonic
                cleaners are generally safe for diamonds.
              </Text>
              <Text className="mb-4">
                <strong>Care Tips:</strong> Despite their hardness, diamonds can
                chip if struck at the right angle. Avoid wearing during heavy
                physical activity.
              </Text>
              <Text>
                <strong>Professional Care:</strong> Have settings inspected
                regularly as diamonds can loosen over time with wear.
              </Text>
            </div>

            <div>
              <H3 className="mb-4">Colored Gemstones</H3>
              <Text className="mb-4">
                <strong>Emeralds:</strong> Very delicate. Clean only with warm
                soapy water and avoid ultrasonic cleaners. Store separately to
                prevent scratching.
              </Text>
              <Text className="mb-4">
                <strong>Sapphires & Rubies:</strong> Durable stones that can be
                cleaned with warm soapy water. Ultrasonic cleaning is generally
                safe.
              </Text>
              <Text>
                <strong>Pearls:</strong> Extremely delicate. Clean only with a
                damp cloth. Store separately and restring periodically if worn
                frequently.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Storage Solutions" border="top" spacing="loose">
          <div className="max-w-4xl mx-auto">
            <Grid cols={3} gap="large">
              <div className="text-center">
                <H3 className="mb-4">Jewelry Boxes</H3>
                <Text>
                  Use lined compartments to separate pieces. Soft fabric lining
                  prevents scratching and tarnishing.
                </Text>
              </div>
              <div className="text-center">
                <H3 className="mb-4">Individual Pouches</H3>
                <Text>
                  Soft cloth or anti-tarnish pouches are ideal for storing
                  pieces separately, especially when traveling.
                </Text>
              </div>
              <div className="text-center">
                <H3 className="mb-4">Climate Control</H3>
                <Text>
                  Store in a cool, dry place away from direct sunlight. Consider
                  using silica gel packets to control moisture.
                </Text>
              </div>
            </Grid>
          </div>
        </Section>

        <Section title="Professional Services" border="top" spacing="loose">
          <div className="max-w-3xl mx-auto">
            <Subtitle className="mb-8 text-center">
              Regular professional maintenance ensures your jewelry remains in
              pristine condition
            </Subtitle>

            <Grid cols={2} gap="large">
              <div>
                <H3 className="mb-4">Recommended Schedule</H3>
                <ul className="space-y-3">
                  <li>
                    <Text>
                      <strong>Every 6 months:</strong> Professional cleaning and
                      inspection
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <strong>Annually:</strong> Comprehensive check of settings
                      and clasps
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <strong>As needed:</strong> Repairs, resizing, and
                      restoration
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <strong>Pearl jewelry:</strong> Restringing every 2-3
                      years if worn regularly
                    </Text>
                  </li>
                </ul>
              </div>
              <div>
                <H3 className="mb-4">Services We Offer</H3>
                <ul className="space-y-3">
                  <li>
                    <Text>• Professional ultrasonic cleaning</Text>
                  </li>
                  <li>
                    <Text>• Prong tightening and setting repair</Text>
                  </li>
                  <li>
                    <Text>• Chain and clasp repair</Text>
                  </li>
                  <li>
                    <Text>• Rhodium re-plating for white gold</Text>
                  </li>
                  <li>
                    <Text>• Pearl restringing</Text>
                  </li>
                  <li>
                    <Text>• Polishing and refinishing</Text>
                  </li>
                </ul>
              </div>
            </Grid>
          </div>
        </Section>

        <Section title="Emergency Care" border="top" spacing="loose">
          <div className="max-w-3xl mx-auto">
            <Grid cols={1} gap="large">
              <div>
                <H3 className="mb-4">If Your Jewelry Gets Damaged</H3>
                <Text className="mb-4">
                  <strong>Don't panic:</strong> Most jewelry damage can be
                  repaired by skilled professionals. Avoid attempting DIY
                  repairs as this can often make the damage worse.
                </Text>
                <Text className="mb-4">
                  <strong>Collect all pieces:</strong> If stones fall out or
                  pieces break, carefully collect all components and bring them
                  to us for assessment.
                </Text>
                <Text>
                  <strong>Contact us immediately:</strong> The sooner we can
                  assess and begin repairs, the better the outcome. We offer
                  emergency repair services for urgent situations.
                </Text>
              </div>
            </Grid>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
