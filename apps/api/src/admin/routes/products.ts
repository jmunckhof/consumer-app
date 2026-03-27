import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { products } from "@repo/db/schema";
import { createProductSchema, updateProductSchema } from "@repo/validators";
import { adminMiddleware } from "../middleware";

const app = new Hono()
  .use("/*", adminMiddleware)

  .get("/:orgId/products", async (c) => {
    const { orgId } = c.req.param();
    const result = await db.query.products.findMany({
      where: eq(products.orgId, orgId),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
    return c.json(result);
  })

  .get("/:orgId/products/:productId", async (c) => {
    const { orgId, productId } = c.req.param();
    const product = await db.query.products.findFirst({
      where: and(eq(products.id, productId), eq(products.orgId, orgId)),
    });
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
  })

  .post("/:orgId/products", async (c) => {
    const { orgId } = c.req.param();
    const body = await c.req.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [product] = await db
      .insert(products)
      .values({ ...parsed.data, orgId })
      .returning();
    return c.json(product, 201);
  })

  .patch("/:orgId/products/:productId", async (c) => {
    const { orgId, productId } = c.req.param();
    const body = await c.req.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [product] = await db
      .update(products)
      .set(parsed.data)
      .where(and(eq(products.id, productId), eq(products.orgId, orgId)))
      .returning();

    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
  })

  .delete("/:orgId/products/:productId", async (c) => {
    const { orgId, productId } = c.req.param();
    const [product] = await db
      .delete(products)
      .where(and(eq(products.id, productId), eq(products.orgId, orgId)))
      .returning();

    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json({ success: true });
  });

export { app as productsRoutes };
