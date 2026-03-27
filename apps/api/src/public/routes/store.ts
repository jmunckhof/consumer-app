import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { orgs, apps, categories, products, productVariants } from "@repo/db/schema";
import { resolveHomePage } from "../resolvers/home-page";
import type { AppConfig } from "@repo/validators";

const app = new Hono()

  // Resolve org by slug — returns org info + app config (theme/branding)
  .get("/:slug", async (c) => {
    const { slug } = c.req.param();

    const org = await db.query.orgs.findFirst({
      where: and(eq(orgs.slug, slug), eq(orgs.isActive, true)),
    });
    if (!org) return c.json({ error: "Store not found" }, 404);

    // Prefer live app, fall back to any app for dev
    const appConfig = await db.query.apps.findFirst({
      where: eq(apps.orgId, org.id),
      orderBy: (apps, { sql }) => [
        sql`CASE WHEN ${apps.status} = 'live' THEN 0 ELSE 1 END`,
      ],
    });

    return c.json({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      currency: org.currency,
      config: appConfig?.config ?? {},
    });
  })

  // Categories for the store
  .get("/:slug/categories", async (c) => {
    const { slug } = c.req.param();

    const org = await db.query.orgs.findFirst({
      where: and(eq(orgs.slug, slug), eq(orgs.isActive, true)),
    });
    if (!org) return c.json({ error: "Store not found" }, 404);

    const result = await db.query.categories.findMany({
      where: eq(categories.orgId, org.id),
      orderBy: (categories, { asc }) => [
        asc(categories.sortOrder),
        asc(categories.name),
      ],
    });

    return c.json(result);
  })

  // Products — optionally filtered by category
  .get("/:slug/products", async (c) => {
    const { slug } = c.req.param();
    const categoryId = c.req.query("category");

    const org = await db.query.orgs.findFirst({
      where: and(eq(orgs.slug, slug), eq(orgs.isActive, true)),
    });
    if (!org) return c.json({ error: "Store not found" }, 404);

    const conditions = [
      eq(products.orgId, org.id),
      eq(products.isActive, true),
    ];
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    const result = await db.query.products.findMany({
      where: and(...conditions),
      with: { category: true },
      orderBy: (products, { asc }) => [
        asc(products.sortOrder),
        asc(products.name),
      ],
    });

    return c.json(result);
  })

  // Single product with variants
  .get("/:slug/products/:productSlug", async (c) => {
    const { slug, productSlug } = c.req.param();

    const org = await db.query.orgs.findFirst({
      where: and(eq(orgs.slug, slug), eq(orgs.isActive, true)),
    });
    if (!org) return c.json({ error: "Store not found" }, 404);

    const product = await db.query.products.findFirst({
      where: and(
        eq(products.orgId, org.id),
        eq(products.slug, productSlug),
        eq(products.isActive, true)
      ),
      with: { category: true, variants: true },
    });
    if (!product) return c.json({ error: "Product not found" }, 404);

    return c.json(product);
  })

  // SDUI — resolved home page
  .get("/:slug/pages/home", async (c) => {
    const { slug } = c.req.param();

    const org = await db.query.orgs.findFirst({
      where: and(eq(orgs.slug, slug), eq(orgs.isActive, true)),
    });
    if (!org) return c.json({ error: "Store not found" }, 404);

    const appConfig = await db.query.apps.findFirst({
      where: eq(apps.orgId, org.id),
      orderBy: (apps, { sql }) => [
        sql`CASE WHEN ${apps.status} = 'live' THEN 0 ELSE 1 END`,
      ],
    });

    const config = appConfig?.config as AppConfig | undefined;
    const pageLayout = config?.pages?.home;

    if (!pageLayout || pageLayout.sections.length === 0) {
      return c.json({ sections: [] });
    }

    const sections = await resolveHomePage(pageLayout.sections, org.id);
    return c.json({ sections });
  });

export { app as storeRoutes };
