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
        slug: z.string(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { description, name, cover, logo, slug } = input;
      return await ctx.prisma.garage.upsert({
        where: {
          user_id: input.user_id,
        },
        update: {
          description,
          name,
          cover,
          logo,
          slug,
        },
        create: {
          description,
          name,
          cover,
          logo,
          slug,
          user_id: input.user_id,
        },
      });
    }),
  isSlugTaken: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { slug, id } = input;
      const garage = await ctx.prisma.garage.count({
        where: {
          slug,
          id: {
            not: id,
          },
        },
      });
      return garage > 0;
    }),
});
