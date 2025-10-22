import {
  pgTable,
  text,
  integer,
  real,
  uuid,
  timestamp,
  jsonb,
  boolean,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import z from "zod";
import { createSelectSchema } from "drizzle-zod";

export const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }),
};

// —— USERS ——
export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text(),
    email: text().notNull(),
    emailVerified: boolean().notNull().default(false),
    image: text(),
    phone: text(),
    isAnonymous: boolean().notNull().default(false),
    password: text(),
    // Admin plugin fields
    role: text().default("user"),
    banned: boolean().notNull().default(false),
    banReason: text(),
    banExpires: timestamp({ withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_email_verified_idx").on(t.emailVerified),
    index("users_is_anonymous_idx").on(t.isAnonymous),
    index("users_role_idx").on(t.role),
    index("users_banned_idx").on(t.banned),
  ]
);

// —— SESSIONS ——
export const sessions = pgTable(
  "sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    ...timestamps,
  },
  (t) => [
    index("sessions_user_id_idx").on(t.userId),
    index("sessions_token_idx").on(t.token),
    index("sessions_expires_at_idx").on(t.expiresAt),
  ]
);

// —— ACCOUNTS ——
export const accounts = pgTable(
  "accounts",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text().notNull(),
    providerId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    idToken: text(),
    password: text(),
    ...timestamps,
  },
  (t) => [
    index("accounts_user_id_idx").on(t.userId),
    index("accounts_provider_id_idx").on(t.providerId),
    index("accounts_account_id_idx").on(t.accountId),
  ]
);

// —— VERIFICATIONS ——
export const verifications = pgTable(
  "verifications",
  {
    id: uuid().primaryKey().defaultRandom(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [
    index("verifications_identifier_idx").on(t.identifier),
    index("verifications_expires_at_idx").on(t.expiresAt),
  ]
);

// —— PRODUCT STATUS ENUM ——
export const productStatusEnum = [
  "new",
  "featured",
  "sale",
  "trending",
  "coming_soon",
  "available_on_order",
  "out_of_stock",
] as const;

export const visibilityEnum = ["public", "private"] as const;
export const materialEnum = [
  "gold",
  "silver",
  "platinum",
  "pladium",
  "other",
] as const;
export const genderEnum = ["male", "female", "unisex"] as const;
export const cartStatusEnum = [
  "active",
  "abandoned",
  "converted",
  "expired",
] as const;
export const orderStatusEnum = [
  "pending",
  "paid",
  "shipped",
  "completed",
  "cancelled",
] as const;

// —— PRODUCTS ——
export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text(),
    slug: text().notNull(),
    status: text({ enum: productStatusEnum }).default("new"),
    visibility: text({ enum: visibilityEnum }).default("public"),
    material: text({ enum: materialEnum }).default("other"),
    weight: real(),
    gender: text({ enum: genderEnum }),
    categoryId: uuid().references(() => categories.id),
    images: jsonb().$type<
      {
        url: string;
        alt?: string;
        rank: number;
      }[]
    >(),
    sizes: jsonb().$type<
      Array<{
        unit: string;
        value: string;
      }>
    >(),
    attributes: jsonb().$type<
      {
        name: string;
        value: string;
        rank?: number;
      }[]
    >(),
    metadata: jsonb().$type<{
      [key: string]: string;
    }>(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_id_idx").on(t.categoryId),
    index("products_status_idx").on(t.status),
    index("products_visibility_idx").on(t.visibility),
    index("products_material_idx").on(t.material),
    index("products_gender_idx").on(t.gender),
  ]
);

// —— MARKETS ——
export const markets = pgTable(
  "markets",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    code: text().notNull(),
    currency: text().notNull(),
    region: text().notNull(),
    isActive: boolean().default(true),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("markets_code_idx").on(t.code),
    index("markets_is_active_idx").on(t.isActive),
  ]
);

// —— MATERIAL RATES (price per gram per market & material) ——
export const materialRates = pgTable(
  "material_rates",
  {
    id: uuid().primaryKey().defaultRandom(),
    material: text({ enum: materialEnum }).notNull(),
    marketId: uuid()
      .notNull()
      .references(() => markets.id, { onDelete: "cascade" }),
    pricePerGram: integer().notNull(),
    effectiveFrom: timestamp({ withTimezone: true }).notNull().defaultNow(),
    effectiveTo: timestamp({ withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("material_rates_material_idx").on(t.material),
    index("material_rates_market_id_idx").on(t.marketId),
    index("material_rates_effective_idx").on(t.effectiveFrom),
  ]
);

// —— PRODUCT PRICING (market & currency specific with making charges) ——
export const productPricing = pgTable(
  "product_pricing",
  {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    marketId: uuid()
      .notNull()
      .references(() => markets.id, { onDelete: "cascade" }),
    // Base price override (if not using material-based calculation)
    basePrice: integer(),
    makingCharges: integer().notNull().default(0),
    discountPercentage: real().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("product_pricing_unique_idx").on(t.productId, t.marketId),
    index("product_pricing_product_id_idx").on(t.productId),
    index("product_pricing_market_id_idx").on(t.marketId),
  ]
);

// —— IMAGES ——
export const images = pgTable("images", {
  id: uuid().primaryKey().defaultRandom(),
  url: text().notNull(),
  filename: text().notNull(),
  ...timestamps,
});

// —— CATEGORIES ——
export const categories = pgTable(
  "categories",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text(),
    slug: text().notNull(),
    thumbnail: text(),
    sizes: jsonb().$type<
      Array<{
        unit: string;
        value: string;
      }>
    >(),
    ...timestamps,
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)]
);

// —— COLLECTIONS ——
export const collections = pgTable(
  "collections",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text(),
    slug: text().notNull(),
    visibility: text({ enum: visibilityEnum }).default("public"),
    thumbnail: text(),
    ...timestamps,
  },
  (t) => [uniqueIndex("collections_slug_idx").on(t.slug)]
);

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: uuid().references(() => collections.id),
    productId: uuid().references(() => products.id),
    rank: integer().notNull().default(0),
    ...timestamps,
  },
  (t) => [
    primaryKey({ columns: [t.collectionId, t.productId] }),
    index("collection_products_collection_id_idx").on(t.collectionId),
    index("collection_products_product_id_idx").on(t.productId),
  ]
);

// —— WISHLISTS ——
export const wishlists = pgTable("wishlists", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  items: jsonb().$type<Array<z.infer<typeof productSchema>>>(),
  ...timestamps,
});

// —— CARTS ——
export const carts = pgTable("carts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  status: text({ enum: cartStatusEnum }).default("active"),
  items: jsonb().$type<Array<z.infer<typeof productSchema>>>(),
  ...timestamps,
});

// —— ORDERS ——
export const orders = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  status: text({ enum: orderStatusEnum }).default("pending"),
  items: jsonb().$type<Array<z.infer<typeof productSchema>>>(),
  total: integer().notNull(),
  shipping: integer().default(0),
  tax: integer().default(0),
  discount: integer().default(0),
  subtotal: integer().notNull(),
  address: jsonb().$type<{
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }>(),
  ...timestamps,
});

// —— PROMOTIONS ——
export const promotions = pgTable("promotions", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  type: text({ enum: ["amount", "percentage"] }).default("amount"),
  appliesTo: jsonb().$type<{
    productId?: string;
    categoryId?: string;
    collectionId?: string;
  }>(),
  ...timestamps,
});

// —— PRODUCT SLUG REDIRECTS ——
export const productSlugRedirects = pgTable(
  "product_slug_redirects",
  {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    oldSlug: text().notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("product_slug_redirects_old_slug_idx").on(t.oldSlug),
    index("product_slug_redirects_product_id_idx").on(t.productId),
  ]
);

// —— BLOG POSTS ——
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text().notNull(),
    slug: text().notNull().unique(),
    content: text().notNull(),
    status: text({
      enum: ["draft", "published"],
    })
      .notNull()
      .default("draft"),
    publishedAt: timestamp({ withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("blog_posts_slug_idx").on(t.slug),
    index("blog_posts_status_idx").on(t.status),
  ]
);

// —— DAILY GOLD RATES ——
export const dailyMaterial = pgTable("daily_material_rates", {
  id: uuid().primaryKey().defaultRandom(),
  material: text({ enum: materialEnum }),
  ratePerGram: integer().notNull(),
  date: text()
    .notNull()
    .default(sql`CURRENT_DATE`),
  ...timestamps,
});

export type TUser = typeof users.$inferSelect;
export type TSession = typeof sessions.$inferSelect;
export type TAccount = typeof accounts.$inferSelect;
export type TVerification = typeof verifications.$inferSelect;
export type TProduct = typeof products.$inferSelect;
export type TImage = typeof images.$inferSelect;
export type TCategory = typeof categories.$inferSelect;
export type TCollection = typeof collections.$inferSelect;
export type TWishlist = z.infer<typeof wishlistSchema>;
export type TCart = z.infer<typeof cartSchema>;
export type TOrder = typeof orders.$inferSelect;
export type TPromotion = typeof promotions.$inferSelect;
export type TDailMaterialPrices = typeof dailyMaterial.$inferSelect;
export type TProductSlugRedirect = typeof productSlugRedirects.$inferSelect;
export type TBlogPost = typeof blogPosts.$inferSelect;
export type TMarket = typeof markets.$inferSelect;
export type TMaterialRate = typeof materialRates.$inferSelect;
export type TProductPricing = typeof productPricing.$inferSelect;

// —— RELATIONS ——

export const productSchema = createSelectSchema(products);
export const wishlistSchema = createSelectSchema(wishlists)
  .omit({
    items: true,
  })
  .extend({
    items: z.array(productSchema).nullable(),
  });
export const cartSchema = createSelectSchema(carts)
  .omit({
    items: true,
  })
  .extend({
    items: z.array(productSchema).nullable(),
  });
export const usersRelations = relations(users, ({ one, many }) => ({
  cart: one(carts, {
    fields: [users.id],
    references: [carts.userId],
  }),
  orders: many(orders),
  wishlists: one(wishlists, {
    fields: [users.id],
    references: [wishlists.userId],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  productSlugRedirects: many(productSlugRedirects),
  collectionProducts: many(collectionProducts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionProducts: many(collectionProducts),
}));

export const collectionProductsRelations = relations(
  collectionProducts,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionProducts.collectionId],
      references: [collections.id],
    }),
    product: one(products, {
      fields: [collectionProducts.productId],
      references: [products.id],
    }),
  })
);

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const productSlugRedirectsRelations = relations(
  productSlugRedirects,
  ({ one }) => ({
    product: one(products, {
      fields: [productSlugRedirects.productId],
      references: [products.id],
    }),
  })
);

// —— PRICING RELATIONS ——

export const marketsRelations = relations(markets, ({ many }) => ({
  materialRates: many(materialRates),
  productPricing: many(productPricing),
}));

export const materialRatesRelations = relations(materialRates, ({ one }) => ({
  market: one(markets, {
    fields: [materialRates.marketId],
    references: [markets.id],
  }),
}));

export const productPricingRelations = relations(productPricing, ({ one }) => ({
  product: one(products, {
    fields: [productPricing.productId],
    references: [products.id],
  }),
  market: one(markets, {
    fields: [productPricing.marketId],
    references: [markets.id],
  }),
}));
