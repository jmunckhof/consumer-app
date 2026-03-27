import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { orgs } from "./orgs";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    sku: text("sku"),
    priceInCents: integer("price_in_cents").notNull(),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("products_org_id_idx").on(table.orgId),
    index("products_org_sku_idx").on(table.orgId, table.sku),
  ]
);
