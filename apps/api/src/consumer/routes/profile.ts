import { Hono } from "hono";
import { consumerMiddleware } from "../middleware";

const app = new Hono()
  .use("/*", consumerMiddleware)

  .get("/", async (c) => {
    const consumer = c.get("consumer");
    return c.json(consumer);
  });

export { app as profileRoutes };
