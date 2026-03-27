import { z } from "zod";

const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().max(255).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(63)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(5000).optional(),
  categoryId: z.string().uuid().optional(),
  images: z.array(productImageSchema).optional(),
  priceInCents: z.number().int().min(0),
  compareAtPriceInCents: z.number().int().min(0).optional(),
  sku: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type ProductImage = z.infer<typeof productImageSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
