"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import { H2 } from "@/components/ui/typography";
import { Page, Section, Grid } from "@/components/web/page-layout";
import { useCart } from "@/components/web/cart-provider";
import { formatPrice } from "@/lib/format-price";
import Image from "next/image";

// Form validation schema
const checkoutSchema = z.object({
  // Contact Information
  email: z.email("Please enter a valid email address"),

  // Shipping Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),

  // Shipping Address
  address: z.string().min(5, "Please enter a complete address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state/province"),
  zipCode: z.string().min(5, "Please enter a valid postal code"),
  country: z.string().min(2, "Please enter your country"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart after successful checkout
      await clearCart();

      // Redirect to success page (you'd implement this)
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = total;
  const shipping = subtotal > 50000 ? 0 : 500; // Free shipping over PKR 50,000
  const tax = Math.round(subtotal * 0.17); // 17% GST
  const finalTotal = subtotal + shipping + tax;

  return (
    <Page>
      {/* Header */}
      <Section className="border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          </div>
          <H2 className="mb-2">Checkout</H2>
          <Text className="text-muted-foreground">
            Complete your order securely below
          </Text>
        </div>
      </Section>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Grid cols={3} gap="large" className="gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <Section className="border rounded-lg p-6">
                <H2 className="text-lg mb-6">Contact Information</H2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email")}
                      className="mt-1"
                    />
                    {errors.email && (
                      <Text className="text-destructive text-sm mt-1">
                        {errors.email.message}
                      </Text>
                    )}
                  </div>
                </div>
              </Section>

              {/* Shipping Information */}
              <Section className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="h-5 w-5 text-primary" />
                  <H2 className="text-lg">Shipping Information</H2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      className="mt-1"
                    />
                    {errors.firstName && (
                      <Text className="text-destructive text-sm mt-1">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      className="mt-1"
                    />
                    {errors.lastName && (
                      <Text className="text-destructive text-sm mt-1">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    {...register("phone")}
                    className="mt-1"
                  />
                  {errors.phone && (
                    <Text className="text-destructive text-sm mt-1">
                      {errors.phone.message}
                    </Text>
                  )}
                </div>

                <div className="mb-4">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Street Name, Area"
                    {...register("address")}
                    className="mt-1"
                  />
                  {errors.address && (
                    <Text className="text-destructive text-sm mt-1">
                      {errors.address.message}
                    </Text>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Lahore"
                      {...register("city")}
                      className="mt-1"
                    />
                    {errors.city && (
                      <Text className="text-destructive text-sm mt-1">
                        {errors.city.message}
                      </Text>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="Punjab"
                      {...register("state")}
                      className="mt-1"
                    />
                    {errors.state && (
                      <Text className="text-destructive text-sm mt-1">
                        {errors.state.message}
                      </Text>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="54000"
                      {...register("zipCode")}
                      className="mt-1"
                    />
                    {errors.zipCode && (
                      <Text className="text-destructive text-sm mt-1">
                        {errors.zipCode.message}
                      </Text>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Pakistan"
                    {...register("country")}
                    className="mt-1"
                  />
                  {errors.country && (
                    <Text className="text-destructive text-sm mt-1">
                      {errors.country.message}
                    </Text>
                  )}
                </div>
              </Section>

              {/* Payment Information */}
              <Section className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <H2 className="text-lg">Payment Information</H2>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <Text className="text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 inline mr-2" />
                    Your payment information is secure and encrypted. We accept
                    cash on delivery only.
                  </Text>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <Text className="text-sm text-green-800 dark:text-green-200">
                    💰 <strong>Cash on Delivery</strong> - Pay when you receive
                    your order at your doorstep.
                  </Text>
                </div>
              </Section>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Section className="border rounded-lg p-6">
                  <H2 className="text-lg mb-6">Order Summary</H2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <Text className="text-xs text-muted-foreground">
                              No Image
                            </Text>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text className="font-medium text-sm truncate">
                            {item.name}
                          </Text>
                          <Text className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </Text>
                        </div>
                        <Text className="font-medium text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </Text>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <Text className="text-sm">Subtotal</Text>
                      <Text className="text-sm font-medium">
                        {formatPrice(subtotal)}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-sm">Shipping</Text>
                      <Text className="text-sm font-medium">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-sm">GST (17%)</Text>
                      <Text className="text-sm font-medium">
                        {formatPrice(tax)}
                      </Text>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <Text className="font-semibold">Total</Text>
                      <Text className="font-semibold">
                        {formatPrice(finalTotal)}
                      </Text>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-6" size="lg">
                    {isSubmitting ? "Processing..." : "Complete Order"}
                  </Button>

                  <Text className="text-xs text-muted-foreground text-center mt-4">
                    By completing your order, you agree to our Terms of Service
                    and Privacy Policy.
                  </Text>
                </Section>
              </div>
            </div>
          </Grid>
        </div>
      </form>
    </Page>
  );
}
