import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { products } from "@repo/db/schema";
import { consumerMiddleware } from "../middleware";

const app = new Hono()
  .use("/*", consumerMiddleware)

  .get("/", async (c) => {
    const orgId = c.get("orgId");
    const result = await db.query.products.findMany({
      where: and(eq(products.orgId, orgId), eq(products.isActive, true)),
      orderBy: (products, { asc }) => [asc(products.name)],
    });
    return c.json(result);
  })

  .get("/:productId", async (c) => {
    const orgId = c.get("orgId");
    const { productId } = c.req.param();
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, productId),
        eq(products.orgId, orgId),
        eq(products.isActive, true)
      ),
    });
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
  });

export { app as catalogRoutes };
