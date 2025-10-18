"use client";

import { LogOut, LogIn, User2 as UserIcon } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useSession, signOut, signIn } from "@/lib/auth/client";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function HeaderUserSheet() {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserIcon className="size-[18px] stroke-[1.5]" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>

        {!session?.user ? (
          <div className="flex-1 flex items-center justify-center">
            <Empty className="border-0 p-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle>Not signed in</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>
                  Sign in to your account to view your profile, orders, and
                  preferences.
                </EmptyDescription>
                <Button className="w-full" onClick={handleSignIn}>
                  <LogIn className="size-4" />
                  Sign In
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Navigation Links */}
              <nav className="space-y-2">
                <Link
                  href="/account/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <UserIcon className="size-4" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <UserIcon className="size-4" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <UserIcon className="size-4" />
                  <span>Saved Addresses</span>
                </Link>
                <Link
                  href="/account/preferences"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <UserIcon className="size-4" />
                  <span>Preferences</span>
                </Link>
              </nav>

              <Separator />

              {/* Sign Out */}
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => signOut()}
              >
                <LogOut className="size-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
