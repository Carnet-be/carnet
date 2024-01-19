import { and, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import brand from "~/server/db/schema/brands";
import { carAssets } from "~/server/db/schema/car_assets";
import cars from "~/server/db/schema/cars";
import model from "~/server/db/schema/models";

const filterSchema = z.object({
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  type: z.enum(["auction", "direct"]).optional().nullable(),
  status: z
    .enum(["pending", "published", "paused", "finished", "completed", "sold"])
    .optional()
    .nullable(),
  search: z.string().optional().nullable(),
});

export const boCarsRouter = createTRPCRouter({
  updateCars: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: createInsertSchema(cars as any).partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      if (!data) throw new Error("Data is required");
      return ctx.db.update(cars).set(data).where(eq(cars.id, id));
    }),

  getCounts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.transaction(async (trx) => {
      const [direct] = await trx
        .select({ count: sql<number>`count(*)` })
        .from(cars)
        .where(eq(cars.type, "direct"));
      const [auction] = await trx
        .select({ count: sql<number>`count(*)` })
        .from(cars)
        .where(eq(cars.type, "auction"));
      return {
        direct: direct?.count ?? 0,
        auction: auction?.count ?? 0,
      };
    });
  }),
  getFilters: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.transaction(async (trx) => {
      const brandsData = await trx
        .select({ id: brand.id, label: brand.name })
        .from(brand);
      const modelsData = await trx
        .select({ id: model.id, label: model.name, brandId: model.brandId })
        .from(model);
      return {
        brands: brandsData,
        models: modelsData,
      };
    });
  }),
  getStatusCounts: protectedProcedure
    .input(filterSchema.omit({ status: true }))
    .query(async ({ ctx, input }) => {
      const { brand, model, type, search } = input;
      const where = input
        ? and(
            brand ? eq(cars.brandId, Number(brand)) : undefined,
            model ? eq(cars.modelId, Number(model)) : undefined,
            type ? eq(cars.type, type) : undefined,
            search ? ilike(cars.name, `%${search}%`) : undefined,
          )
        : undefined;
      const result = await ctx.db
        .select({ status: cars.status, count: sql<number>`count(*)` })
        .from(cars)
        .where(where)
        .groupBy(cars.status);
      console.log("result", result);
      return {
        pending: result.find((r) => r.status === "pending")?.count ?? 0,
        published: result.find((r) => r.status === "published")?.count ?? 0,
        paused: result.find((r) => r.status === "paused")?.count ?? 0,
        finished: result.find((r) => r.status === "finished")?.count ?? 0,
        completed: result.find((r) => r.status === "completed")?.count ?? 0,
        sold: result.find((r) => r.status === "sold")?.count ?? 0,
      };
    }),

  getCars: protectedProcedure
    .input(filterSchema)
    .query(async ({ ctx, input }) => {
      const { brand, model, type, status, search } = input;
      const where = input
        ? and(
            brand ? eq(cars.brandId, Number(brand)) : undefined,
            model ? eq(cars.modelId, Number(model)) : undefined,
            type ? eq(cars.type, type) : undefined,
            status ? eq(cars.status, status) : undefined,
            search ? ilike(cars.name, `%${search}%`) : undefined,
          )
        : undefined;
      const result = await ctx.db
        .select({
          ...getTableColumns(cars),
          images: sql<
            { id: number; k: string }[]
          >`IF(COUNT(${carAssets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${carAssets.id},'key',${carAssets.key})))`,
        })
        .from(cars)
        .leftJoin(carAssets, eq(cars.id, carAssets.carId))
        .where(where)
        .groupBy(cars.id);
      return result;
    }),
});
