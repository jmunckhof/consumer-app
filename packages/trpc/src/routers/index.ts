import { router } from "../trpc";
import { orgRouter } from "./org";
import { appRouter as appCrudRouter } from "./app";
import { categoryRouter } from "./category";
import { productRouter } from "./product";

export const appRouter = router({
  org: orgRouter,
  app: appCrudRouter,
  category: categoryRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
