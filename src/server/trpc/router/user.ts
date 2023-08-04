import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { bcryptHash } from "@utils/bcrypt";
import { TMessage } from "@repository/index";
import type { Currency, Language } from "@prisma/client";
import moment from "moment";

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
        // nomEntreprise: z.string().nullable(),
        address: z.string().nullable(),
        city: z.string().nullable(),
        country: z.string().nullable(),
        zipCode: z.string().nullable(),
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
      const isSame = await bcrypt.compare(input.old, input.current);
      if (!isSame) throw new Error("Old password is not correct");
      const hash = (await bcryptHash(input.newPwd)) as string;
      return await ctx.prisma.user.update({
        where: { email: ctx.session?.user?.email || "" },
        data: {
          password: hash,
        },
      });
    }),
  removePhoto: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.update({
      where: { email: ctx.session?.user?.email || "" },
      data: {
        image: {
          delete: true,
        },
      },
    });
  }),
  search: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return await ctx.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: input,
            },
          },
          {
            email: {
              contains: input,
            },
          },
          {
            id: {
              contains: input.replaceAll(" ", "").replaceAll("#", ""),
            },
          },
        ],
        type: {
          in: ["AUC", "BID"],
        },
        isActive: true,
      },
      include: {
        image: true,
      },
    });
  }),
  getUsersFromMessages: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findMany({
        where: {
          id: {
            in: input,
          },
        },
        include: {
          image: true,
        },
      });
    }),

  changeLang: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session?.user?.email)
        return await ctx.prisma.user.update({
          where: { email: ctx.session?.user?.email || "" },
          data: {
            lang: input as Language,
          },
        });
      return {
        lang: input,
      };
    }),

  changeCurrency: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user
        .update({
          where: { email: ctx.session?.user?.email || "" },
          data: {
            currency: input as Currency,
          },
        })
        .then((user) => user.currency);
    }),

  checkPro: publicProcedure.query(async ({ ctx }) => {
    const pros = await ctx.prisma.activationPro.findMany({
      where: {
        user: {
          email: ctx.session?.user?.email || "",
        },
      },
      orderBy: {
        createAt: "desc",
      },
    });
    if (pros.length <= 0) {
      return false;
    }

    const last = pros[0];
    if (!last) return false;
    const now = new Date();
    const isPro = now.getTime() < last.expireAt.getTime();
    console.log("isPro", isPro);
    return isPro;
  }),

  upgradeToPro: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        unit: z.number(),
        cycle: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user_id, unit, cycle } = input;

      const expireAt = moment().add(cycle, "months").toDate();
      console.log("expireAt", expireAt);

      const activation = await ctx.prisma.activationPro.create({
        data: {
          user_id,
          amount: unit * cycle,
          expireAt,
          cycle,
          unit,
        },
      });
      return activation;
    }),

  downgradeToPro: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const last = await ctx.prisma.activationPro.findFirst({
        where: {
          user_id: input,
        },
        orderBy: {
          createAt: "desc",
        },
      });
      if (last) {
        const activation = await ctx.prisma.activationPro.update({
          where: {
            id: last.id,
          },

          data: {
            expireAt: new Date(),
          },
        });
        return activation;
      }
      return null;
    }),
});
