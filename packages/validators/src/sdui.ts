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

export const sectionConfigSchema = z.discriminatedUnion("type", [
  heroBannerConfigSchema,
  categoryGridConfigSchema,
  productCarouselConfigSchema,
  productGridConfigSchema,
  textBlockConfigSchema,
  imageBannerConfigSchema,
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

export const resolvedSectionSchema = z.discriminatedUnion("type", [
  resolvedHeroBannerSchema,
  resolvedCategoryGridSchema,
  resolvedProductCarouselSchema,
  resolvedProductGridSchema,
  resolvedTextBlockSchema,
  resolvedImageBannerSchema,
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
export type HeroBannerConfig = z.infer<typeof heroBannerConfigSchema>;
export type CategoryGridConfig = z.infer<typeof categoryGridConfigSchema>;
export type ProductCarouselConfig = z.infer<typeof productCarouselConfigSchema>;
export type ProductGridConfig = z.infer<typeof productGridConfigSchema>;
export type TextBlockConfig = z.infer<typeof textBlockConfigSchema>;
export type ImageBannerConfig = z.infer<typeof imageBannerConfigSchema>;

// Section type literal union (useful for switch/maps)
export type SectionType = SectionConfig["type"];

// All section types as a const array (for admin UI pickers)
export const SECTION_TYPES = [
  "hero-banner",
  "category-grid",
  "product-carousel",
  "product-grid",
  "text-block",
  "image-banner",
] as const satisfies readonly SectionType[];

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  "hero-banner": "Hero Banner",
  "category-grid": "Category Grid",
  "product-carousel": "Product Carousel",
  "product-grid": "Product Grid",
  "text-block": "Text Block",
  "image-banner": "Image Banner",
};
