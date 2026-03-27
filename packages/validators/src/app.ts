import { z } from "zod";

export const appConfigSchema = z.object({
  theme: z
    .object({
      primaryColor: z.string().optional(),
      accentColor: z.string().optional(),
      darkMode: z.boolean().optional(),
    })
    .optional(),
  features: z
    .object({
      cart: z.boolean().optional(),
      wishlist: z.boolean().optional(),
      reviews: z.boolean().optional(),
    })
    .optional(),
});

export const createAppSchema = z.object({
  name: z.string().min(1).max(255),
  bundleId: z
    .string()
    .regex(
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/,
      "Must be reverse domain notation (e.g. com.store.app)"
    )
    .optional(),
  config: appConfigSchema.optional(),
});

export const updateAppSchema = createAppSchema.partial();

export type AppConfig = z.infer<typeof appConfigSchema>;
export type CreateAppInput = z.infer<typeof createAppSchema>;
export type UpdateAppInput = z.infer<typeof updateAppSchema>;
