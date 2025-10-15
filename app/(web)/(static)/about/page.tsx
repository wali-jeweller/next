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
    title: "About Us",
    description:
      "Discover our heritage of craftsmanship and commitment to excellence in fine jewelry.",
  };
}

export default async function AboutPage() {
  return (
    <Page>
      <Header
        title="About Us"
        subtitle="Crafting Timeless Beauty Since 1985"
        description="Every piece tells a story of passion, precision, and artistry passed down through generations of master jewelers."
      />

      <Content className="py-0">
        <Section title="Our Story" spacing="loose">
          <Grid cols={2} gap="none">
            <div>
              <Text className="mb-6">
                Founded in 1985 by master jeweler Elena Rodriguez, our atelier
                began as a small workshop in the heart of the jewelry district.
                What started as a passion for creating unique, handcrafted
                pieces has evolved into a renowned destination for discerning
                collectors and those seeking extraordinary jewelry.
              </Text>
              <Text className="mb-6">
                Our commitment to excellence is evident in every piece we
                create. From the initial sketch to the final polish, each item
                undergoes meticulous attention to detail, ensuring that every
                customer receives a masterpiece that will be treasured for
                generations.
              </Text>
            </div>
            <div>
              <Text className="mb-6">
                Today, our team of skilled artisans continues to honor
                traditional techniques while embracing innovative design
                concepts. We source only the finest materials, working with
                ethically sourced gemstones and precious metals to create pieces
                that are not only beautiful but also responsibly made.
              </Text>
              <Text>
                Whether you're celebrating a milestone, expressing your love, or
                treating yourself to something special, we're here to help you
                find or create the perfect piece that reflects your unique
                story.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Our Values" border="top" spacing="loose">
          <Grid cols={3} gap="large">
            <div className="text-center">
              <H3 className="mb-4">Craftsmanship</H3>
              <Text>
                Every piece is meticulously handcrafted by our master artisans,
                ensuring unparalleled quality and attention to detail in every
                creation.
              </Text>
            </div>
            <div className="text-center">
              <H3 className="mb-4">Authenticity</H3>
              <Text>
                We believe in genuine beauty and honest practices, from our
                ethically sourced materials to our transparent pricing and
                lifetime guarantees.
              </Text>
            </div>
            <div className="text-center">
              <H3 className="mb-4">Innovation</H3>
              <Text>
                While honoring traditional techniques, we continuously explore
                new designs and technologies to create contemporary pieces that
                stand the test of time.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="The Atelier Experience" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Custom Design Process</H3>
              <Text className="mb-4">
                Our bespoke service begins with a personal consultation where we
                listen to your vision and understand your story. Our designers
                then create detailed sketches and 3D renderings, allowing you to
                visualize your piece before crafting begins.
              </Text>
              <Text>
                Throughout the creation process, you'll receive regular updates
                and have opportunities to provide feedback, ensuring the final
                piece exceeds your expectations.
              </Text>
            </div>
            <div>
              <H3 className="mb-4">Master Artisans</H3>
              <Text className="mb-4">
                Our team includes certified gemologists, master setters, and
                experienced goldsmiths who have honed their skills over decades.
                Each brings unique expertise and passion to every project.
              </Text>
              <Text>
                We're proud to maintain the highest standards of craftsmanship,
                with many of our artisans having trained in the world's most
                prestigious jewelry capitals.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Sustainability Commitment" border="top" spacing="loose">
          <div className="max-w-3xl mx-auto text-center">
            <Subtitle className="mb-8">
              We believe luxury should never come at the expense of our planet
              or its people.
            </Subtitle>
            <Grid cols={2} gap="large">
              <div>
                <H3 className="mb-4">Ethical Sourcing</H3>
                <Text>
                  All our gemstones and precious metals are sourced from
                  certified suppliers who adhere to strict ethical and
                  environmental standards. We support fair trade practices and
                  work directly with mining communities.
                </Text>
              </div>
              <div>
                <H3 className="mb-4">Eco-Friendly Practices</H3>
                <Text>
                  Our atelier operates with minimal environmental impact, using
                  recycled metals when possible and implementing
                  energy-efficient processes throughout our production cycle.
                </Text>
              </div>
            </Grid>
          </div>
        </Section>

        <Section title="Awards & Recognition" border="top" spacing="loose">
          <div className="max-w-4xl mx-auto">
            <Grid cols={2} gap="large">
              <div>
                <H3 className="mb-4">Industry Recognition</H3>
                <ul className="space-y-2">
                  <li>
                    <Text>• JCK Jewelers' Choice Award Winner (2023)</Text>
                  </li>
                  <li>
                    <Text>• Couture Design Award Finalist (2022, 2023)</Text>
                  </li>
                  <li>
                    <Text>• American Gem Society Certified Dealer</Text>
                  </li>
                  <li>
                    <Text>• Responsible Jewellery Council Member</Text>
                  </li>
                </ul>
              </div>
              <div>
                <H3 className="mb-4">Media Features</H3>
                <ul className="space-y-2">
                  <li>
                    <Text>
                      • Featured in Vogue's "Best Jewelry Ateliers" (2023)
                    </Text>
                  </li>
                  <li>
                    <Text>
                      • Town & Country "Rising Stars in Jewelry" (2022)
                    </Text>
                  </li>
                  <li>
                    <Text>• Harper's Bazaar "Artisan Spotlight" (2021)</Text>
                  </li>
                  <li>
                    <Text>• JCK Magazine "Designer to Watch" (2020)</Text>
                  </li>
                </ul>
              </div>
            </Grid>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
