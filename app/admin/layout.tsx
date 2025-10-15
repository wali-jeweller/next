import type { Metadata } from "next";
import { AppSidebar } from "@/components/admin/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SignedIn, SignedOut } from "@/lib/auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15rem",
        } as React.CSSProperties
      }
    >
      <Suspense>
        <SignedIn.Admin>
          <AppSidebar />
          <SidebarInset>
            <main className="overflow-y-auto">{children}</main>
          </SidebarInset>
        </SignedIn.Admin>
        <SignedOut>
          <div className="min-h-screen flex items-center justify-center bg-background w-full">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-medium">Admin Access Required</h1>
              <p className="text-muted-foreground">
                Please sign in to access the admin panel.
              </p>
            </div>
          </div>
        </SignedOut>
      </Suspense>
    </SidebarProvider>
  );
}
