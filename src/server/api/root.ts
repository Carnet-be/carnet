import { publicRouter } from "~/server/api/routers/public";
import { createTRPCRouter } from "~/server/api/trpc";
import { boCarsRouter } from "./routers/bo/cars";
import { boGarageRouter } from "./routers/bo/garages";
import { boUserRouter } from "./routers/bo/users";
import { carRouter } from "./routers/car";
import { garageRouter } from "./routers/garage";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  public: publicRouter,
  car: carRouter,
  garage: garageRouter,
  profile: profileRouter,
  bo: createTRPCRouter({
    car: boCarsRouter,
    garage: boGarageRouter,
    user: boUserRouter,
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
