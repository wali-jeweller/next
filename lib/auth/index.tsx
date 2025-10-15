import "server-only";
import React from "react";
import { authServer } from "./server";
import { headers } from "next/headers";

async function SignedInBase({ children }: { children: React.ReactNode }) {
  const { user, session } = await auth();
  if (!user || !session) return null;
  return <>{children}</>;
}

async function SignedInAdmin({ children }: { children: React.ReactNode }) {
  const { user, session } = await auth();
  if (!user || !session) return null;
  if ((user.role ?? "").toLowerCase() !== "admin") return null;
  return <>{children}</>;
}

export const SignedIn = Object.assign(SignedInBase, {
  Admin: SignedInAdmin,
});

export async function SignedOut({ children }: { children: React.ReactNode }) {
  const { user, session } = await auth();
  if (user || session) return null;
  return <>{children}</>;
}

export const auth = React.cache(async () => {
  const session = await authServer.api.getSession({
    headers: await headers(),
  });

  const redirectToSignIn = () => {
    const url = new URL("/sign-in", window.location.origin);
    url.searchParams.set("redirect", window.location.pathname);
    window.location.href = url.toString();
  };

  if (!session) {
    return {
      user: null,
      session: null,
      redirectToSignIn,
    };
  }
  return {
    session: session.session,
    user: session.user,
    redirectToSignIn,
  };
});
