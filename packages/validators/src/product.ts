import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  sku: z.string().max(100).optional(),
  priceInCents: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
