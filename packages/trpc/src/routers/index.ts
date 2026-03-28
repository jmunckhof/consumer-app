import { router } from "../trpc";
import { orgRouter } from "./org";
import { appRouter as appCrudRouter } from "./app";
import { categoryRouter } from "./category";
import { productRouter } from "./product";
import { storeRouter } from "./store";

export const appRouter = router({
  org: orgRouter,
  app: appCrudRouter,
  category: categoryRouter,
  product: productRouter,
  store: storeRouter,
});

export type AppRouter = typeof appRouter;
