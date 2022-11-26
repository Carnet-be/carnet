import { type User } from "@prisma/client";
import { Transporter } from "@utils/nodemailer";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { router, publicProcedure } from "../trpc";

export const ZStaff = z.object({
 username:z.string(),
  email: z.string().email(),
});
export const adminRouter = router({
   getStaff:publicProcedure.query(async({ctx})=>{
        const {prisma}=ctx
        
        const [staffs, demandes] = await prisma.$transaction([
            ctx.prisma.user.findMany({ where: {type:"STAFF"} }),
            ctx.prisma.demandeStaff.findMany(),
          ])
        return {staffs,demandes}
   }),
  demandeStaff: publicProcedure.input(ZStaff).mutation(async ({ input, ctx }) => {
   return await ctx.prisma.demandeStaff.create({
    data:input
   }).then((staff)=>{
       sendDemandeStaff(staff)
   })
  })
 
});

const sendDemandeStaff = async (user: User | { email: string; id: string }) => {
  await Transporter.sendMail({
    to: user.email,
    from: process.env.ADMINS_EMAIL,
    subject: `Compte staff chez CARNET`,
    html: `<div><h3>Vous venez d'avoir un compte staff sur CARNET, veuillez compléter votre compte : </h3> <a href="${getBaseUrl()}/pages/newStaff?id=${
      user.id
    }">compléter ici</a></div>`,
  });
};
