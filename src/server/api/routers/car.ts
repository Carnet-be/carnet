/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import {
    and,
    desc,
    eq,
    getTableColumns,
    gt,
    lt,
    sql,
    type InferInsertModel,
    type InferSelectModel,
} from "drizzle-orm";

import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/dist/types/server-helpers.server";
import { TRPCError } from "@trpc/server";
import { objArray } from "~/utils/dbUtils";
import {
    assets,
    biddings,
    bodies,
    brands,
    carOptions,
    carToOption,
    cars,
    colors,
    models,
} from "../../db/schema";

const numSchema = z
  .number()
  .or(z.string().transform((v) => Number(v) || undefined));
const step1Schema = z.object({
  brand: z.number().min(1, { message: "Please select a brand" }),
  model: z.number().min(1, { message: "Please select a model" }),
  year: z.number().optional().nullable(),
  fuel: z
    .enum(["gasoline", "diesel", "electricity", "hybrid"])
    .optional()
    .nullable(),
  color: z.number().optional().nullable(),
  state: z.enum(["new", "used"]).optional().nullable(),
});

const step2Schema = z.object({
  body: z.number().optional().nullable(),
  transmission: z
    .enum(["manual", "automatic", "semi-automatic"])
    .optional()
    .nullable(),
  //transform to number
  mileage: numSchema.optional().nullable(),
  doors: z.string().optional().nullable(),
  cv: numSchema.optional().nullable(),
  cc: numSchema.optional().nullable(),
  co2: numSchema.optional().nullable(),
  version: z.string().optional().nullable(),
});

const step3Schema = z.object({
  options: z.array(z.number()).default([]),
});

const step4Schema = z.object({
  handling: z.number().optional().nullable(),
  tires: z.number().optional().nullable(),
  exterior: z.number().optional().nullable(),
  interior: z.number().optional().nullable(),
});

const step5Schema = z.object({
  images: z.array(z.string()).default([]),
  country: z.number().optional().nullable(),
  city: z.number().optional().nullable(),
  address: z.string().optional().nullable(),

  pos: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .nullable(),
  zipCode: z.string().optional().nullable(),
});

const step6Schema = z.object({
  startingPrice: numSchema.optional().nullable(),
  duration: z.enum(["3d", "7d", "14d", "30d"]).optional().nullable(),
  expectedPrice: numSchema.optional().nullable(),
  minPrice: numSchema.optional().nullable(),
  maxPrice: numSchema.optional().nullable(),
  price: numSchema.optional().nullable(),
  type: z.enum(["direct", "auction"]).default("direct"),
  inRange: z.boolean().optional().nullable().default(false),
  description: z.string().optional().nullable(),
});

export const createCarSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
});

export const updateCarSchema = z.object({
  id: z.number(),
  step1: step1Schema.partial(),
  step2: step2Schema.partial(),
  step3: step3Schema.partial(),
  step4: step4Schema.partial(),
  step5: step5Schema.partial(),
  step6: step6Schema.partial(),
});

const getEndDate = (t: "3d" | "7d" | "14d" | "30d" | undefined | null) => {
  if (!t) return null;
  const now = new Date();
  const days = {
    "3d": 3,
    "7d": 7,
    "14d": 14,
    "30d": 30,
  };
  return new Date(now.setDate(now.getDate() + days[t]));
};
const addCar = protectedProcedure
  .input(createCarSchema)
  .mutation(async ({ input, ctx }) => {
    //TODO: add state and description
    const { db, auth } = ctx;
    const belongsTo = (auth.orgId ?? auth.userId)!;
    const {
      color = null,
      brand: bd,
      model: ml,
      fuel = null,
      year = null,
      state = null,
    } = input.step1;
    const {
      type,
      minPrice,
      maxPrice,
      inRange,
      price,
      startingPrice,
      duration,
      description,
    } = input.step6;

    const { city, country, address, zipCode, pos } = input.step5;
    const lat = pos?.lat ?? null;
    const lon = pos?.lng ?? null;
    const { handling, interior, exterior, tires } = input.step4;
    const { options } = input.step3;
    const {
      cc = null,
      cv = null,
      co2 = null,
      mileage = null,
      version = null,
      body,
      transmission = null,
      doors = null,
    } = input.step2;

    return db.transaction(async (trx) => {
      const [name] = await trx
        .select({
          brandName: brands.name,
          modelName: models.name,
        })
        .from(brands)
        .innerJoin(models, eq(brands.id, models.brandId))
        .where(and(eq(brands.id, bd), eq(models.id, ml)));

      const carData: InferInsertModel<typeof cars> = {
        brandId: bd,
        modelId: ml,
        fuel,
        state,
        endedAt: getEndDate(duration),
        year,
        type,
        name: `${name?.brandName} ${name?.modelName}${year ? ` ${year}` : ""}`,
        belongsTo,
        minPrice,
        maxPrice,
        inRange,
        startingPrice,
        duration,
        price,
        bodyId: body,
        cityId: city,
        countryId: country,
        address,
        zipCode,
        lat,
        lon,
        description,
        cc,
        cv,
        co2,
        kilometrage: mileage,
        version,
        transmission: transmission as any,
        doors: doors ? parseInt(doors as string) : null,
        handling,
        interior,
        exterior,
        tires,
        color: color ?? null,
      };
      const car = await trx
        .insert(cars)
        .values(carData)
        .returning({ id: cars.id })
        .then((res) => res[0]);
      if (!car)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Car not created",
        });
      if (options.length > 0)
        await trx.insert(carToOption).values(
          options.map((opt) => ({
            carId: car.id,
            optionId: opt,
          })),
        );
      return car.id;
    });
  });
const updateCar = protectedProcedure
  .input(updateCarSchema)
  .mutation(async ({ input, ctx }) => {
    //TODO: add state and description
    const { db } = ctx;
    console.log("input", input)
    const { pos, images, ...step5 } = input.step5;
    const { year, brand, model, ...step1 } = input.step1;

    const lat = pos?.lat ?? null;
    const lon = pos?.lng ?? null;
    const { options } = input.step3;
    const { mileage, doors, body, ...step2 } = input.step2;
    return db.transaction(async (trx) => {
      const [dataCar] = await trx
        .select({
          brandName: brands.name,
          modelName: models.name,
          modelId: models.id,
          brandId: brands.id,
        })
        .from(brands)
        .innerJoin(models, eq(brands.id, models.brandId))
        .where(
          and(
            eq(models.id, model ?? 0),
          ),
        );

      if (!dataCar)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand and Model not found",
        });
      await trx
        .update(cars)
        .set({
          ...step1,
          ...step2,
          ...input.step4,
          ...input.step6,
          // ...step5,
          countryId: step5.country,
          cityId: step5.city,
          address: step5.address,
          zipCode: step5.zipCode,
          brandId: dataCar.brandId,
          modelId: dataCar.modelId,
          endedAt: getEndDate(input.step6.duration),
          bodyId: body,
          kilometrage: mileage,
          inRange: input.step6.inRange,
          doors: doors ? parseInt(doors as string) : null,
          lat,
          year,
          lon,
          name: `${dataCar?.brandName} ${dataCar?.modelName}${year ? ` ${year}` : ""}`,
        })
        .where(eq(cars.id, input.id));
      await trx.delete(carToOption).where(eq(carToOption.carId, input.id));
      if (options && options.length > 0)
        await trx.insert(carToOption).values(
          options.map((opt) => ({
            carId: input.id,
            optionId: opt,
          })),
        );

      return input.id;
    });
  });
const addAssets = protectedProcedure
  .input(
    z.object({
      images: z.array(z.string()),
      carId: z.number(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { db } = ctx;
    const { images, carId } = input;
    const results: InferInsertModel<typeof assets>[] = images.map((img) => ({
      ref: carId,
      key: img,
      type: "image",
    }));
    console.log("results", results);
    return results.length > 0
      ? await db.transaction(async (trx) => {
        await trx.delete(assets).where(eq(assets.ref, carId));
        return await trx.insert(assets).values(results);
      })
      : [];
  });

const getCars = publicProcedure
  .input(
    z.object({
      cursor: z.number().nullish(),
      limit: z.number().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { db } = ctx;
    const limit = input.limit ?? 20;
    const { cursor: offset = 0 } = input;

    const where = and(eq(cars.status, "published"));

    const result = await db
      .select({
        ...getTableColumns(cars),
        images: objArray<InferSelectModel<typeof assets>>({
          table: assets,
          id: assets.id,
        }),

        brand: brands,
        model: models,
        body: bodies,
        color: colors,
      })
      .from(cars)
      .leftJoin(assets, eq(cars.id, assets.ref))
      .leftJoin(brands, eq(cars.brandId, brands.id))
      .leftJoin(models, eq(cars.modelId, models.id))
      .leftJoin(colors, eq(cars.color, colors.id))
      .leftJoin(bodies, eq(cars.bodyId, bodies.id))
      .groupBy(() => [cars.id, brands.id, models.id, bodies.id, colors.id])
      .where(and(where, offset ? lt(cars.id, offset) : undefined))
      .orderBy(desc(cars.id))
      .limit(limit + 1)
      .offset(offset!);

    let cursor = null;
    if (result.length > limit) {
      cursor = result.pop()?.id ?? null;
    }

    return {
      result,
      cursor,
    };
  });

const getCarById = publicProcedure
  .input(z.object({
    id: z.number(),
    mine: z.boolean().optional(),
  }))
  .query(async ({ input, ctx }) => {
    const { db } = ctx;
    const { userId, orgId } = ctx.auth;
    const belongsId = orgId ?? userId;
    let isAdmin = false;
    if (userId) {
      const user = await currentUser()
      isAdmin = user?.privateMetadata?.role === "admin"
    }
    const where = and(
      eq(cars.id, input.id),
      isAdmin ? undefined : input.mine && belongsId ? eq(cars.belongsTo, belongsId) : sql`CASE WHEN ${cars.status} = 'published' THEN TRUE ELSE ${cars.belongsTo} = ${belongsId} END`
    );
    const [result] = await db
      .select({
        ...getTableColumns(cars),
        images: objArray<InferInsertModel<typeof assets>>({
          table: assets,
          id: assets.id,
        }),

        brand: brands,
        model: models,
        body: bodies,
        color: colors,
        options: objArray<InferSelectModel<typeof carOptions>>({
          table: carOptions,
          id: carOptions.id,
        }),
      })
      .from(cars)
      .leftJoin(assets, eq(cars.id, assets.ref))
      .leftJoin(brands, eq(cars.brandId, brands.id))
      .leftJoin(models, eq(cars.modelId, models.id))
      .leftJoin(carToOption, eq(cars.id, carToOption.carId))
      .leftJoin(carOptions, eq(carToOption.optionId, carOptions.id))
      .leftJoin(colors, eq(cars.color, colors.id))
      .leftJoin(bodies, eq(cars.bodyId, bodies.id))
      .where(where)
      .groupBy(() => [cars.id, brands.id, models.id, bodies.id, colors.id]);
    if (!result) throw new TRPCError({
      code: "NOT_FOUND",
      message: "Car not found",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // image without duplicates

    //remove duplicates from result.images
    const images = result!.images.map((img) => img.key);
    const options = [...new Set(result!.options.map((opt) => opt.name))];

    return {
      ...result,
      images: [...new Set(images)],
      options: options.map((opt) =>
        result!.options.find((o) => o.name === opt),
      ),
    };
  });

const getMyCars = publicProcedure.input(z.string().optional().nullable()).query(async ({ ctx, input }) => {
  const { db } = ctx;

  const result = await db
    .select({
      ...getTableColumns(cars),
      images: objArray<InferSelectModel<typeof assets>>({
        table: assets,
        id: assets.id,
      }),

      brand: brands,
      model: models,
      body: bodies,
    })
    .from(cars)
    .leftJoin(assets, eq(cars.id, assets.ref))
    .leftJoin(brands, eq(cars.brandId, brands.id))
    .leftJoin(models, eq(cars.modelId, models.id))
    .leftJoin(bodies, eq(cars.bodyId, bodies.id))
    .where(eq(cars.belongsTo, input ?? ""))
    .groupBy(() => [cars.id, brands.id, models.id, bodies.id]);

  return result;
});

const getBidsCount = protectedProcedure
  .input(z.number())
  .query(async ({ ctx, input }) => {
    return ctx.db
      .select({
        ...getTableColumns(biddings),
      })
      .from(biddings)
      .where(eq(biddings.carId, input))
      .orderBy(desc(biddings.id));
  });

const addBid = protectedProcedure
  .input(
    z.object({
      amount: z.number(),
      carId: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { db, auth } = ctx;
    const id = auth.userId;

    if (!id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });

    const bid = await db
      .select({
        count: sql<number>`COUNT(${biddings.id})`,
      })
      .from(biddings)
      .where(
        and(eq(biddings.carId, input.carId), gt(biddings.amount, input.amount)),
      )
      .then((res) => res?.[0]?.count ?? 0);

    if (bid > 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Bid is lower than the current bid",
      });

    const result = await db.insert(biddings).values({
      amount: input.amount,
      carId: input.carId,
      bidderId: id,
    });

    return result;
  });
const getMyBids = protectedProcedure.query(async ({ ctx }) => {
  const { db, auth } = ctx;
  const id = auth.userId;

  if (!id) throw new Error("Not authenticated");

  const result = await db
    .select({
      ...getTableColumns(biddings),
      number: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${biddings.carId} ORDER BY ${biddings.amount} DESC)`,
      car: {
        ...getTableColumns(cars),
        images: objArray<InferSelectModel<typeof assets>>({
          table: assets,
          id: assets.id,
        }),
      },
    })
    .from(biddings)
    .leftJoin(cars, eq(biddings.carId, cars.id))
    .leftJoin(assets, eq(cars.id, assets.ref))
    .where(eq(biddings.bidderId, id))
    .groupBy(() => [biddings.id, cars.id])
    .orderBy(desc(biddings.id));

  return result;
});
export const carRouter = createTRPCRouter({
  addCar,
  addAssets,
  getCars,
  getCarById,
  getMyCars,
  updateCar,
  getBidsCount,
  addBid,
  getMyBids,
});
