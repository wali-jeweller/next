import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

const dbUrl = assertValue(process.env.DB_URL, "DB_URL is not set");

const client = neon(dbUrl);

export const db = drizzle({ client, schema, casing: "snake_case" });
