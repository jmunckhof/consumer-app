import { createMiddleware } from "hono/factory";
import { consumerAuth } from "./auth";

type ConsumerEnv = {
  Variables: {
    consumer: typeof consumerAuth.$Infer.Session.user;
    consumerSession: typeof consumerAuth.$Infer.Session.session;
    orgId: string;
  };
};

export const consumerMiddleware = createMiddleware<ConsumerEnv>(
  async (c, next) => {
    const session = await consumerAuth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("consumer", session.user);
    c.set("consumerSession", session.session);
    c.set("orgId", (session.user as any).orgId);
    await next();
  }
);
