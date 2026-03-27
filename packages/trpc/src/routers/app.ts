import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { apps } from "@repo/db/schema";
import { createAppSchema, updateAppSchema } from "@repo/validators";
import { router, protectedProcedure } from "../trpc";

export const appRouter = router({
  list: protectedProcedure
    .input(z.object({ orgId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.apps.findMany({
        where: eq(apps.orgId, input.orgId),
        orderBy: (apps, { desc }) => [desc(apps.createdAt)],
      });
    }),

  byId: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), appId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const app = await ctx.db.query.apps.findFirst({
        where: and(eq(apps.id, input.appId), eq(apps.orgId, input.orgId)),
      });
      if (!app) throw new TRPCError({ code: "NOT_FOUND" });
      return app;
    }),

  create: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), data: createAppSchema }))
    .mutation(async ({ ctx, input }) => {
      const [app] = await ctx.db
        .insert(apps)
        .values({ ...input.data, orgId: input.orgId })
        .returning();
      return app!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        orgId: z.string().uuid(),
        appId: z.string().uuid(),
        data: updateAppSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [app] = await ctx.db
        .update(apps)
        .set(input.data)
        .where(and(eq(apps.id, input.appId), eq(apps.orgId, input.orgId)))
        .returning();
      if (!app) throw new TRPCError({ code: "NOT_FOUND" });
      return app;
    }),

  delete: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), appId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [app] = await ctx.db
        .delete(apps)
        .where(and(eq(apps.id, input.appId), eq(apps.orgId, input.orgId)))
        .returning();
      if (!app) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true as const };
    }),
});
