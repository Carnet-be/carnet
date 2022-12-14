import { router } from "../trpc";
import { adminRouter } from "./admin";
import { auctionnaireRouter } from "./auctionnaire";
import { authRouter } from "./auth";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user:userRouter,
  admin:adminRouter,
  auctionnaire:auctionnaireRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
