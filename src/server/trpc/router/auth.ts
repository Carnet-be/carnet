
import * as trpc from "@trpc/server";
import { hash } from "bcrypt";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const ZSignup=z.object({
  nom:z.string(),
  prenom:z.string(),
  tel:z.string(),
  email:z.string(),
  nom_entreprise:z.string().nullish(),
  password:z.string(),
  type:z.enum(["BID","AUC","ADMIN","STAFF"])
})
export const authRouter = router({
  signUp: publicProcedure.input(ZSignup)
  .mutation(async({input, ctx }) => {
    console.log("input signup",input)

    const exist=await ctx.prisma.user.findFirst({
      where:{
        email:input.email
      }
    })
    if(exist){
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "Cet email est déjà utilisé par un autre compte",
        })
    }

    const hashPwd=await hash(input.password, 10);
    return await ctx.prisma.user.create({data:{
      ...input,
      password:hashPwd
    }})
  }),
  
});
