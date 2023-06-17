/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppSettings, Prisma, PrismaClient, type User } from "@prisma/client";
import * as trpc from "@trpc/server";
import { Transporter } from "@utils/nodemailer";
import { hash } from "bcrypt";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { router, publicProcedure } from "../trpc";
import { sendNotification } from "@repository/index";
import { v4 as uuid } from "uuid";
import { render } from "@react-email/render";
import EmailVerifyEmail from "@ui/emails/verify-email";
import EmailResetPassword from "@ui/emails/reset-password";
import { TNotification } from "@model/type";

import user from "../../../pages/dashboard/user";
import DefaultEmailNotification from "@ui/emails/defaultTemplate";
import { CARROSSERIE } from "@data/internal";
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
          await ctx.prisma.token
            .create({
              data: {
                user_id: res.id,
                type: "EMAIL_CONFIRM",
                value: uuid(),
                //expired in one day
                expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              },
            })
            .then(async (token) => {
              await sendVerifEmail(res.username, res.email, token.id);
            });
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
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }
      await ctx.prisma.token.deleteMany({
        where: {
          user_id: user.id,
          type: "EMAIL_CONFIRM",
        },
      });
      return await ctx.prisma.token
        .create({
          data: {
            user_id: user.id,
            type: "EMAIL_CONFIRM",
            value: uuid(),
            //expired in one day
            expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        })
        .then(async (token) => {
          await sendVerifEmail(user.username, user.email, token.id);
        });
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

      return await Transporter.sendMail({
        to: user.email,
        from: process.env.ADMINS_EMAIL,
        subject: "Link to reset your password",
        html: render(
          EmailResetPassword({
            username: user.username,
            baseUrl: getBaseUrl(),
            verify_link: `${getBaseUrl()}/pages/resetPassword?token=${
              token.id
            }`,
          })
        ),
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

const sendVerifEmail = async (
  username: string,
  email: string,
  tokenId: string
) => {
  // baseUrl: string;
  // username: string;
  // verify_link: string;
  await Transporter.sendMail({
    to: email,
    from: process.env.ADMINS_EMAIL,
    subject: `Confirmez l'inscription chez CARNET`,
    html: render(
      EmailVerifyEmail({
        baseUrl: getBaseUrl(),
        username,
        verify_link: `${getBaseUrl()}/pages/email-verified?token=${tokenId}`,
      })
    ),
  });
};

export const sendEmailNotification = async (
  notification: TNotification,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  const result = await setupEmailNotifications(
    notification as unknown as TNotification,
    prisma
  );

  Transporter.sendMail({
    to: result.receiver,
    from: process.env.ADMINS_EMAIL,
    subject: result.title,
    html: render(
      DefaultEmailNotification({
        title: result.title,
        description: result.body,
        link: result.link,
        baseUrl: getBaseUrl(),
      })
    ),
  }).catch((err) => {
    console.log(err);
  });
};

async function setupEmailNotifications(
  notification: TNotification,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<{ title: string; body: string; link: string; receiver: string[] }> {
  const content: {
    title: string;
    body: string;
    link: string;
    receiver: string[];
  } = {
    title: "",
    body: "",
    link: "#",
    receiver: [],
  };
  ////
  let title = "";
  switch (notification.type) {
    case "new auction":
      content.title = "New Auction";
      content.body =
        "A new auction that corresponds to your interests has been added";
      content.link = "/dashboard/user/auctions/" + notification.auction_id;

      const auction = await prisma.auction.findUnique({
        where: { id: notification.auction_id },
        include: {
          specs: true,
        },
      });
      if (auction) {
        console.log(CARROSSERIE[auction.specs?.carrosserie || 0]?.title);
        const users = await prisma.user.findMany({
          where: {
            interest: {
              carrosserie: {
                contains: CARROSSERIE[auction.specs?.carrosserie || 0]?.title,
              },
              OR: {
                brands: {
                  some: {
                    name: auction.brand,
                  },
                },
                models: {
                  some: {
                    name: auction.model,
                  },
                },
              },
            },
          },
          select: {
            email: true,
          },
        });
        console.table(users);
        content.receiver = users.map((user) => user.email);
      }
      break;
    case "auction modified":
      title = "";
      switch (notification.type_2) {
        case "pause":
          title = "Auction Paused";
          break;
        case "resume":
          title = "Auction Resumed";
          break;
        case "edit":
          title = "Auction Edited";
          break;
        case "delete":
          title = "Auction Deleted";
          break;
        case "published":
          title = "Auction Published";
          break;
        case "republished":
          title = "Auction Republished";
          break;
        case "add time":
          title = "Auction extended";
          break;
        case "cancel winner":
          title = "Auction winner canceled";
          break;
        default:
          title = notification.type_2;
          break;
      }
      content.title = title;
      content.body = `${notification.auction_name} (#${notification.auction_id})`;
      content.link = "/dashboard/entreprise/auction/" + notification.auction_id;
      const auctionniare_email =
        (await prisma.user
          .findUnique({
            where: { id: notification.auctionnaire_id },
            select: { email: true },
          })
          .then((user) => user?.email)) || "";
      content.receiver = [auctionniare_email];
      break;

    // case "new message":
    //   content.title = t(notification.type);
    //   content.body = `${notification.content}`;
    //   if (user?.type === "AUC") {
    //     content.link = `/dashboard/entreprise/chat`;
    //   }
    //   if (user?.type === "BID") {
    //     content.link = `/dashboard/user/chat`;
    //   }
    //   if (user?.type === "ADMIN") {
    //     content.link = `/admin/dashboard/chat`;
    //   }
    //   break;

    default:
      break;
  }
  return content;
}
