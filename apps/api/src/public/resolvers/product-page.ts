import { and, eq, ne, inArray, ilike, or } from "drizzle-orm";
import { db } from "../../lib/db";
import { products } from "@repo/db/schema";
import type {
  SectionConfig,
  ResolvedSection,
  ResolvedProduct,
  RelatedByCategoryConfig,
  RelatedByTagConfig,
  RelatedHandPickedConfig,
  RecentlyViewedConfig,
} from "@repo/validators";

type ProductContext = {
  orgId: string;
  productId: string;
  categoryId: string | null;
};

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

// Resolvers for product-page section types
// Only includes types that appear on product pages

type ProductResolver<T extends SectionConfig> = (
  config: T,
  ctx: ProductContext
) => Promise<ResolvedSection>;

export async function resolveProductPageSections(
  sectionConfigs: SectionConfig[],
  ctx: ProductContext
): Promise<ResolvedSection[]> {
  return Promise.all(
    sectionConfigs.map((config) => {
      switch (config.type) {
        case "related-by-category":
          return resolveRelatedByCategory(config, ctx);
        case "related-by-tag":
          return resolveRelatedByTag(config, ctx);
        case "related-hand-picked":
          return resolveRelatedHandPicked(config, ctx);
        case "recently-viewed":
          return resolveRecentlyViewed(config);
        case "text-block":
          return Promise.resolve({
            type: "text-block" as const,
            title: config.title,
            body: config.body,
          });
        default:
          // Skip unsupported section types on product page
          return Promise.resolve({
            type: "text-block" as const,
            body: "",
          });
      }
    })
  );
}

async function resolveRelatedByCategory(
  config: RelatedByCategoryConfig,
  ctx: ProductContext
): Promise<ResolvedSection> {
  if (!ctx.categoryId) {
    return {
      type: "related-by-category",
      title: config.title,
      products: [],
    };
  }

  const rows = await db.query.products.findMany({
    where: and(
      eq(products.orgId, ctx.orgId),
      eq(products.categoryId, ctx.categoryId),
      eq(products.isActive, true),
      ne(products.id, ctx.productId)
    ),
    orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.name)],
    limit: config.maxItems ?? 8,
  });

  return {
    type: "related-by-category",
    title: config.title,
    products: rows.map(mapProduct),
  };
}

async function resolveRelatedByTag(
  config: RelatedByTagConfig,
  ctx: ProductContext
): Promise<ResolvedSection> {
  const pattern = `%${config.tag}%`;
  const rows = await db.query.products.findMany({
    where: and(
      eq(products.orgId, ctx.orgId),
      eq(products.isActive, true),
      ne(products.id, ctx.productId),
      or(ilike(products.name, pattern), ilike(products.slug, pattern))
    ),
    orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.name)],
    limit: config.maxItems ?? 8,
  });

  return {
    type: "related-by-tag",
    title: config.title,
    products: rows.map(mapProduct),
  };
}

async function resolveRelatedHandPicked(
  config: RelatedHandPickedConfig,
  ctx: ProductContext
): Promise<ResolvedSection> {
  const rows = await db.query.products.findMany({
    where: and(
      eq(products.orgId, ctx.orgId),
      eq(products.isActive, true),
      inArray(products.slug, config.productSlugs)
    ),
  });

  // Preserve the order from productSlugs
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const ordered = config.productSlugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean) as typeof rows;

  return {
    type: "related-hand-picked",
    title: config.title,
    products: ordered.map(mapProduct),
  };
}

async function resolveRecentlyViewed(
  config: RecentlyViewedConfig
): Promise<ResolvedSection> {
  // Products filled client-side from AsyncStorage
  return {
    type: "recently-viewed",
    title: config.title,
    products: [],
  };
}
