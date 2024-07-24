import { clerkClient } from "@clerk/nextjs/server";
import { inArray, sql } from "drizzle-orm";
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
        limit: limit ?? 2,
        offset: offset,
      });
      const query = await ctx.db.transaction(async (trx) => {
        const garagesQuery = await trx
          .select()
          .from(garages)
          .where(
            inArray(
              garages.orgId,
              orgs.data.map((t) => t.id),
            ),
          );

        const [total] = await trx
          .select({ count: sql<number>`cast(count(*) as integer)` })
          .from(garages);
        return {
          garages: garagesQuery,
          total: total?.count ?? 0,
        };
      });

      const result = orgs.data.map((org) => {
        const item = query.garages.find((t) => t.orgId === org.id);
        return {
          ...org,
          ...item,
        };
      });

      return {
        result,
        pages: Math.ceil(query.total / limit) ?? 1,
        page: page,
      };
    }),
});
