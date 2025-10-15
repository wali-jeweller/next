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
    title: "Size Guide",
    description:
      "Find your perfect fit with our comprehensive jewelry sizing guide for rings, bracelets, necklaces, and earrings.",
  };
}

export default async function SizeGuidePage() {
  return (
    <Page>
      <Header
        title="Jewelry Size Guide"
        subtitle="Find Your Perfect Fit"
        description="Accurate sizing ensures your jewelry fits comfortably and looks beautiful. Use our comprehensive guide to determine your ideal size."
      />

      <Content>
        <Section title="Ring Sizing" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">How to Measure Your Ring Size</H3>
              <div className="space-y-4">
                <div>
                  <Text className="font-medium mb-2">Method 1: Ring Sizer</Text>
                  <Text className="mb-4">
                    The most accurate method is using a professional ring sizer.
                    We offer complimentary ring sizers that we can mail to you.
                    Contact us to request one.
                  </Text>
                </div>

                <div>
                  <Text className="font-medium mb-2">
                    Method 2: Existing Ring
                  </Text>
                  <Text className="mb-4">
                    Measure the inside diameter of a ring that fits well on the
                    intended finger. Use our conversion chart below to find your
                    size.
                  </Text>
                </div>

                <div>
                  <Text className="font-medium mb-2">
                    Method 3: String Method
                  </Text>
                  <ol className="space-y-2">
                    <li>
                      <Text>1. Wrap string around your finger snugly</Text>
                    </li>
                    <li>
                      <Text>2. Mark where the string overlaps</Text>
                    </li>
                    <li>
                      <Text>3. Measure the length in millimeters</Text>
                    </li>
                    <li>
                      <Text>4. Use our circumference chart below</Text>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <H3 className="mb-4">Important Sizing Tips</H3>
              <ul className="space-y-3">
                <li>
                  <Text>
                    • Measure at the end of the day when fingers are largest
                  </Text>
                </li>
                <li>
                  <Text>
                    • Consider the width of the band - wider bands fit tighter
                  </Text>
                </li>
                <li>
                  <Text>
                    • Account for knuckle size - the ring must fit over it
                  </Text>
                </li>
                <li>
                  <Text>
                    • Temperature affects finger size - avoid measuring when
                    very cold or hot
                  </Text>
                </li>
                <li>
                  <Text>
                    • Dominant hand fingers are typically 1/4 size larger
                  </Text>
                </li>
                <li>
                  <Text>
                    • When between sizes, choose the larger size for comfort
                  </Text>
                </li>
              </ul>
            </div>
          </Grid>
        </Section>

        <Section title="Ring Size Chart" border="top" spacing="loose">
          <Table maxWidth="6xl">
            <TableHeader>
              <TableHeaderCell>US Size</TableHeaderCell>
              <TableHeaderCell>UK Size</TableHeaderCell>
              <TableHeaderCell>EU Size</TableHeaderCell>
              <TableHeaderCell>Diameter (mm)</TableHeaderCell>
              <TableHeaderCell>Circumference (mm)</TableHeaderCell>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>F</TableCell>
                <TableCell>44</TableCell>
                <TableCell>14.1</TableCell>
                <TableCell>44.2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3.5</TableCell>
                <TableCell>G½</TableCell>
                <TableCell>45</TableCell>
                <TableCell>14.5</TableCell>
                <TableCell>45.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>H½</TableCell>
                <TableCell>46</TableCell>
                <TableCell>14.9</TableCell>
                <TableCell>46.8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4.5</TableCell>
                <TableCell>I½</TableCell>
                <TableCell>47</TableCell>
                <TableCell>15.3</TableCell>
                <TableCell>48.0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell>J½</TableCell>
                <TableCell>49</TableCell>
                <TableCell>15.7</TableCell>
                <TableCell>49.3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5.5</TableCell>
                <TableCell>K½</TableCell>
                <TableCell>50</TableCell>
                <TableCell>16.1</TableCell>
                <TableCell>50.6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6</TableCell>
                <TableCell>L½</TableCell>
                <TableCell>51</TableCell>
                <TableCell>16.5</TableCell>
                <TableCell>51.9</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6.5</TableCell>
                <TableCell>M½</TableCell>
                <TableCell>53</TableCell>
                <TableCell>16.9</TableCell>
                <TableCell>53.1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7</TableCell>
                <TableCell>N½</TableCell>
                <TableCell>54</TableCell>
                <TableCell>17.3</TableCell>
                <TableCell>54.4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7.5</TableCell>
                <TableCell>O½</TableCell>
                <TableCell>55</TableCell>
                <TableCell>17.7</TableCell>
                <TableCell>55.7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>8</TableCell>
                <TableCell>P½</TableCell>
                <TableCell>57</TableCell>
                <TableCell>18.1</TableCell>
                <TableCell>57.0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>8.5</TableCell>
                <TableCell>Q½</TableCell>
                <TableCell>58</TableCell>
                <TableCell>18.5</TableCell>
                <TableCell>58.3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>9</TableCell>
                <TableCell>R½</TableCell>
                <TableCell>59</TableCell>
                <TableCell>18.9</TableCell>
                <TableCell>59.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>9.5</TableCell>
                <TableCell>S½</TableCell>
                <TableCell>60</TableCell>
                <TableCell>19.3</TableCell>
                <TableCell>60.8</TableCell>
              </TableRow>
              <TableRow isLast>
                <TableCell>10</TableCell>
                <TableCell>T½</TableCell>
                <TableCell>62</TableCell>
                <TableCell>19.7</TableCell>
                <TableCell>62.1</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section title="Bracelet Sizing" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">How to Measure Your Wrist</H3>
              <ol className="space-y-3 mb-6">
                <li>
                  <Text>
                    1. Use a flexible measuring tape or string to measure around
                    your wrist bone
                  </Text>
                </li>
                <li>
                  <Text>
                    2. The tape should be snug but not tight - you should be
                    able to slide a finger underneath
                  </Text>
                </li>
                <li>
                  <Text>3. Note the measurement in inches or centimeters</Text>
                </li>
                <li>
                  <Text>
                    4. Add the appropriate amount for your preferred fit (see
                    chart)
                  </Text>
                </li>
              </ol>

              <div>
                <Text className="font-medium mb-2">Fit Preferences:</Text>
                <ul className="space-y-2">
                  <li>
                    <Text>• Snug fit: Add 1/2 inch to wrist measurement</Text>
                  </li>
                  <li>
                    <Text>
                      • Comfortable fit: Add 3/4 inch to wrist measurement
                    </Text>
                  </li>
                  <li>
                    <Text>• Loose fit: Add 1 inch to wrist measurement</Text>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <H3 className="mb-4">Bracelet Size Chart</H3>
              <Table>
                <TableHeader>
                  <TableHeaderCell>Wrist Size</TableHeaderCell>
                  <TableHeaderCell>Bracelet Size</TableHeaderCell>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>5.5" - 6"</TableCell>
                    <TableCell>6.5" - 7"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6" - 6.5"</TableCell>
                    <TableCell>7" - 7.5"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6.5" - 7"</TableCell>
                    <TableCell>7.5" - 8"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>7" - 7.5"</TableCell>
                    <TableCell>8" - 8.5"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>7.5" - 8"</TableCell>
                    <TableCell>8.5" - 9"</TableCell>
                  </TableRow>
                  <TableRow isLast>
                    <TableCell>8" - 8.5"</TableCell>
                    <TableCell>9" - 9.5"</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Grid>
        </Section>

        <Section title="Necklace Sizing" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Necklace Length Guide</H3>
              <ul className="space-y-3">
                <li>
                  <Text>
                    <strong>14" - 16" (Choker):</strong> Sits at the base of the
                    neck, ideal for high necklines
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>16" - 18" (Princess):</strong> Most popular length,
                    sits at the collarbone
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>18" - 20" (Matinee):</strong> Falls just below the
                    collarbone, versatile for most necklines
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>20" - 24" (Opera):</strong> Falls at or below the
                    bust line, elegant for evening wear
                  </Text>
                </li>
                <li>
                  <Text>
                    <strong>24"+ (Rope):</strong> Very long, can be worn as a
                    single strand or doubled
                  </Text>
                </li>
              </ul>
            </div>

            <div>
              <H3 className="mb-4">How to Choose Necklace Length</H3>
              <Text className="mb-4">
                The best necklace length depends on your neck size, body type,
                and personal preference. Here are some guidelines:
              </Text>
              <ul className="space-y-3">
                <li>
                  <Text>
                    • Measure your neck and add 2-4 inches for a comfortable fit
                  </Text>
                </li>
                <li>
                  <Text>
                    • Consider your neckline - higher necklines work with longer
                    chains
                  </Text>
                </li>
                <li>
                  <Text>
                    • Layering multiple lengths creates visual interest
                  </Text>
                </li>
                <li>
                  <Text>
                    • Pendant size affects how the necklace will sit and look
                  </Text>
                </li>
              </ul>
            </div>
          </Grid>
        </Section>

        <Section title="Earring Sizing" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Hoop Earring Sizes</H3>
              <Text className="mb-4">
                Hoop earrings are measured by their inside diameter:
              </Text>
              <ul className="space-y-2">
                <li>
                  <Text>• Small hoops: 10-20mm (subtle, everyday wear)</Text>
                </li>
                <li>
                  <Text>• Medium hoops: 25-40mm (versatile, most popular)</Text>
                </li>
                <li>
                  <Text>• Large hoops: 45-60mm (statement pieces)</Text>
                </li>
                <li>
                  <Text>
                    • Extra large hoops: 65mm+ (dramatic, evening wear)
                  </Text>
                </li>
              </ul>
            </div>

            <div>
              <H3 className="mb-4">Stud Earring Sizes</H3>
              <Text className="mb-4">
                Stud earrings are measured by the diameter of the stone or
                setting:
              </Text>
              <ul className="space-y-2">
                <li>
                  <Text>
                    • 2-3mm: Delicate, perfect for children or subtle look
                  </Text>
                </li>
                <li>
                  <Text>• 4-5mm: Classic size, suitable for everyday wear</Text>
                </li>
                <li>
                  <Text>• 6-7mm: Noticeable but not overwhelming</Text>
                </li>
                <li>
                  <Text>
                    • 8mm+: Statement studs, perfect for special occasions
                  </Text>
                </li>
              </ul>
            </div>
          </Grid>
        </Section>

        <Section
          title="Professional Sizing Services"
          border="top"
          spacing="loose"
        >
          <div className="max-w-4xl mx-auto">
            <Subtitle className="mb-8 text-center">
              When in doubt, let our experts help you find the perfect fit
            </Subtitle>

            <Grid cols={3} gap="large">
              <div className="text-center">
                <H3 className="mb-4">In-Store Sizing</H3>
                <Text>
                  Visit our showroom for professional sizing using calibrated
                  tools. Our experts can help you find the perfect fit for any
                  type of jewelry.
                </Text>
              </div>

              <div className="text-center">
                <H3 className="mb-4">Ring Sizer Kit</H3>
                <Text>
                  We'll mail you a complimentary ring sizer kit with detailed
                  instructions. This is the most accurate way to determine your
                  ring size at home.
                </Text>
              </div>

              <div className="text-center">
                <H3 className="mb-4">Virtual Consultation</H3>
                <Text>
                  Schedule a video consultation where our experts can guide you
                  through the measuring process and answer any sizing questions.
                </Text>
              </div>
            </Grid>
          </div>
        </Section>

        <Section title="Resizing Services" border="top" spacing="loose">
          <Grid cols={2} gap="large">
            <div>
              <H3 className="mb-4">Ring Resizing</H3>
              <Text className="mb-4">
                Most rings can be resized up or down by 1-2 sizes. The process
                typically takes 1-2 weeks and varies in cost depending on the
                metal and complexity.
              </Text>
              <Text>
                Some rings cannot be resized due to their design, such as
                eternity bands or rings with stones all around the band.
              </Text>
            </div>

            <div>
              <H3 className="mb-4">Bracelet & Necklace Adjustments</H3>
              <Text className="mb-4">
                Chain bracelets and necklaces can often be shortened or
                lengthened. We can add or remove links, or adjust the clasp
                position.
              </Text>
              <Text>
                Custom adjustments ensure your jewelry fits perfectly and
                maintains its original design integrity.
              </Text>
            </div>
          </Grid>
        </Section>

        <Section title="Need Help?" border="top" spacing="loose">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-6">Still unsure about sizing?</Subtitle>
            <Text className="mb-8">
              Our jewelry experts are here to help you find the perfect fit.
              Contact us for personalized sizing assistance.
            </Text>
            <div className="space-y-4">
              <Text>
                <strong>Phone:</strong> (555) 123-4567
              </Text>
              <Text>
                <strong>Email:</strong> sizing@jewelryatelier.com
              </Text>
              <Text>
                <strong>Showroom:</strong> By appointment for professional
                sizing
              </Text>
            </div>
          </div>
        </Section>
      </Content>
    </Page>
  );
}
