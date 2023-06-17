import { publicProcedure, router } from "../trpc";
import z from "zod";

export const entrepriseRouter = router({
  setGarage: publicProcedure
    .input(
      z.object({
        description: z.string(),
        name: z.string(),
        cover: z.string(),
        logo: z.string(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { description, name, cover, logo } = input;
      return await ctx.prisma.garage.upsert({
        where: {
          user_id: input.user_id,
        },
        update: {
          description,
          name,
          cover,
          logo,
        },
        create: {
          description,
          name,
          cover,
          logo,
          user_id: input.user_id,
        },
      });
    }),
});
