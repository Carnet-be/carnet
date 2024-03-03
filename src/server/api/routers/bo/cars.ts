import {
  and,
  eq,
  getTableColumns,
  ilike,
  sql,
  type InferSelectModel,
} from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { objArray } from "~/utils/dbUtils";
import { assets, brands, cars, models } from "../../../db/schema";

const filterSchema = z.object({
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  type: z.enum(["auction", "direct"]).optional().nullable(),
  status: z
    .enum(["pending", "published", "paused", "finished", "completed", "sold"])
    .optional()
    .nullable(),
  search: z.string().optional().nullable(),
  belongsTo: z.string().optional().nullable(),
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

  getCounts: protectedProcedure
    .input(
      z
        .object({
          belongsTo: z.string(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const belongsTo = input?.belongsTo;
      return ctx.db.transaction(async (trx) => {
        const [direct] = await trx
          .select({ count: sql<number>`count(*)` })
          .from(cars)
          .where(
            and(
              eq(cars.type, "direct"),
              belongsTo ? eq(cars.belongsTo, belongsTo) : undefined,
            ),
          );
        const [auction] = await trx
          .select({ count: sql<number>`count(*)` })
          .from(cars)
          .where(
            and(
              eq(cars.type, "auction"),
              belongsTo ? eq(cars.belongsTo, belongsTo) : undefined,
            ),
          );
        return {
          direct: direct?.count ?? 0,
          auction: auction?.count ?? 0,
        };
      });
    }),
  getFilters: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.transaction(async (trx) => {
      const brandsData = await trx
        .select({ id: brands.id, label: brands.name })
        .from(brands);
      const modelsData = await trx
        .select({ id: models.id, label: models.name, brandId: models.brandId })
        .from(models);
      return {
        brands: brandsData,
        models: modelsData,
      };
    });
  }),
  getStatusCounts: protectedProcedure
    .input(filterSchema.omit({ status: true }))
    .query(async ({ ctx, input }) => {
      const { brand, model, type, search, belongsTo } = input;
      const where = input
        ? and(
            brand ? eq(cars.brandId, Number(brand)) : undefined,
            model ? eq(cars.modelId, Number(model)) : undefined,
            type ? eq(cars.type, type) : undefined,
            search ? ilike(cars.name, `%${search}%`) : undefined,
            belongsTo ? eq(cars.belongsTo, belongsTo) : undefined,
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
          images: objArray<InferSelectModel<typeof assets>>({
            table: assets,
            id: assets.id,
          }),
        })
        .from(cars)
        .leftJoin(assets, eq(cars.id, assets.ref))
        .where(where)
        .groupBy(cars.id);
      return result;
    }),
});
