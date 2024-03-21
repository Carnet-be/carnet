import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const boUserRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page = 1, search } = input;
      const limit = 20;
      const offset = (page - 1) * limit;
      const orgs = await clerkClient.users.getUserList({
        limit,
        offset: offset,
        query: search,
      });
      const count = await clerkClient.users.getCount();
      return {
        data: orgs,
        pages: Math.ceil(count / limit),
      };
    }),
});
