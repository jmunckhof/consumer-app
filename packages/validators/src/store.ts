import { z } from "zod";

const openingHourSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
  closed: z.boolean().optional(),
});

export const createStoreSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(63)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().length(2).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  openingHours: z.array(openingHourSchema).optional(),
  imageUrl: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateStoreSchema = createStoreSchema.partial();

export type OpeningHour = z.infer<typeof openingHourSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
