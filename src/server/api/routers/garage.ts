import { TRPCClientError } from "@trpc/client";
import {
  and,
  desc,
  eq,
  getTableColumns,
  type InferSelectModel,
} from "drizzle-orm";

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { assets, cars, garages } from "~/server/db/schema";
import { objArray } from "~/utils/dbUtils";

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
        .where(and(eq(garages.orgId, input), eq(garages.state, "published")));

      if (!garage) {
        return null;
      }
      const result = await ctx.db
        .select({
          ...getTableColumns(cars),
          images: objArray<InferSelectModel<typeof assets>>({
            table: assets,
            id: assets.id,
          }),
        })
        .from(cars)
        .leftJoin(assets, eq(cars.id, assets.ref))
        .where(
          and(eq(cars.belongsTo, garage?.orgId), eq(cars.status, "published")),
        )
        .groupBy(() => [cars.id])
        .orderBy(desc(cars.createdAt), desc(cars.updatedAt));
      return {
        ...garage,
        cars: result,
      };
    }),
  createGarage: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insert = await ctx.db
        .insert(garages)
        .values({
          orgId: input.orgId,
          about: "Welcome to our garage",
        })
        .returning({ id: garages.id })
        .then((res) => res[0]);

      return insert?.id;
    }),
  updateGarage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        about: z.string().optional().nullable(),
        cover: z.string(),
        state: z.enum(["published", "draft", "expired"]).optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.db
        .update(garages)
        .set(input)
        .where(eq(garages.id, input.id));
      return update.rows;
    }),
});
