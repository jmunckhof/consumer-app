import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { orgs } from "./orgs";

export const appStatusEnum = pgEnum("app_status", [
  "draft",
  "building",
  "live",
  "disabled",
]);

export const apps = pgTable("apps", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => orgs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  bundleId: text("bundle_id").unique(),
  config: jsonb("config").notNull().default({}),
  status: appStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
