/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import {
  and,
  eq,
  getTableColumns,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";

import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { TRPCError } from "@trpc/server";
import {
  assets,
  bodies,
  brands,
  carOptions,
  carToOption,
  cars,
  colors,
  models,
} from "drizzle/schema";

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
          year: models.year,
        })
        .from(brands)
        .innerJoin(models, eq(brands.id, models.brandId))
        .where(and(eq(brands.id, bd), eq(models.id, ml)));

      const carData: InferInsertModel<typeof cars> = {
        brandId: bd,
        modelId: ml,
        fuel,
        state,
        year,
        type,
        name: `${name?.brandName} ${name?.modelName} ${name?.year}`,
        belongsTo,
        minPrice,
        maxPrice,
        inRange: inRange ? 1 : 0,
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
      const car = await trx.insert(cars).values(carData);
      if (options.length > 0)
        await trx.insert(carToOption).values(
          options.map((opt) => ({
            carId: parseInt(car.insertId),
            optionId: opt,
          })),
        );
      return parseInt(car.insertId);
    });
  });
const updateCar = protectedProcedure
  .input(updateCarSchema)
  .mutation(async ({ input, ctx }) => {
    //TODO: add state and description
    const { db } = ctx;

    const { pos, ...step5 } = input.step5;
    const { year, brand, model, ...step1 } = input.step1;
    delete step5.images;
    const lat = pos?.lat ?? null;
    const lon = pos?.lng ?? null;
    const { options } = input.step3;
    const { mileage, doors, body, ...step2 } = input.step2;
    return db.transaction(async (trx) => {
      const [name] = await trx
        .select({
          brandName: brands.name,
          modelName: models.name,
          year: models.year,
        })
        .from(brands)
        .innerJoin(models, eq(brands.id, models.brandId))
        .where(
          and(
            eq(brands.id, input.step1.brand ?? 0),
            eq(models.id, input.step1.model ?? 0),
          ),
        );
      if (!name)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand and Model not found",
        });
      const car = await trx
        .update(cars)
        .set({
          ...step1,
          ...step2,
          ...input.step4,
          ...input.step6,
          ...step5,
          brandId: brand,
          modelId: model,
          bodyId: body,
          kilometrage: mileage,
          inRange: input.step6.inRange ? 1 : 0,
          doors: doors ? parseInt(doors as string) : null,
          lat,
          lon,
          name: `${name?.brandName} ${name?.modelName} ${name?.year}`,
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

      return parseInt(car.insertId);
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
    return results.length > 0
      ? db.transaction(async (trx) => {
          await trx.delete(assets).where(eq(assets.ref, carId));
          return trx.insert(assets).values(results);
        })
      : [];
  });

const getCars = protectedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;
  const result = await db
    .select({
      ...getTableColumns(cars),
      images: sql<
        InferSelectModel<typeof assets>[]
      >`IF(COUNT(${assets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${assets.id},'key',${assets.key})))`,

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
    .groupBy(() => [cars.id]);

  console.log("result", result);
  return result;
});

const getCarById = publicProcedure
  .input(z.number())
  .query(async ({ input, ctx }) => {
    const { db } = ctx;

    const [result] = await db
      .select({
        ...getTableColumns(cars),
        images: sql<
          InferSelectModel<typeof assets>[]
        >`IF(COUNT(${assets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${assets.id},'key',${assets.key}))) AS images`,

        brand: brands,
        model: models,
        body: bodies,
        color: colors,
        options: sql<
          InferSelectModel<typeof carOptions>[]
        >`IF(COUNT(${carOptions.id}) = 0, JSON_ARRAY(),json_arrayagg(json_object('id',${carOptions.id},'name',${carOptions.name}))) AS options`,
      })
      .from(cars)
      .leftJoin(assets, eq(cars.id, assets.ref))
      .leftJoin(brands, eq(cars.brandId, brands.id))
      .leftJoin(models, eq(cars.modelId, models.id))
      .leftJoin(carToOption, eq(cars.id, carToOption.carId))
      .leftJoin(carOptions, eq(carToOption.optionId, carOptions.id))
      .leftJoin(colors, eq(cars.color, colors.id))
      .leftJoin(bodies, eq(cars.bodyId, bodies.id))
      .where(eq(cars.id, input))
      .groupBy(() => [cars.id]);
    if (!result) new TRPCClientError("Car not found");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // image without duplicates
    const images =
      result?.images.reduce(
        (acc, curr) => {
          if (!acc.find((img) => img.id === curr.id)) acc.push(curr);
          return acc;
        },
        [] as InferSelectModel<typeof assets>[],
      ) ?? [];
    const options =
      result?.options.reduce(
        (acc, curr) => {
          if (!acc.find((opt) => opt.id === curr.id)) acc.push(curr);
          return acc;
        },
        [] as InferSelectModel<typeof carOptions>[],
      ) ?? [];

    return {
      ...result,
      images,
      options,
    };
  });

const getMyCars = protectedProcedure.query(async ({ ctx, input }) => {
  const { db, auth } = ctx;
  const id = auth.orgId ?? auth.userId;

  if (!id) throw new Error("Not authenticated");

  const result = await db
    .select({
      ...getTableColumns(cars),
      images: sql<
        InferSelectModel<typeof assets>[]
      >`IF(COUNT(${assets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${assets.id},'key',${assets.key})))`,

      brand: brands,
      model: models,
      body: bodies,
    })
    .from(cars)
    .leftJoin(assets, eq(cars.id, assets.ref))
    .leftJoin(brands, eq(cars.brandId, brands.id))
    .leftJoin(models, eq(cars.modelId, models.id))
    .leftJoin(bodies, eq(cars.bodyId, bodies.id))
    .where(eq(cars.belongsTo, id))
    .groupBy(() => [cars.id]);

  return result;
});

export const carRouter = createTRPCRouter({
  addCar,
  addAssets,
  getCars,
  getCarById,
  getMyCars,
  updateCar,
});
