
import { router, publicProcedure } from "../trpc";


export const userRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user
      .findUnique({where:{
        email:ctx.session?.user?.email||""
      },include:{image:true}})
  }),
  
});
