import { Metadata } from "next";
import {
  Page,
  Header,
  Content,
  Section,
  Grid,
} from "@/components/web/page-layout";
import { H2, H3, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us",
    description:
      "Get in touch with our jewelry experts. Visit our showroom, call us, or send us a message.",
  };
}

export default async function ContactPage() {
  return (
    <Page>
      <Header
        title="Contact Us"
        subtitle="We're Here to Help"
        description="Whether you have questions about our jewelry, need assistance with a custom design, or want to schedule a consultation, we'd love to hear from you."
      />

      <Content>
        <Section spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H2 className="mb-8">Get in Touch</H2>

              <div className="space-y-8">
                <div>
                  <H3 className="mb-3">Visit Our Showroom</H3>
                  <Text className="mb-2">
                    123 Jewelry District Avenue
                    <br />
                    Suite 456
                    <br />
                    New York, NY 10013
                  </Text>
                  <Text className="text-sm text-foreground/70">
                    By appointment only - please call ahead
                  </Text>
                </div>

                <div>
                  <H3 className="mb-3">Phone & Email</H3>
                  <Text className="mb-2">
                    <strong>Phone:</strong> (555) 123-4567
                    <br />
                    <strong>Email:</strong> hello@jewelryatelier.com
                  </Text>
                  <Text className="text-sm text-foreground/70">
                    Monday - Friday: 10:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </Text>
                </div>

                <div>
                  <H3 className="mb-3">Custom Design Consultations</H3>
                  <Text className="mb-2">
                    <strong>Email:</strong> design@jewelryatelier.com
                    <br />
                    <strong>Phone:</strong> (555) 123-4568
                  </Text>
                  <Text className="text-sm text-foreground/70">
                    Schedule a complimentary consultation with our design team
                  </Text>
                </div>

                <div>
                  <H3 className="mb-3">Customer Service</H3>
                  <Text className="mb-2">
                    <strong>Email:</strong> support@jewelryatelier.com
                    <br />
                    <strong>Phone:</strong> (555) 123-4569
                  </Text>
                  <Text className="text-sm text-foreground/70">
                    For questions about orders, repairs, and general inquiries
                  </Text>
                </div>
              </div>
            </div>

            <div>
              <H2 className="mb-8">Send Us a Message</H2>

              <form className="space-y-6">
                <Grid cols={2} gap="medium">
                  <div>
                    <Label className="block mb-2">First Name *</Label>
                    <Input type="text" required placeholder="Your first name" />
                  </div>
                  <div>
                    <Label className="block mb-2">Last Name *</Label>
                    <Input type="text" required placeholder="Your last name" />
                  </div>
                </Grid>

                <div>
                  <Label className="block mb-2">Email Address *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label className="block mb-2">Phone Number</Label>
                  <Input type="tel" placeholder="(555) 123-4567" />
                </div>

                <div>
                  <Label className="block mb-2">Subject *</Label>
                  <select className="w-full p-3 border border-border rounded-md bg-background">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="custom">Custom Design</option>
                    <option value="repair">Repair Services</option>
                    <option value="appointment">Schedule Appointment</option>
                    <option value="order">Order Status</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label className="block mb-2">Message *</Label>
                  <Textarea
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="resize-none"
                  />
                </div>

                <div>
                  <Text className="text-sm text-foreground/70 mb-4">
                    * Required fields
                  </Text>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
        </Section>

        <Section
          title="Frequently Asked Questions"
          border="top"
          spacing="loose"
        >
          <div className="max-w-3xl mx-auto">
            <Grid cols={1} gap="large">
              <div>
                <H3 className="mb-3">How long does a custom design take?</H3>
                <Text className="mb-6">
                  Custom pieces typically take 4-8 weeks from initial
                  consultation to completion, depending on the complexity of the
                  design and availability of materials. We'll provide a detailed
                  timeline during your consultation.
                </Text>
              </div>

              <div>
                <H3 className="mb-3">Do you offer jewelry repair services?</H3>
                <Text className="mb-6">
                  Yes, we offer comprehensive repair services for all types of
                  jewelry, whether purchased from us or elsewhere. Our master
                  jewelers can handle everything from simple chain repairs to
                  complex restoration work.
                </Text>
              </div>

              <div>
                <H3 className="mb-3">Can I schedule a private appointment?</H3>
                <Text className="mb-6">
                  Absolutely! We offer private consultations by appointment.
                  This allows us to give you our full attention and provide a
                  personalized experience. Please call or email us to schedule
                  your visit.
                </Text>
              </div>

              <div>
                <H3 className="mb-3">Do you offer virtual consultations?</H3>
                <Text>
                  Yes, we offer virtual consultations via video call for clients
                  who cannot visit our showroom in person. We can discuss
                  designs, show pieces, and answer questions remotely. Contact
                  us to schedule a virtual appointment.
                </Text>
              </div>
            </Grid>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
