"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Clock, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Text, H1 } from "@/components/ui/typography";
import { Page, Section } from "@/components/web/page-layout";
import { useCart } from "@/components/web/cart-provider";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { itemCount } = useCart();

  // Redirect if user somehow reaches this page without completing checkout
  useEffect(() => {
    if (itemCount > 0) {
      router.push("/");
    }
  }, [itemCount, router]);

  return (
    <Page>
      <Section className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <H1 className="mb-4">Order Confirmed!</H1>
          <Text className="text-lg text-muted-foreground mb-8">
            Thank you for your order. We&apos;ve received your details and will
            process your order shortly.
          </Text>

          {/* Order Details */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <Text className="font-medium">Order Status</Text>
                  <Text className="text-sm text-muted-foreground">
                    Your order has been confirmed and is being prepared
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <Text className="font-medium">Delivery Time</Text>
                  <Text className="text-sm text-muted-foreground">
                    3-5 business days for delivery within Lahore
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <H1 className="text-xl mb-4">What&apos;s Next?</H1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-background border rounded-lg p-4">
                <Text className="font-medium mb-2">📧 Order Confirmation</Text>
                <Text className="text-sm text-muted-foreground">
                  You&apos;ll receive an email confirmation with your order
                  details and tracking information.
                </Text>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <Text className="font-medium mb-2">📦 Order Processing</Text>
                <Text className="text-sm text-muted-foreground">
                  Our team will carefully prepare your jewelry items with the
                  utmost care and attention.
                </Text>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <Text className="font-medium mb-2">🚚 Secure Delivery</Text>
                <Text className="text-sm text-muted-foreground">
                  Your order will be delivered securely to your doorstep with
                  cash on delivery payment.
                </Text>
              </div>

              <div className="bg-background border rounded-lg p-4">
                <Text className="font-medium mb-2">💎 Quality Assurance</Text>
                <Text className="text-sm text-muted-foreground">
                  Each piece is quality checked before shipping to ensure it
                  meets our standards.
                </Text>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Need Help?</Link>
            </Button>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t">
            <Text className="text-sm text-muted-foreground mb-2">
              Questions about your order?
            </Text>
            <div className="space-y-1">
              <Text className="text-sm">
                Call us: <span className="font-medium">+92 (42) 123-4567</span>
              </Text>
              <Text className="text-sm">
                Email:{" "}
                <span className="font-medium">
                  service@al-walijewellers.com
                </span>
              </Text>
              <Text className="text-sm">
                WhatsApp: <span className="font-medium">+92 (42) 123-4567</span>
              </Text>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  );
}
