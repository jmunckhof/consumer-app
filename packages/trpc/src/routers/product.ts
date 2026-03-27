import { z } from "zod";
import { and, eq, ilike, or, sql, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { products, productVariants, categories } from "@repo/db/schema";
import {
  createProductSchema,
  updateProductSchema,
  createProductVariantSchema,
  updateProductVariantSchema,
} from "@repo/validators";
import { router, protectedProcedure } from "../trpc";

export const productRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        orgId: z.string().uuid(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(25),
        search: z.string().optional(),
        categoryId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { orgId, page, pageSize, search, categoryId } = input;
      const offset = (page - 1) * pageSize;

      const conditions = [eq(products.orgId, orgId)];

      if (categoryId) {
        conditions.push(eq(products.categoryId, categoryId));
      }

      if (search) {
        const pattern = `%${search}%`;
        conditions.push(
          or(
            ilike(products.name, pattern),
            ilike(products.sku, pattern),
            ilike(products.slug, pattern)
          )!
        );
      }

      const where = and(...conditions);

      const [items, [total]] = await Promise.all([
        ctx.db.query.products.findMany({
          where,
          with: { category: true },
          orderBy: (products, { asc }) => [
            asc(products.sortOrder),
            asc(products.name),
          ],
          limit: pageSize,
          offset,
        }),
        ctx.db.select({ count: count() }).from(products).where(where),
      ]);

      return {
        items,
        total: total?.count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((total?.count ?? 0) / pageSize),
      };
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
        with: { category: true, variants: true },
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

  // Variant operations
  addVariant: protectedProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        data: createProductVariantSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [variant] = await ctx.db
        .insert(productVariants)
        .values({ ...input.data, productId: input.productId })
        .returning();
      return variant!;
    }),

  updateVariant: protectedProcedure
    .input(
      z.object({
        variantId: z.string().uuid(),
        data: updateProductVariantSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [variant] = await ctx.db
        .update(productVariants)
        .set(input.data)
        .where(eq(productVariants.id, input.variantId))
        .returning();
      if (!variant) throw new TRPCError({ code: "NOT_FOUND" });
      return variant;
    }),

  deleteVariant: protectedProcedure
    .input(z.object({ variantId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [variant] = await ctx.db
        .delete(productVariants)
        .where(eq(productVariants.id, input.variantId))
        .returning();
      if (!variant) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true as const };
    }),
});
