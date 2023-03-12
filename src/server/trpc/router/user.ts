import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import bcrypt from 'bcrypt';
import { bcryptHash } from "@utils/bcrypt";
import { TMessage } from "@repository/index";

export const userRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session?.user?.email || "",
      },
      include: { image: true },
    });
  }),
  // getUserForNotif: publicProcedure.query(async ({ ctx }) => {
  //   return await ctx.prisma.user.findUnique({
  //     where: {
  //       email: ctx.session?.user?.email || "",
  //     },
  //   });
  // }),
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
        current: z.string(),
        old: z.string(),
        newPwd: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const isSame=await bcrypt.compare(input.old,input.current)
      if(!isSame) throw new Error("Old password is not correct")
      const hash=(await bcryptHash(input.newPwd)) as string
      return await ctx.prisma.user.update({
        where: { email: ctx.session?.user?.email || "" },
        data: {
          password:hash
        },
      });
    }),
    removePhoto: publicProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.prisma.user.update({
        where: { email: ctx.session?.user?.email || "" },
        data: {
          image: {
            delete: true,
          },
        },
      });
    }
    ),
    getUsersFromMessages: publicProcedure
    .input(z.array(z.any())).query(async ({input,ctx})=>{
      let idUsers:string[]=input.filter((el:TMessage)=>{
          if(el.sender=="ADMIN" || el.receiver=="ADMIN"){
            return true
          }
          return false
      }).map((el:TMessage)=>{
        if(el.sender=="ADMIN"){
          return el.receiver
        }
        return el.sender
      })

      idUsers=[...new Set(idUsers)]
      return await ctx.prisma.user.findMany({
        where:{
          id:{
            in:idUsers
          }
        },
        include:{
          image:true
        }
      }).then((res)=>{
        return res.map((el)=>{
          return {
            ...el,
            messages:(input as TMessage[]).filter((el2:TMessage)=>{
              if(el2.sender==el.id || el2.receiver==el.id){
                return true
              }
              return false
            })
          }
        })
      })
    })

});
