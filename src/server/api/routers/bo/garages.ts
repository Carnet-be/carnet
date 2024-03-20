import { clerkClient } from "@clerk/nextjs";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { garages } from "../../../db/schema";

export const boGarageRouter = createTRPCRouter({
  getGarages: protectedProcedure
    .input(
      z.object({
        page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page = 1 } = input;
      const limit = 20;
      const offset = (page! - 1) * limit;
      const orgs = await clerkClient.organizations.getOrganizationList({
        limit: limit ?? 20,
        offset: offset ?? undefined,
      });
      const query = await ctx.db
        .select()
        .from(garages)
        .where(
          inArray(
            garages.orgId,
            orgs.map((t) => t.id),
          ),
        )
        .offset(offset)
        .limit(limit!);

      const result = orgs.map((org) => {
        const item = query.find((t) => t.orgId === org.id);
        return {
          ...org,
          ...item,
        };
      });
      const nextPage = result.length > limit ? page + 1 : undefined;
      return {
        result,
        nextPage,
      };
    }),
});
