import type { Context } from "hono";
import type { TRPCContext } from "@repo/trpc";
import { adminAuth } from "../admin/auth";
import { db } from "../lib/db";

export async function createContext(c: Context): Promise<TRPCContext> {
  const session = await adminAuth.api.getSession({
    headers: c.req.raw.headers,
  });

  return {
    db,
    session: session
      ? { user: session.user as any, session: session.session as any }
      : null,
  };
}
