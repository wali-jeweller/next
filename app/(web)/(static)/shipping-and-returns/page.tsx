import { Metadata } from "next";
import {
  Page,
  Header,
  Content,
  Section,
  Grid,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/web/page-layout";
import { H3, Text, Subtitle } from "@/components/ui/typography";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shipping & Returns",
    description:
      "Learn about our shipping options, return policy, and exchange procedures for jewelry purchases.",
  };
}

export default async function ShippingPage() {
  return (
    <Page>
      <Header
        title="Shipping & Returns"
        subtitle="Secure Delivery & Hassle-Free Returns"
        description="We ensure your jewelry arrives safely and offer flexible return options for your peace of mind."
      />

      <Content>
        <Section title="Shipping Information" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Domestic Shipping (United States)</H3>
              <Text className="mb-4">
                All domestic orders are shipped via FedEx or UPS with full
                insurance and signature confirmation required. We do not ship to
                P.O. boxes for security reasons.
              </Text>

              <div className="mb-6">
                <Text className="font-medium mb-2">
                  Free Standard Shipping:
                </Text>
                <Text className="mb-4">
                  Complimentary standard shipping (3-5 business days) on all
                  orders over $500.
                </Text>
              </div>

              <div className="mb-6">
                <Text className="font-medium mb-2">Expedited Options:</Text>
                <ul className="space-y-2">
                  <li>
                    <Text>• Express (1-2 business days): $45</Text>
                  </li>
                  <li>
                    <Text>• Overnight: $65</Text>
                  </li>
                  <li>
                    <Text>• Saturday delivery: Additional $25</Text>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <H3 className="mb-4">International Shipping</H3>
              <Text className="mb-4">
                We ship worldwide via FedEx International with full insurance
                and tracking. Delivery times vary by destination, typically 7-14
                business days.
              </Text>

              <div className="mb-6">
                <Text className="font-medium mb-2">Important Notes:</Text>
                <ul className="space-y-2">
                  <li>
                    <Text>
                      • Customs duties and taxes are customer responsibility
                    </Text>
                  </li>
                  <li>
                    <Text>
                      • Some countries have import restrictions on jewelry
                    </Text>
                  </li>
                  <li>
                    <Text>• Additional documentation may be required</Text>
                  </li>
                  <li>
                    <Text>• Shipping costs calculated at checkout</Text>
                  </li>
                </ul>
              </div>

              <Text className="text-sm text-foreground/70">
                Contact us before ordering if you have questions about
                international shipping to your location.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Shipping Rates" border="top" spacing="loose">
          <Table maxWidth="5xl">
            <TableHeader>
              <TableHeaderCell>Order Value</TableHeaderCell>
              <TableHeaderCell>Standard (3-5 days)</TableHeaderCell>
              <TableHeaderCell>Express (1-2 days)</TableHeaderCell>
              <TableHeaderCell>Overnight</TableHeaderCell>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Under $500</TableCell>
                <TableCell>$25</TableCell>
                <TableCell>$45</TableCell>
                <TableCell>$65</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$500 - $2,499</TableCell>
                <TableCell>FREE</TableCell>
                <TableCell>$45</TableCell>
                <TableCell>$65</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$2,500 - $9,999</TableCell>
                <TableCell>FREE</TableCell>
                <TableCell>$35</TableCell>
                <TableCell>$55</TableCell>
              </TableRow>
              <TableRow isLast>
                <TableCell>$10,000+</TableCell>
                <TableCell>FREE</TableCell>
                <TableCell>FREE</TableCell>
                <TableCell>$35</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section title="Processing Time" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">In-Stock Items</H3>
              <Text className="mb-4">
                Most in-stock items ship within 1-2 business days. Orders placed
                before 2:00 PM EST on business days typically ship the same day.
              </Text>
              <Text>
                During peak seasons (holidays, Valentine's Day, etc.),
                processing may take an additional 1-2 business days.
              </Text>
            </div>

            <div>
              <H3 className="mb-4">Custom & Made-to-Order Items</H3>
              <Text className="mb-4">
                Custom pieces and made-to-order items require 4-8 weeks for
                completion, depending on complexity and current production
                schedule.
              </Text>
              <Text>
                We'll provide a detailed timeline during the ordering process
                and keep you updated on progress throughout production.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Return Policy" border="top" spacing="loose">
          <div className="max-w-4xl mx-auto">
            <Subtitle className="mb-8 text-center">
              We want you to be completely satisfied with your purchase
            </Subtitle>

            <Grid cols={1} gap="large">
              <div>
                <H3 className="mb-4">30-Day Return Window</H3>
                <Text className="mb-4">
                  You may return most items within 30 days of delivery for a
                  full refund, provided they are in their original condition.
                  Items must be unworn, undamaged, and returned with all
                  original packaging, certificates, and documentation.
                </Text>
              </div>

              <div>
                <H3 className="mb-4">Items Eligible for Return</H3>
                <ul className="space-y-2 mb-6">
                  <li>
                    <Text>• Ready-to-ship jewelry in original condition</Text>
                  </li>
                  <li>
                    <Text>
                      • Items that don't fit (free size exchange available)
                    </Text>
                  </li>
                  <li>
                    <Text>• Items damaged during shipping</Text>
                  </li>
                  <li>
                    <Text>
                      • Items significantly different from description
                    </Text>
                  </li>
                </ul>
              </div>

              <div>
                <H3 className="mb-4">Items NOT Eligible for Return</H3>
                <ul className="space-y-2 mb-6">
                  <li>
                    <Text>• Custom and personalized jewelry</Text>
                  </li>
                  <li>
                    <Text>• Engraved items (unless due to our error)</Text>
                  </li>
                  <li>
                    <Text>• Items worn or damaged by customer</Text>
                  </li>
                  <li>
                    <Text>• Items returned after 30 days</Text>
                  </li>
                  <li>
                    <Text>• Earrings (for hygiene reasons)</Text>
                  </li>
                </ul>
              </div>
            </Grid>
          </div>
        </Section>

        <Section title="How to Return an Item" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Step-by-Step Process</H3>
              <ol className="space-y-3">
                <li>
                  <Text>
                    <strong>1. Contact Us:</strong> Email
                    support@jewelryatelier.com or call (555) 123-4569 within 30
                    days of delivery.
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>2. Receive Authorization:</strong> We'll provide a
                    Return Authorization (RA) number and prepaid shipping label.
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>3. Package Securely:</strong> Use original packaging
                    when possible. Include all certificates and documentation.
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>4. Ship Insured:</strong> Use our prepaid label or
                    ship via insured carrier with tracking.
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>5. Receive Refund:</strong> Processed within 3-5
                    business days of receiving your return.
                  </Text>
                </li>
              </ol>
            </div>

            <div>
              <H3 className="mb-4">Important Return Guidelines</H3>
              <ul className="space-y-3">
                <li>
                  <Text>• All returns must be authorized before shipping</Text>
                </li>
                <li>
                  <Text>• Items must be returned in original condition</Text>
                </li>
                <li>
                  <Text>• We recommend insured shipping with tracking</Text>
                </li>
                <li>
                  <Text>
                    • Customer is responsible for return shipping costs unless
                    item is defective
                  </Text>
                </li>
                <li>
                  <Text>• Refunds processed to original payment method</Text>
                </li>
                <li>
                  <Text>• Custom items may be subject to restocking fee</Text>
                </li>
              </ul>
            </div>
          </Grid>
        </Section>

        <Section title="Exchanges" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Size Exchanges</H3>
              <Text className="mb-4">
                We offer free size exchanges within 30 days for rings,
                bracelets, and necklaces. The item must be in its original
                condition and the new size must be in stock.
              </Text>
              <Text>
                If the new size requires additional materials or work, you'll be
                charged the difference. If it requires less material, we'll
                refund the difference.
              </Text>
            </div>

            <div>
              <H3 className="mb-4">Style Exchanges</H3>
              <Text className="mb-4">
                Style exchanges are handled as returns and new purchases. You'll
                receive a full refund for the returned item and can place a new
                order for your preferred style.
              </Text>
              <Text>
                This ensures you get exactly what you want while maintaining our
                quality standards and inventory accuracy.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section
          title="Damaged or Defective Items"
          border="top"
          spacing="loose"
        >
          <div className="max-w-3xl mx-auto">
            <H3 className="mb-4">Our Quality Guarantee</H3>
            <Text className="mb-6">
              Every piece is carefully inspected before shipping. However, if
              you receive a damaged or defective item, we'll make it right
              immediately.
            </Text>

            <Grid cols={2} gap="large">
              <div>
                <H3 className="mb-4">Shipping Damage</H3>
                <Text className="mb-4">
                  If your item arrives damaged, contact us immediately with
                  photos of the damage and packaging. We'll arrange for
                  immediate replacement or repair at no cost to you.
                </Text>
              </div>

              <div>
                <H3 className="mb-4">Manufacturing Defects</H3>
                <Text className="mb-4">
                  Items with manufacturing defects are covered under our
                  lifetime warranty. We'll repair or replace the item at no
                  charge, including shipping both ways.
                </Text>
              </div>
            </Grid>
          </div>
        </Section>

        <Section title="Contact Information" border="top" spacing="loose">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-6">
              Questions about shipping or returns?
            </Subtitle>
            <Text className="mb-8">
              Our customer service team is here to help with any questions about
              your order, shipping, or returns.
            </Text>
            <div className="space-y-4">
              <Text>
                <strong>Customer Service:</strong> support@jewelryatelier.com
              </Text>
              <Text>
                <strong>Phone:</strong> (555) 123-4569
              </Text>
              <Text>
                <strong>Hours:</strong> Monday-Friday 9AM-6PM EST, Saturday
                10AM-4PM EST
              </Text>
            </div>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
