import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations",
  verbose: true,
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL || "postgresql://localhost:5432/store",
  },
  casing: "snake_case",
});
