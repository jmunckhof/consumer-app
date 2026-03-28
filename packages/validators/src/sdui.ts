import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const sduiActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("navigate"), route: z.string() }),
  z.object({ type: z.literal("url"), href: z.string().url() }),
]);

// ---------------------------------------------------------------------------
// Section CONFIGS — stored in apps.config.pages.home (admin-editable)
// ---------------------------------------------------------------------------

export const storeHeaderConfigSchema = z.object({
  type: z.literal("store-header"),
  showStoreName: z.boolean().default(true),
  subtitle: z.string().max(200).optional(),
  showSearch: z.boolean().default(false),
  showLogo: z.boolean().default(true),
});

export const heroBannerConfigSchema = z.object({
  type: z.literal("hero-banner"),
  imageUrl: z.string().url(),
  title: z.string().max(100).optional(),
  subtitle: z.string().max(200).optional(),
  action: sduiActionSchema.optional(),
});

export const categoryGridConfigSchema = z.object({
  type: z.literal("category-grid"),
  title: z.string().max(100).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  maxItems: z.number().int().min(1).max(20).optional(),
});

export const productCarouselConfigSchema = z.object({
  type: z.literal("product-carousel"),
  title: z.string().min(1).max(100),
  categoryId: z.string().uuid().optional(),
  maxItems: z.number().int().min(1).max(20).optional(),
});

export const productGridConfigSchema = z.object({
  type: z.literal("product-grid"),
  title: z.string().max(100).optional(),
  categoryId: z.string().uuid().optional(),
  maxItems: z.number().int().min(1).max(50).optional(),
});

export const textBlockConfigSchema = z.object({
  type: z.literal("text-block"),
  title: z.string().max(200).optional(),
  body: z.string().max(5000),
});

export const imageBannerConfigSchema = z.object({
  type: z.literal("image-banner"),
  imageUrl: z.string().url(),
  alt: z.string().max(200).optional(),
  action: sduiActionSchema.optional(),
});

// Product-page specific sections
export const relatedByCategoryConfigSchema = z.object({
  type: z.literal("related-by-category"),
  title: z.string().max(100).optional(),
  maxItems: z.number().int().min(1).max(20).optional(),
});

export const relatedByTagConfigSchema = z.object({
  type: z.literal("related-by-tag"),
  title: z.string().max(100).optional(),
  tag: z.string().min(1).max(50),
  maxItems: z.number().int().min(1).max(20).optional(),
});

export const relatedHandPickedConfigSchema = z.object({
  type: z.literal("related-hand-picked"),
  title: z.string().max(100).optional(),
  productSlugs: z.array(z.string()).min(1).max(20),
});

export const recentlyViewedConfigSchema = z.object({
  type: z.literal("recently-viewed"),
  title: z.string().max(100).optional(),
  maxItems: z.number().int().min(1).max(20).optional(),
});

export const sectionConfigSchema = z.discriminatedUnion("type", [
  storeHeaderConfigSchema,
  heroBannerConfigSchema,
  categoryGridConfigSchema,
  productCarouselConfigSchema,
  productGridConfigSchema,
  textBlockConfigSchema,
  imageBannerConfigSchema,
  relatedByCategoryConfigSchema,
  relatedByTagConfigSchema,
  relatedHandPickedConfigSchema,
  recentlyViewedConfigSchema,
]);

export const pageLayoutSchema = z.object({
  sections: z.array(sectionConfigSchema).max(20),
});

// ---------------------------------------------------------------------------
// RESOLVED sections — returned by API to the mobile app (fully hydrated)
// ---------------------------------------------------------------------------

export const resolvedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })),
  priceInCents: z.number(),
  compareAtPriceInCents: z.number().nullable(),
});

export const resolvedCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().nullable(),
});

export const resolvedStoreHeaderSchema = z.object({
  type: z.literal("store-header"),
  storeName: z.string(),
  logoUrl: z.string().nullable(),
  subtitle: z.string().optional(),
  showSearch: z.boolean(),
  showLogo: z.boolean(),
});

export const resolvedHeroBannerSchema = z.object({
  type: z.literal("hero-banner"),
  imageUrl: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  action: sduiActionSchema.optional(),
});

export const resolvedCategoryGridSchema = z.object({
  type: z.literal("category-grid"),
  title: z.string().optional(),
  categories: z.array(resolvedCategorySchema),
});

export const resolvedProductCarouselSchema = z.object({
  type: z.literal("product-carousel"),
  title: z.string(),
  products: z.array(resolvedProductSchema),
});

export const resolvedProductGridSchema = z.object({
  type: z.literal("product-grid"),
  title: z.string().optional(),
  products: z.array(resolvedProductSchema),
});

export const resolvedTextBlockSchema = z.object({
  type: z.literal("text-block"),
  title: z.string().optional(),
  body: z.string(),
});

export const resolvedImageBannerSchema = z.object({
  type: z.literal("image-banner"),
  imageUrl: z.string(),
  alt: z.string().optional(),
  action: sduiActionSchema.optional(),
});

// Product-page resolved sections
export const resolvedRelatedByCategorySchema = z.object({
  type: z.literal("related-by-category"),
  title: z.string().optional(),
  products: z.array(resolvedProductSchema),
});

export const resolvedRelatedByTagSchema = z.object({
  type: z.literal("related-by-tag"),
  title: z.string().optional(),
  products: z.array(resolvedProductSchema),
});

export const resolvedRelatedHandPickedSchema = z.object({
  type: z.literal("related-hand-picked"),
  title: z.string().optional(),
  products: z.array(resolvedProductSchema),
});

export const resolvedRecentlyViewedSchema = z.object({
  type: z.literal("recently-viewed"),
  title: z.string().optional(),
  products: z.array(resolvedProductSchema),
});

export const resolvedSectionSchema = z.discriminatedUnion("type", [
  resolvedStoreHeaderSchema,
  resolvedHeroBannerSchema,
  resolvedCategoryGridSchema,
  resolvedProductCarouselSchema,
  resolvedProductGridSchema,
  resolvedTextBlockSchema,
  resolvedImageBannerSchema,
  resolvedRelatedByCategorySchema,
  resolvedRelatedByTagSchema,
  resolvedRelatedHandPickedSchema,
  resolvedRecentlyViewedSchema,
]);

export const resolvedPageSchema = z.object({
  sections: z.array(resolvedSectionSchema),
});

// ---------------------------------------------------------------------------
// Inferred TypeScript types
// ---------------------------------------------------------------------------

export type SDUIAction = z.infer<typeof sduiActionSchema>;
export type SectionConfig = z.infer<typeof sectionConfigSchema>;
export type PageLayout = z.infer<typeof pageLayoutSchema>;
export type ResolvedSection = z.infer<typeof resolvedSectionSchema>;
export type ResolvedPage = z.infer<typeof resolvedPageSchema>;
export type ResolvedProduct = z.infer<typeof resolvedProductSchema>;
export type ResolvedCategory = z.infer<typeof resolvedCategorySchema>;

// Per-section config types (for admin forms)
export type StoreHeaderConfig = z.infer<typeof storeHeaderConfigSchema>;
export type HeroBannerConfig = z.infer<typeof heroBannerConfigSchema>;
export type CategoryGridConfig = z.infer<typeof categoryGridConfigSchema>;
export type ProductCarouselConfig = z.infer<typeof productCarouselConfigSchema>;
export type ProductGridConfig = z.infer<typeof productGridConfigSchema>;
export type TextBlockConfig = z.infer<typeof textBlockConfigSchema>;
export type ImageBannerConfig = z.infer<typeof imageBannerConfigSchema>;
export type RelatedByCategoryConfig = z.infer<typeof relatedByCategoryConfigSchema>;
export type RelatedByTagConfig = z.infer<typeof relatedByTagConfigSchema>;
export type RelatedHandPickedConfig = z.infer<typeof relatedHandPickedConfigSchema>;
export type RecentlyViewedConfig = z.infer<typeof recentlyViewedConfigSchema>;

// Section type literal union (useful for switch/maps)
export type SectionType = SectionConfig["type"];

// All section types as a const array (for admin UI pickers)
export const SECTION_TYPES = [
  "store-header",
  "hero-banner",
  "category-grid",
  "product-carousel",
  "product-grid",
  "text-block",
  "image-banner",
  "related-by-category",
  "related-by-tag",
  "related-hand-picked",
  "recently-viewed",
] as const satisfies readonly SectionType[];

// Home page section types (for admin picker)
export const HOME_SECTION_TYPES = [
  "store-header",
  "hero-banner",
  "category-grid",
  "product-carousel",
  "product-grid",
  "text-block",
  "image-banner",
] as const;

// Product page section types (for admin picker)
export const PRODUCT_SECTION_TYPES = [
  "related-by-category",
  "related-by-tag",
  "related-hand-picked",
  "recently-viewed",
  "text-block",
] as const;

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  "store-header": "Store Header",
  "hero-banner": "Hero Banner",
  "category-grid": "Category Grid",
  "product-carousel": "Product Carousel",
  "product-grid": "Product Grid",
  "text-block": "Text Block",
  "image-banner": "Image Banner",
  "related-by-category": "Related by Category",
  "related-by-tag": "Related by Tag/Brand",
  "related-hand-picked": "Hand-picked Products",
  "recently-viewed": "Recently Viewed",
};
