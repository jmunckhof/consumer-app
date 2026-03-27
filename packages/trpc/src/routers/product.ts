import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { products } from "@repo/db/schema";
import { createProductSchema, updateProductSchema } from "@repo/validators";
import { router, protectedProcedure } from "../trpc";

export const productRouter = router({
  list: protectedProcedure
    .input(z.object({ orgId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findMany({
        where: eq(products.orgId, input.orgId),
        orderBy: (products, { desc }) => [desc(products.createdAt)],
      });
    }),

  byId: protectedProcedure
    .input(
      z.object({ orgId: z.string().uuid(), productId: z.string().uuid() })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: and(
          eq(products.id, input.productId),
          eq(products.orgId, input.orgId)
        ),
      });
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });
      return product;
    }),

  create: protectedProcedure
    .input(z.object({ orgId: z.string().uuid(), data: createProductSchema }))
    .mutation(async ({ ctx, input }) => {
      const [product] = await ctx.db
        .insert(products)
        .values({ ...input.data, orgId: input.orgId })
        .returning();
      return product!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        orgId: z.string().uuid(),
        productId: z.string().uuid(),
        data: updateProductSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [product] = await ctx.db
        .update(products)
        .set(input.data)
        .where(
          and(
            eq(products.id, input.productId),
            eq(products.orgId, input.orgId)
          )
        )
        .returning();
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });
      return product;
    }),

  delete: protectedProcedure
    .input(
      z.object({ orgId: z.string().uuid(), productId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      const [product] = await ctx.db
        .delete(products)
        .where(
          and(
            eq(products.id, input.productId),
            eq(products.orgId, input.orgId)
          )
        )
        .returning();
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true as const };
    }),
});
