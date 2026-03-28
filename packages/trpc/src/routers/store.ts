import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { stores } from "@repo/db/schema";
import { createStoreSchema, updateStoreSchema } from "@repo/validators";
import { router, protectedProcedure } from "../trpc";

export const storeRouter = router({
  list: protectedProcedure
    .input(z.object({ orgId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.stores.findMany({
        where: eq(stores.orgId, input.orgId),
        orderBy: (stores, { asc }) => [asc(stores.sortOrder), asc(stores.name)],
      });
    }),

  byId: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), storeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.query.stores.findFirst({
        where: and(eq(stores.id, input.storeId), eq(stores.orgId, input.orgId)),
      });
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });
      return store;
    }),

  create: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), data: createStoreSchema }))
    .mutation(async ({ ctx, input }) => {
      const { latitude, longitude, ...rest } = input.data;
      const [store] = await ctx.db
        .insert(stores)
        .values({
          ...rest,
          orgId: input.orgId,
          latitude: latitude?.toString() ?? null,
          longitude: longitude?.toString() ?? null,
        })
        .returning();
      return store!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        orgId: z.string().uuid(),
        storeId: z.string().uuid(),
        data: updateStoreSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { latitude, longitude, ...rest } = input.data;
      const updates: Record<string, unknown> = { ...rest };
      if (latitude !== undefined) updates.latitude = latitude?.toString() ?? null;
      if (longitude !== undefined) updates.longitude = longitude?.toString() ?? null;
      const [store] = await ctx.db
        .update(stores)
        .set(updates)
        .where(and(eq(stores.id, input.storeId), eq(stores.orgId, input.orgId)))
        .returning();
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });
      return store;
    }),

  delete: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), storeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [store] = await ctx.db
        .delete(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.orgId, input.orgId)))
        .returning();
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true as const };
    }),
});
