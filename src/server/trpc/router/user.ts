import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session?.user?.email || "",
      },
      include: { image: true },
    });
  }),
  update: publicProcedure

    .input(
      z.object({
        username: z.string(),
        tel: z.string().nullable(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.update({
        where: { email: ctx.session?.user?.email || "" },
        data: {
          ...input,
        },
      });
    }),
  addPhoto: publicProcedure
    .input(
      z.object({
        url: z.string(),
        fileKey: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.update({
        where: { email: ctx.session?.user?.email || "" },
        data: {
          image: {
            create: input,
          },
        },
      });
    }),
  
    changePwd: publicProcedure
    .input(
      z.object({
        newPwd: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      
      return await ctx.prisma.user.update({
        where: { email: ctx.session?.user?.email || "" },
        data: {
          password:input.newPwd
        },
      });
    })
});
