import { clerkClient } from "@clerk/nextjs";
import { TRPCClientError } from "@trpc/client";
import { eq } from "drizzle-orm";
import { garages } from "drizzle/schema";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const garageRouter = createTRPCRouter({
  checkMyGarage: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.auth.orgId;
    if (!id) new TRPCClientError("Unauthorized");
    const [garage] = await ctx.db
      .select({
        id: garages.id,
      })
      .from(garages)
      .where(eq(garages.orgId, id!));
    return garage?.id ?? null;
  }),
  getGarageByOrgId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const [garage] = await ctx.db
        .select()
        .from(garages)
        .where(eq(garages.orgId, input));
      return garage;
    }),
  createGarage: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: input.orgId,
      });

      const insert = await ctx.db.insert(garages).values({
        orgId: input.orgId,
        name: organization.name,
        about: "Welcome to our garage",
        state: "inactive",
      });
      return insert.insertId;
    }),
  updateGarage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        about: z.string().optional(),
        cover: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.db
        .update(garages)
        .set(input)
        .where(eq(garages.id, input.id));
      return update.rowsAffected;
    }),
});
