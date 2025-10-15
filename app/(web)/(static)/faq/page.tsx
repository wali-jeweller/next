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
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about our jewelry, services, policies, and more.",
  };
}

export default async function FaqPage() {
  return (
    <Page>
      <Header
        title="Frequently Asked Questions"
        subtitle="Find Answers to Common Questions"
        description="Everything you need to know about our jewelry, policies, and services."
      />

      <Content>
        <Section title="Orders & Shipping" spacing="loose">
          <Grid cols={1} gap="large">
            <div>
              <H3 className="mb-3">How long does shipping take?</H3>
              <Text className="mb-6">
                Standard shipping within the US takes 3-5 business days. Express
                shipping (1-2 business days) and overnight shipping are also
                available. International shipping times vary by destination,
                typically 7-14 business days. All orders are fully insured and
                require signature confirmation.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Do you offer free shipping?</H3>
              <Text className="mb-6">
                Yes! We offer complimentary standard shipping on all orders over
                $500 within the United States. For orders under $500, standard
                shipping is $25. Express and overnight shipping rates vary based
                on the value and destination of your order.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Can I track my order?</H3>
              <Text className="mb-6">
                Absolutely. Once your order ships, you'll receive a tracking
                number via email. You can also log into your account on our
                website to view your order status and tracking information at
                any time.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Do you ship internationally?</H3>
              <Text className="mb-6">
                Yes, we ship to most countries worldwide. International shipping
                costs and delivery times vary by destination. Please note that
                international customers are responsible for any customs duties,
                taxes, or fees imposed by their country. We recommend checking
                with your local customs office for specific requirements.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Returns & Exchanges" border="top" spacing="loose">
          <Grid cols={1} gap="large">
            <div>
              <H3 className="mb-3">What is your return policy?</H3>
              <Text className="mb-6">
                We offer a 30-day return policy for most items in their original
                condition. Items must be unworn, undamaged, and returned with
                all original packaging and documentation. Custom and
                personalized pieces are final sale unless there's a
                manufacturing defect.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">How do I return an item?</H3>
              <Text className="mb-6">
                Contact our customer service team at support@jewelryatelier.com
                or call (555) 123-4569 to initiate a return. We'll provide you
                with a prepaid return label and detailed instructions. All
                returns must be shipped via insured mail with tracking.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">
                Can I exchange an item for a different size?
              </H3>
              <Text className="mb-6">
                Yes, we offer free exchanges for different sizes within 30 days
                of purchase, provided the item is in its original condition. For
                rings, we recommend using our size guide or visiting our
                showroom for professional sizing before ordering.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">How long do refunds take?</H3>
              <Text className="mb-6">
                Once we receive and inspect your returned item, refunds are
                processed within 3-5 business days. The refund will be credited
                to your original payment method. Please allow additional time
                for your bank or credit card company to process the refund.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Custom Design & Services" border="top" spacing="loose">
          <Grid cols={1} gap="large">
            <div>
              <H3 className="mb-3">How does the custom design process work?</H3>
              <Text className="mb-6">
                Our custom design process begins with a consultation where we
                discuss your vision, budget, and timeline. Our designers create
                sketches and 3D renderings for your approval. Once approved, our
                master craftsmen begin creating your piece. The entire process
                typically takes 4-8 weeks, depending on complexity.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">What does a custom piece cost?</H3>
              <Text className="mb-6">
                Custom piece pricing varies greatly depending on materials,
                complexity, and size. We provide detailed quotes after your
                initial consultation. Our custom pieces typically start around
                $2,000 and can range significantly higher for elaborate designs
                with premium materials.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Can you work with my existing jewelry?</H3>
              <Text className="mb-6">
                Yes! We can redesign, reset, or incorporate your existing
                jewelry into new pieces. This is a wonderful way to update
                heirloom pieces or combine multiple items into something new.
                We'll assess your pieces during a consultation and discuss
                options.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Do you offer jewelry repair services?</H3>
              <Text className="mb-6">
                We provide comprehensive repair services for all types of
                jewelry, whether purchased from us or elsewhere. Services
                include prong repair, chain repair, stone replacement, resizing,
                and restoration. Contact us for a repair estimate.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Product Information" border="top" spacing="loose">
          <Grid cols={1} gap="large">
            <div>
              <H3 className="mb-3">Are your diamonds certified?</H3>
              <Text className="mb-6">
                Yes, all our diamonds 0.50 carats and above come with
                certification from reputable grading laboratories such as GIA,
                AGS, or Gübelin. Smaller diamonds are carefully selected and
                graded by our certified gemologists according to the same strict
                standards.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Do you use ethically sourced materials?</H3>
              <Text className="mb-6">
                Absolutely. We are committed to ethical sourcing and are members
                of the Responsible Jewellery Council. All our diamonds are
                conflict-free, and we work with suppliers who adhere to strict
                ethical and environmental standards. We can provide
                documentation of our sourcing practices upon request.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">What metals do you work with?</H3>
              <Text className="mb-6">
                We work with a variety of precious metals including 14k, 18k,
                and 22k gold (yellow, white, and rose), platinum, and sterling
                silver. We can also work with alternative metals like palladium
                upon request. All our metals are recycled when possible.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">How do I determine my ring size?</H3>
              <Text className="mb-6">
                We recommend visiting our showroom for professional sizing,
                which is the most accurate method. We also offer a complimentary
                ring sizer that we can mail to you, or you can use our online
                size guide. Keep in mind that finger size can vary throughout
                the day and with temperature changes.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Care & Maintenance" border="top" spacing="loose">
          <Grid cols={1} gap="large">
            <div>
              <H3 className="mb-3">How should I care for my jewelry?</H3>
              <Text className="mb-6">
                Proper care varies by material, but general guidelines include
                storing pieces separately, avoiding harsh chemicals, and regular
                cleaning with appropriate methods. We provide detailed care
                instructions with every purchase and offer professional cleaning
                services. Visit our Care Guide for comprehensive information.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">
                How often should I have my jewelry professionally cleaned?
              </H3>
              <Text className="mb-6">
                We recommend professional cleaning and inspection every 6 months
                for frequently worn pieces. This helps maintain their beauty and
                allows us to check for any potential issues like loose stones or
                worn prongs before they become problems.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Do you offer warranties?</H3>
              <Text className="mb-6">
                Yes, all our jewelry comes with a lifetime warranty against
                manufacturing defects. This covers issues like faulty clasps,
                loose settings, or structural problems that occur under normal
                wear. The warranty does not cover damage from accidents, normal
                wear and tear, or improper care.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">What if a stone falls out of my jewelry?</H3>
              <Text className="mb-6">
                If you purchased the piece from us, stone replacement is covered
                under our warranty if it's due to a setting defect. If the stone
                is lost due to damage or normal wear, we can replace it for the
                cost of the stone plus a small setting fee. We recommend annual
                inspections to prevent stone loss.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Payment & Financing" border="top" spacing="loose">
          <Grid cols={1} gap="large">
            <div>
              <H3 className="mb-3">What payment methods do you accept?</H3>
              <Text className="mb-6">
                We accept all major credit cards (Visa, MasterCard, American
                Express, Discover), PayPal, Apple Pay, and bank wire transfers.
                For custom pieces or high-value purchases, we also accept
                payment plans with approved credit.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Do you offer financing options?</H3>
              <Text className="mb-6">
                Yes, we partner with several financing companies to offer
                flexible payment options. We offer 0% interest financing for
                qualified customers on purchases over $1,000. Contact us to
                learn more about available financing options and to apply.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">Is my payment information secure?</H3>
              <Text className="mb-6">
                Absolutely. Our website uses SSL encryption and is PCI DSS
                compliant. We never store your complete credit card information
                on our servers. All transactions are processed through secure,
                encrypted connections with our payment processors.
              </Text>
            </div>

            <div>
              <H3 className="mb-3">
                Can I put a deposit down on a custom piece?
              </H3>
              <Text className="mb-6">
                Yes, we typically require a 50% deposit to begin work on custom
                pieces, with the balance due upon completion. This deposit
                secures your place in our production schedule and covers initial
                materials and design work.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Still Have Questions?" border="top" spacing="loose">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-6">
              Can't find the answer you're looking for?
            </Subtitle>
            <Text className="mb-8">
              Our knowledgeable team is here to help. Contact us by phone,
              email, or visit our showroom for personalized assistance.
            </Text>
            <div className="space-y-4">
              <Text>
                <strong>Phone:</strong> (555) 123-4567
              </Text>
              <Text>
                <strong>Email:</strong> hello@jewelryatelier.com
              </Text>
              <Text>
                <strong>Hours:</strong> Monday-Friday 10AM-6PM, Saturday
                10AM-4PM
              </Text>
            </div>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
