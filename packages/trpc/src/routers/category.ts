import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { categories } from "@repo/db/schema";
import { createCategorySchema, updateCategorySchema } from "@repo/validators";
import { router, protectedProcedure } from "../trpc";

export const categoryRouter = router({
  list: protectedProcedure
    .input(z.object({ orgId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.categories.findMany({
        where: eq(categories.orgId, input.orgId),
        orderBy: (categories, { asc }) => [asc(categories.sortOrder), asc(categories.name)],
      });
    }),

  byId: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), categoryId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: and(
          eq(categories.id, input.categoryId),
          eq(categories.orgId, input.orgId)
        ),
      });
      if (!category) throw new TRPCError({ code: "NOT_FOUND" });
      return category;
    }),

  create: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), data: createCategorySchema }))
    .mutation(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .insert(categories)
        .values({ ...input.data, orgId: input.orgId })
        .returning();
      return category!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        orgId: z.string().uuid(),
        categoryId: z.string().uuid(),
        data: updateCategorySchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .update(categories)
        .set(input.data)
        .where(
          and(
            eq(categories.id, input.categoryId),
            eq(categories.orgId, input.orgId)
          )
        )
        .returning();
      if (!category) throw new TRPCError({ code: "NOT_FOUND" });
      return category;
    }),

  delete: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), categoryId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .delete(categories)
        .where(
          and(
            eq(categories.id, input.categoryId),
            eq(categories.orgId, input.orgId)
          )
        )
        .returning();
      if (!category) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true as const };
    }),
});
