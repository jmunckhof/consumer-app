import { z } from "zod";

export const createProductVariantSchema = z.object({
  name: z.string().min(1).max(255),
  optionName: z.string().min(1).max(100),
  optionValue: z.string().min(1).max(100),
  priceInCents: z.number().int().min(0).optional(),
  sku: z.string().max(100).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateProductVariantSchema = createProductVariantSchema.partial();

export type CreateProductVariantInput = z.infer<
  typeof createProductVariantSchema
>;
export type UpdateProductVariantInput = z.infer<
  typeof updateProductVariantSchema
>;
