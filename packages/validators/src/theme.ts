import { z } from "zod";

// ---------------------------------------------------------------------------
// Global design tokens — brand identity
// ---------------------------------------------------------------------------

export const globalThemeSchema = z.object({
  // Colors
  primaryColor: z.string().default("#000000"),
  secondaryColor: z.string().default("#FFFFFF"),
  backgroundColor: z.string().default("#F5F5F5"),
  surfaceColor: z.string().default("#FFFFFF"),
  textColor: z.string().default("#1A1A1A"),
  textSecondaryColor: z.string().default("#717171"),
  textOnPrimary: z.string().default("#FFFFFF"),
  accentColor: z.string().default("#3B82F6"),
  errorColor: z.string().default("#DC2626"),

  // Typography
  fontFamily: z.string().default("system"),
  headingSize: z.number().min(14).max(36).default(22),
  bodySize: z.number().min(10).max(24).default(15),
  captionSize: z.number().min(8).max(18).default(12),

  // Spacing & Shape
  borderRadius: z.number().min(0).max(32).default(12),
  sectionSpacing: z.number().min(0).max(48).default(16),
  contentPadding: z.number().min(0).max(48).default(16),
});

// ---------------------------------------------------------------------------
// Component-level tokens — per-component-type overrides
// ---------------------------------------------------------------------------

export const productCardThemeSchema = z.object({
  borderRadius: z.number().min(0).max(32).optional(),
  imageAspectRatio: z.number().min(0.5).max(2).default(1),
  showBadge: z.boolean().default(true),
  shadow: z.boolean().default(false),
});

export const sectionHeaderThemeSchema = z.object({
  fontSize: z.number().min(12).max(32).optional(),
  showViewAll: z.boolean().default(false),
  viewAllLabel: z.string().max(30).default("View all"),
});

export const categoryCardThemeSchema = z.object({
  shape: z.enum(["square", "rounded", "circle"]).default("rounded"),
  showLabel: z.boolean().default(true),
  borderRadius: z.number().min(0).max(32).optional(),
});

export const heroBannerThemeSchema = z.object({
  height: z.number().min(100).max(500).default(200),
  overlayGradient: z.boolean().default(true),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
});

export const buttonThemeSchema = z.object({
  borderRadius: z.number().min(0).max(32).optional(),
  style: z.enum(["filled", "outlined"]).default("filled"),
});

export const componentThemeSchema = z.object({
  productCard: productCardThemeSchema.optional(),
  sectionHeader: sectionHeaderThemeSchema.optional(),
  categoryCard: categoryCardThemeSchema.optional(),
  heroBanner: heroBannerThemeSchema.optional(),
  button: buttonThemeSchema.optional(),
});

// ---------------------------------------------------------------------------
// Combined app theme
// ---------------------------------------------------------------------------

export const appThemeSchema = z.object({
  global: globalThemeSchema.optional(),
  components: componentThemeSchema.optional(),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type GlobalTheme = z.infer<typeof globalThemeSchema>;
export type ProductCardTheme = z.infer<typeof productCardThemeSchema>;
export type SectionHeaderTheme = z.infer<typeof sectionHeaderThemeSchema>;
export type CategoryCardTheme = z.infer<typeof categoryCardThemeSchema>;
export type HeroBannerTheme = z.infer<typeof heroBannerThemeSchema>;
export type ButtonTheme = z.infer<typeof buttonThemeSchema>;
export type ComponentTheme = z.infer<typeof componentThemeSchema>;
export type AppTheme = z.infer<typeof appThemeSchema>;

// ---------------------------------------------------------------------------
// Default resolved theme (all defaults applied)
// ---------------------------------------------------------------------------

export const DEFAULT_GLOBAL_THEME: GlobalTheme = {
  primaryColor: "#000000",
  secondaryColor: "#FFFFFF",
  backgroundColor: "#F5F5F5",
  surfaceColor: "#FFFFFF",
  textColor: "#1A1A1A",
  textSecondaryColor: "#717171",
  textOnPrimary: "#FFFFFF",
  accentColor: "#3B82F6",
  errorColor: "#DC2626",
  fontFamily: "system",
  headingSize: 22,
  bodySize: 15,
  captionSize: 12,
  borderRadius: 12,
  sectionSpacing: 16,
  contentPadding: 16,
};

export const DEFAULT_COMPONENT_THEME: Required<ComponentTheme> = {
  productCard: {
    imageAspectRatio: 1,
    showBadge: true,
    shadow: false,
  },
  sectionHeader: {
    showViewAll: false,
    viewAllLabel: "View all",
  },
  categoryCard: {
    shape: "rounded",
    showLabel: true,
  },
  heroBanner: {
    height: 200,
    overlayGradient: true,
    textAlign: "left",
  },
  button: {
    style: "filled",
  },
};
