import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [anonymousClient(), lastLoginMethodClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
