import { createMiddleware } from "hono/factory";
import { adminAuth } from "./auth";

type AdminEnv = {
  Variables: {
    adminUser: typeof adminAuth.$Infer.Session.user;
    adminSession: typeof adminAuth.$Infer.Session.session;
  };
};

export const adminMiddleware = createMiddleware<AdminEnv>(async (c, next) => {
  const session = await adminAuth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("adminUser", session.user);
  c.set("adminSession", session.session);
  await next();
});
