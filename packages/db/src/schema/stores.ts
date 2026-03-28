import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  index,
  jsonb,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { orgs } from "./orgs";

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),

    // Address
    address: text("address").notNull(),
    city: text("city").notNull(),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country").notNull().default("NL"),

    // Location
    latitude: numeric("latitude"),
    longitude: numeric("longitude"),

    // Contact
    phone: text("phone"),
    email: text("email"),
    website: text("website"),

    // Opening hours — JSONB array of { day, open, close }
    // e.g. [{ "day": "monday", "open": "09:00", "close": "18:00" }]
    openingHours: jsonb("opening_hours").notNull().default([]),

    // Media
    imageUrl: text("image_url"),

    // Metadata — flexible JSONB for store-specific data
    // e.g. { "parking": true, "wheelchair": true, "services": ["pickup", "returns"] }
    metadata: jsonb("metadata").notNull().default({}),

    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("stores_org_id_idx").on(table.orgId),
    index("stores_org_slug_idx").on(table.orgId, table.slug),
  ]
);
