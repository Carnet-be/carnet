import { Prisma, PrismaClient } from "@prisma/client";
import { ProcessUser } from "@utils/processUser";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const messageRouter = router({
  getMessagesClient: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.internalMessage.findMany({
      where: {
        client: {
          email: ctx.session?.user?.email || "",
        },
      },orderBy:{
        createAt:'desc'
      },
      include:{
        client:{
            include:{
                image:true
            }
        }
      }

    });
  }),
  getMessagesAdmin: publicProcedure.input(z.string()).query(async ({ input,ctx }) => {
    return await ctx.prisma.internalMessage.findMany({
      where: {
        client_id:input
      },orderBy:{
        createAt:'desc'
      }
    });
  }),
  sendToAdmin: publicProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.internalMessage.create({
        data: {
         isRead:true,
          content: input.message,
          client: {
            connect: {
              email: ctx.session?.user?.email || "",
            },
          },
        },
      });
    }),
    sendToClient: publicProcedure
    .input(
      z.object({
        message: z.string(),
        client_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.internalMessage.create({
        data: {
          type:'admin',
        isReadByAdmin:true,
          content: input.message,
          client: {
            connect: {
              email: input.client_id,
            },
          },
        },
      });
    }),
});
