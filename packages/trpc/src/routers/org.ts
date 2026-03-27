import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { orgs } from "@repo/db/schema";
import { createOrgSchema, updateOrgSchema } from "@repo/validators";
import { router, protectedProcedure } from "../trpc";

export const orgRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.orgs.findMany({
      orderBy: (orgs, { desc }) => [desc(orgs.createdAt)],
    });
  }),

  byId: protectedProcedure
    .input(z.object({ orgId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const org = await ctx.db.query.orgs.findFirst({
        where: eq(orgs.id, input.orgId),
      });
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      return org;
    }),

  create: protectedProcedure
    .input(createOrgSchema)
    .mutation(async ({ ctx, input }) => {
      const [org] = await ctx.db.insert(orgs).values(input).returning();
      return org!;
    }),

  update: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), data: updateOrgSchema }))
    .mutation(async ({ ctx, input }) => {
      const [org] = await ctx.db
        .update(orgs)
        .set(input.data)
        .where(eq(orgs.id, input.orgId))
        .returning();
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      return org;
    }),

  delete: protectedProcedure
    .input(z.object({ orgId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [org] = await ctx.db
        .delete(orgs)
        .where(eq(orgs.id, input.orgId))
        .returning();
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true as const };
    }),
});
