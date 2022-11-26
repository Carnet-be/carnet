import { type User } from "@prisma/client";
import * as trpc from "@trpc/server";
import { Transporter } from "@utils/nodemailer";
import { hash } from "bcrypt";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { router, publicProcedure } from "../trpc";


const ZSignup=z.object({
  username: z.string(),
  tel: z.string(),
  email: z.string(),
  nom_entreprise: z.string().nullish(),
  password: z.string(),
  type: z.enum(["BID", "AUC", "ADMIN", "STAFF"]),
})
export const ZAddStuff = z.object(
  {
    idDemande:z.string(),
    data:ZSignup
  }
);
export const authRouter = router({
  signUp: publicProcedure.input(ZSignup).mutation(async ({ input, ctx }) => {
    const exist = await ctx.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });
    if (exist) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "Cet email est déjà utilisé par un autre compte",
      });
    }

    const hashPwd = await hash(input.password, 10);
    return await ctx.prisma.user
      .create({
        data: {
          ...input,
          password: hashPwd,
        },
      })
      .then(async (res) => {
        await sendVerifEmail(res);
        return res;
      });
  }),
  addStaff: publicProcedure.input(ZAddStuff).mutation(async ({ input, ctx }) => {
    const {idDemande:id,data}=input
    const hashPwd = await hash(data.password, 10);
    return await ctx.prisma.$transaction([
      ctx.prisma.demandeStaff.delete({where:{id}}),
      ctx.prisma.user.create({
        data: {
          ...data,
          password: hashPwd,
          emailVerified: true,
        },
      }),
    ]);
  }),
  resendVerif: publicProcedure
    .input(z.object({ email: z.string(), id: z.string() }))
    .mutation(async ({ input }) => {
      return await sendVerifEmail(input);
    }),
});

const sendVerifEmail = async (user: User | { email: string; id: string }) => {
  await Transporter.sendMail({
    to: user.email,
    from: process.env.ADMINS_EMAIL,
    subject: `Confirmez l'inscription chez CARNET`,
    html: `<div><h3>Votre compte est créé, pour finaliser, vous devez confirmer votre email </h3> <a href="${getBaseUrl()}/api/verify?id=${
      user.id
    }">${getBaseUrl()}/api/verify?id=${user.id}</a></div>`,
  });
};
