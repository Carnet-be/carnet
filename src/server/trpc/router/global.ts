import { Prisma, PrismaClient } from "@prisma/client";
import { ProcessUser } from "@utils/processUser";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const globalRouter = router({
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
        table: z.enum(["auction", "user"]),
        moreCondition: z.any().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await (ctx.prisma[input.table] as any).delete({
        where: { id: input.id, ...input.moreCondition },
      });
    }),
  deleteUser: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.$transaction([
        ctx.prisma.user.delete({ where: { id: input } }),
        ctx.prisma.token.deleteMany({ where: { user_id: input } }),
      ]);
    }),
});
