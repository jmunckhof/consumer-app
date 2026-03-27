import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { orgs } from "@repo/db/schema";
import { createOrgSchema, updateOrgSchema } from "@repo/validators";
import { adminMiddleware } from "../middleware";

const app = new Hono()
  .use("/*", adminMiddleware)

  .get("/", async (c) => {
    const result = await db.query.orgs.findMany({
      orderBy: (orgs, { desc }) => [desc(orgs.createdAt)],
    });
    return c.json(result);
  })

  .get("/:orgId", async (c) => {
    const { orgId } = c.req.param();
    const org = await db.query.orgs.findFirst({
      where: eq(orgs.id, orgId),
    });
    if (!org) return c.json({ error: "Org not found" }, 404);
    return c.json(org);
  })

  .post("/", async (c) => {
    const body = await c.req.json();
    const parsed = createOrgSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [org] = await db.insert(orgs).values(parsed.data).returning();
    return c.json(org, 201);
  })

  .patch("/:orgId", async (c) => {
    const { orgId } = c.req.param();
    const body = await c.req.json();
    const parsed = updateOrgSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [org] = await db
      .update(orgs)
      .set(parsed.data)
      .where(eq(orgs.id, orgId))
      .returning();

    if (!org) return c.json({ error: "Org not found" }, 404);
    return c.json(org);
  })

  .delete("/:orgId", async (c) => {
    const { orgId } = c.req.param();
    const [org] = await db
      .delete(orgs)
      .where(eq(orgs.id, orgId))
      .returning();

    if (!org) return c.json({ error: "Org not found" }, 404);
    return c.json({ success: true });
  });

export { app as orgsRoutes };
