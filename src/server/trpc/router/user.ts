import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { bcryptHash } from "@utils/bcrypt";
import { TMessage } from "@repository/index";
import { Language } from "@prisma/client";

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
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: input,
              mode: "insensitive",
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
      return await ctx.prisma.user.update({
        where: { email: ctx.session?.user?.email || "" },
        data: {
          lang: input as Language,
        },
      });
    }),
});
