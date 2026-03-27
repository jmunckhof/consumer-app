import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { apps } from "./apps";
import { products } from "./products";

export const orgsRelations = relations(orgs, ({ many }) => ({
  apps: many(apps),
  products: many(products),
}));

export const appsRelations = relations(apps, ({ one }) => ({
  org: one(orgs, {
    fields: [apps.orgId],
    references: [orgs.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  org: one(orgs, {
    fields: [products.orgId],
    references: [orgs.id],
  }),
}));
