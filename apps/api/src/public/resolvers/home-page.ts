import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../lib/db";
import { orgs, categories, products } from "@repo/db/schema";
import type {
  SectionConfig,
  ResolvedSection,
  ResolvedProduct,
  StoreHeaderConfig,
  HeroBannerConfig,
  CategoryGridConfig,
  ProductCarouselConfig,
  ProductGridConfig,
  TextBlockConfig,
  ImageBannerConfig,
} from "@repo/validators";

// ---------------------------------------------------------------------------
// Product mapper — converts DB row to ResolvedProduct
// ---------------------------------------------------------------------------

function mapProduct(row: {
  id: string;
  name: string;
  slug: string;
  images: unknown;
  priceInCents: number;
  compareAtPriceInCents: number | null;
}): ResolvedProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    images: (row.images as { url: string; alt?: string }[]) ?? [],
    priceInCents: row.priceInCents,
    compareAtPriceInCents: row.compareAtPriceInCents,
  };
}

// ---------------------------------------------------------------------------
// Typed resolver map — exhaustive over SectionConfig["type"]
// Adding a new section type without a resolver is a compile error.
// ---------------------------------------------------------------------------

type Resolver<T extends SectionConfig> = (
  config: T,
  orgId: string
) => Promise<ResolvedSection>;

const resolvers: {
  [K in SectionConfig["type"]]: Resolver<Extract<SectionConfig, { type: K }>>;
} = {
  "store-header": async (config: StoreHeaderConfig, orgId: string) => {
    const org = await db.query.orgs.findFirst({
      where: eq(orgs.id, orgId),
    });
    return {
      type: "store-header" as const,
      storeName: org?.name ?? "",
      logoUrl: org?.logoUrl ?? null,
      subtitle: config.subtitle,
      showSearch: config.showSearch ?? false,
      showLogo: config.showLogo ?? true,
    };
  },

  "hero-banner": async (config: HeroBannerConfig) => ({
    type: "hero-banner" as const,
    imageUrl: config.imageUrl,
    title: config.title,
    subtitle: config.subtitle,
    action: config.action,
  }),

  "category-grid": async (config: CategoryGridConfig, orgId: string) => {
    const conditions = [eq(categories.orgId, orgId)];
    if (config.categoryIds?.length) {
      conditions.push(inArray(categories.id, config.categoryIds));
    }

    const rows = await db.query.categories.findMany({
      where: and(...conditions),
      orderBy: (c, { asc }) => [asc(c.sortOrder), asc(c.name)],
      limit: config.maxItems ?? 6,
    });

    return {
      type: "category-grid" as const,
      title: config.title,
      categories: rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        imageUrl: c.imageUrl,
      })),
    };
  },

  "product-carousel": async (
    config: ProductCarouselConfig,
    orgId: string
  ) => {
    const conditions = [
      eq(products.orgId, orgId),
      eq(products.isActive, true),
    ];
    if (config.categoryId) {
      conditions.push(eq(products.categoryId, config.categoryId));
    }

    const rows = await db.query.products.findMany({
      where: and(...conditions),
      orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.name)],
      limit: config.maxItems ?? 10,
    });

    return {
      type: "product-carousel" as const,
      title: config.title,
      products: rows.map(mapProduct),
    };
  },

  "product-grid": async (config: ProductGridConfig, orgId: string) => {
    const conditions = [
      eq(products.orgId, orgId),
      eq(products.isActive, true),
    ];
    if (config.categoryId) {
      conditions.push(eq(products.categoryId, config.categoryId));
    }

    const rows = await db.query.products.findMany({
      where: and(...conditions),
      orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.name)],
      limit: config.maxItems ?? 10,
    });

    return {
      type: "product-grid" as const,
      title: config.title,
      products: rows.map(mapProduct),
    };
  },

  "text-block": async (config: TextBlockConfig) => ({
    type: "text-block" as const,
    title: config.title,
    body: config.body,
  }),

  "image-banner": async (config: ImageBannerConfig) => ({
    type: "image-banner" as const,
    imageUrl: config.imageUrl,
    alt: config.alt,
    action: config.action,
  }),
};

// ---------------------------------------------------------------------------
// Main resolver — takes an array of section configs and resolves all
// ---------------------------------------------------------------------------

export async function resolveHomePage(
  sectionConfigs: SectionConfig[],
  orgId: string
): Promise<ResolvedSection[]> {
  return Promise.all(
    sectionConfigs.map((config) => {
      const resolver = resolvers[config.type] as Resolver<typeof config>;
      return resolver(config, orgId);
    })
  );
}
