import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { apps } from "./apps";
import { categories } from "./categories";
import { products } from "./products";
import { productVariants } from "./product-variants";
import { stores } from "./stores";

export const orgsRelations = relations(orgs, ({ many }) => ({
  apps: many(apps),
  categories: many(categories),
  stores: many(stores),
  products: many(products),
}));

export const appsRelations = relations(apps, ({ one }) => ({
  org: one(orgs, {
    fields: [apps.orgId],
    references: [orgs.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  org: one(orgs, {
    fields: [categories.orgId],
    references: [orgs.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  org: one(orgs, {
    fields: [products.orgId],
    references: [orgs.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

export const storesRelations = relations(stores, ({ one }) => ({
  org: one(orgs, {
    fields: [stores.orgId],
    references: [orgs.id],
  }),
}));
