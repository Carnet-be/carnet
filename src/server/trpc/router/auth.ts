import { type User } from "@prisma/client";
import * as trpc from "@trpc/server";
import { Transporter } from "@utils/nodemailer";
import { hash } from "bcrypt";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { router, publicProcedure } from "../trpc";

export const ZSignup = z.object({
  username:z.string(),
  tel: z.string(),
  email: z.string(),
  nom_entreprise: z.string().nullish(),
  password: z.string(),
  type: z.enum(["BID", "AUC", "ADMIN", "STAFF"]),
});
export const authRouter = router({

  signUp: publicProcedure.input(ZSignup).mutation(async ({ input, ctx }) => {
    console.log("input signup", input);

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
