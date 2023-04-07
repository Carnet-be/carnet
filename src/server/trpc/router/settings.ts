import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const appSettingsRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.appSettings.findFirst();
  }),
  update: publicProcedure.input(z.any()).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.appSettings.upsert({
      where: {
        id: "appSettings",
      },
      create: {
        ...input,
      },
      update: {
        ...input,
      },
    });
  }),
});
