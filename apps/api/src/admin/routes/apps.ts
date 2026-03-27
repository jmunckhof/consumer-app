import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { apps } from "@repo/db/schema";
import { createAppSchema, updateAppSchema } from "@repo/validators";
import { adminMiddleware } from "../middleware";

const app = new Hono()
  .use("/*", adminMiddleware)

  .get("/:orgId/apps", async (c) => {
    const { orgId } = c.req.param();
    const result = await db.query.apps.findMany({
      where: eq(apps.orgId, orgId),
      orderBy: (apps, { desc }) => [desc(apps.createdAt)],
    });
    return c.json(result);
  })

  .get("/:orgId/apps/:appId", async (c) => {
    const { orgId, appId } = c.req.param();
    const app_ = await db.query.apps.findFirst({
      where: and(eq(apps.id, appId), eq(apps.orgId, orgId)),
    });
    if (!app_) return c.json({ error: "App not found" }, 404);
    return c.json(app_);
  })

  .post("/:orgId/apps", async (c) => {
    const { orgId } = c.req.param();
    const body = await c.req.json();
    const parsed = createAppSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [created] = await db
      .insert(apps)
      .values({ ...parsed.data, orgId })
      .returning();
    return c.json(created, 201);
  })

  .patch("/:orgId/apps/:appId", async (c) => {
    const { orgId, appId } = c.req.param();
    const body = await c.req.json();
    const parsed = updateAppSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [updated] = await db
      .update(apps)
      .set(parsed.data)
      .where(and(eq(apps.id, appId), eq(apps.orgId, orgId)))
      .returning();

    if (!updated) return c.json({ error: "App not found" }, 404);
    return c.json(updated);
  })

  .delete("/:orgId/apps/:appId", async (c) => {
    const { orgId, appId } = c.req.param();
    const [deleted] = await db
      .delete(apps)
      .where(and(eq(apps.id, appId), eq(apps.orgId, orgId)))
      .returning();

    if (!deleted) return c.json({ error: "App not found" }, 404);
    return c.json({ success: true });
  });

export { app as appsRoutes };
