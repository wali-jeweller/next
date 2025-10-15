import { db } from "@/db";
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, anonymous } from "better-auth/plugins";

export const authServer = betterAuth({
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
      console.log("Sending Email");
    },
  },
  database: drizzleAdapter(db, {
    schema,
    provider: "pg",
    usePlural: true,
    camelCase: false,
  }),
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    cookiePrefix: "auth",
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [anonymous(), admin()],
});
