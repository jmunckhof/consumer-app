import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trpcServer } from "@hono/trpc-server";
import { adminAuth } from "./admin/auth";
import { consumerAuth } from "./consumer/auth";
import { orgsRoutes } from "./admin/routes/orgs";
import { appsRoutes } from "./admin/routes/apps";
import { productsRoutes } from "./admin/routes/products";
import { catalogRoutes } from "./consumer/routes/catalog";
import { profileRoutes } from "./consumer/routes/profile";
import { appRouter } from "@repo/trpc";
import { createContext } from "./trpc/context";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
  })
);
app.use("/*", logger());

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Auth handlers - return Response through Hono so CORS headers are applied
app.on(["POST", "GET"], "/api/admin/auth/**", async (c) => {
  const response = await adminAuth.handler(c.req.raw);
  return new Response(response.body, response);
});
app.on(["POST", "GET"], "/api/consumer/auth/**", async (c) => {
  const response = await consumerAuth.handler(c.req.raw);
  return new Response(response.body, response);
});

// tRPC for admin frontend
app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: (_, c) => createContext(c),
  })
);

// Admin REST routes (kept for consumer API compatibility)
app.route("/api/admin/orgs", orgsRoutes);
app.route("/api/admin/orgs", appsRoutes);
app.route("/api/admin/orgs", productsRoutes);

// Consumer routes
app.route("/api/consumer/catalog", catalogRoutes);
app.route("/api/consumer/profile", profileRoutes);

console.log("🚀 Server running on http://localhost:3000");

export default {
  port: 3000,
  fetch: app.fetch,
};
