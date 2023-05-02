import { AppSettings, type User } from "@prisma/client";
import * as trpc from "@trpc/server";
import { Transporter } from "@utils/nodemailer";
import { hash } from "bcrypt";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { router, publicProcedure } from "../trpc";
import { sendNotification } from "@repository/index";
import { v4 as uuid } from "uuid";
const ZSignup = z.object({
  username: z.string(),
  tel: z.string().optional(),
  email: z.string(),
  nom_entreprise: z.string().nullish(),
  password: z.string(),
  setEmailVerified: z.boolean().nullish(),
  type: z.enum(["BID", "AUC", "ADMIN", "STAFF"]),
});
export const ZAddStuff = z.object({
  idDemande: z.string(),
  data: ZSignup,
});
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
    const { setEmailVerified } = input;
    delete input.setEmailVerified;

    let id = Math.random().toString().slice(2, 9);
    let incorrectId = true;
    while (incorrectId) {
      const count = await ctx.prisma.user.count({ where: { id } });
      if (count === 0) {
        incorrectId = false;
      } else {
        id = Math.random().toString().slice(2, 9);
      }
    }
    const type = input.type;
    const settings: AppSettings | null =
      await ctx.prisma.appSettings.findFirst();

    const isActive =
      type !== "BID"
        ? true
        : settings
        ? !settings.confirmNewBidderAccount
        : false;
    return await ctx.prisma.user
      .create({
        data: {
          id,
          ...input,
          isActive,
          emailVerified: setEmailVerified ? true : false,
          password: hashPwd,
        },
      })
      .then(async (res) => {
        if (!setEmailVerified) {
          await sendVerifEmail(res);
        }
        return res;
      })
      .then((user) => {
        sendNotification({
          type: "new user",
          date: new Date(),
          type_2: user.type,
          user_id: user.id,
          user_type: user.type,
        });
        return user;
      });
  }),
  addStaff: publicProcedure
    .input(ZAddStuff)
    .mutation(async ({ input, ctx }) => {
      const { idDemande: id, data } = input;
      const hashPwd = await hash(data.password, 10);
      let idStaff = Math.random().toString().slice(2, 9);
      let incorrectId = true;
      while (incorrectId) {
        const count = await ctx.prisma.user.count({ where: { id: idStaff } });
        if (count === 0) {
          incorrectId = false;
        } else {
          idStaff = Math.random().toString().slice(2, 9);
        }
      }
      return await ctx.prisma.$transaction([
        ctx.prisma.demandeStaff.delete({ where: { id } }),
        ctx.prisma.user.create({
          data: {
            id: idStaff,
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

  cancelSignIn: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.delete({
      where: { email: ctx.session?.user?.email || "" },
    });
  }),
  sendEmailPasswordForget: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input },
      });
      if (!user)
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      const token = await ctx.prisma.token.create({
        data: {
          user_id: user.id,
          type: "PASSWORD_FORGET",
          value: uuid(),
          //expired in one day
          expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      const getSubjectByLang = (lang?: string) => {
        switch (lang) {
          case "ar":
            return "إعادة تعيين كلمة المرور";
          case "fr":
            return "Réinitialiser votre mot de passe";
          default:
            return "Reset your password";
        }
      };
      const getBodyByLang = (lang?: string) => {
        switch (lang) {
          case "ar":
            return `<div><h3>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك ، يرجى النقر على الرابط التالي: </h3> <a href="${getBaseUrl()}/pages/resetPassword?token=${
              token.id
            }">إعادة تعيين هنا</a></div>`;

          case "fr":
            return `<div><h3>Vous avez demandé à réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : </h3> <a href="${getBaseUrl()}/pages/resetPassword?token=${
              token.id
            }">réinitialiser ici</a></div>`;

          default:
            return `<div><h3>You have requested to reset your password, please click on the following link : </h3> <a href="${getBaseUrl()}/pages/resetPassword?token=${
              token.id
            }">reset here</a></div>`;
        }
      };
      return await Transporter.sendMail({
        to: user.email,
        from: process.env.ADMINS_EMAIL,
        subject: getSubjectByLang(user.lang),
        html: getBodyByLang(user.lang),
      });
    }),

  resetPassword: publicProcedure
    .input(
      z.object({ token: z.string(), password: z.string(), user_id: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      const hashPwd = await hash(input.password, 10);
      return await ctx.prisma.$transaction([
        ctx.prisma.token.delete({ where: { id: input.token } }),
        ctx.prisma.user.update({
          where: { id: input.user_id },
          data: { password: hashPwd },
        }),
      ]);
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
