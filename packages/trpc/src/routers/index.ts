import { router } from "../trpc";
import { orgRouter } from "./org";
import { appRouter as appCrudRouter } from "./app";
import { productRouter } from "./product";

export const appRouter = router({
  org: orgRouter,
  app: appCrudRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
