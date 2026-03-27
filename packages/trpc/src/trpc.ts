import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Database } from "@repo/db";

export type TRPCContext = {
  db: Database;
  session: {
    user: { id: string; email: string; name: string };
    session: { id: string };
  } | null;
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});
