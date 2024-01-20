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
import { assets } from "~/server/db/schema/assets";
import body from "~/server/db/schema/bodies";
import brand from "~/server/db/schema/brands";
import carOption, { type CarOption } from "~/server/db/schema/car_options";
import carToOption from "~/server/db/schema/car_to_optons";
import cars from "~/server/db/schema/cars";
import colors from "~/server/db/schema/colors";
import model from "~/server/db/schema/models";
import { type FullCar } from "~/types";

export const createCarSchema = z.object({
  step1: z.object({
    color: z.number().nullable(),
    brand: z.number(),
    model: z.number(),
    fuel: z.enum(["gasoline", "diesel", "electricity", "hybrid"]).nullable(),
    year: z.number().nullable(),
    state: z.enum(["new", "used"]).nullable(),
  }),
  step2: z.object({
    cc: z.number().nullable(),
    cv: z.number().nullable(),
    co2: z.number().nullable(),
    mileage: z.number().nullable(),
    version: z.string().nullable(),
    body: z.number(),
    transmission: z.enum(["manual", "automatic", "semi-automatic"]).nullable(),
    doors: z.number().nullable(),
  }),
  step3: z.object({
    options: z.array(z.number()),
  }),
  step4: z.object({
    handling: z.number(),
    interior: z.number(),
    exterior: z.number(),
    tires: z.number(),
  }),
  step5: z.object({
    city: z.number(),
    country: z.number(),
    address: z.string(),
    zipCode: z.string(),
    pos: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    description: z.string().nullable(),
  }),
  step6: z.object({
    type: z.enum(["auction", "direct"]),
    minPrice: z.number(),
    maxPrice: z.number(),
    inRange: z.boolean(),
    price: z.number(),
    startingPrice: z.number(),
    duration: z.enum(["3d", "7d", "14d", "30d"]),
  }),
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
    } = input.step6;

    const {
      city,
      country,
      address,
      zipCode,
      pos,
      description = null,
    } = input.step5;
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
          brandName: brand.name,
          modelName: model.name,
          year: model.year,
        })
        .from(brand)
        .innerJoin(model, eq(brand.id, model.brandId))
        .where(and(eq(brand.id, bd), eq(model.id, ml)));

      const carData: InferInsertModel<typeof cars> = {
        colorId: color,
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
        inRange,
        price,
        bodyId: body,
        cityId: city,
        countryId: country,
        address,
        zipCode,
        lat,
        lon,
        description,
        startingPrice,
        duration,
        cc,
        cv,
        co2,
        mileage,
        version,
        transmission,
        doors,
        handling,
        interior,
        exterior,
        tires,
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
    const result: InferInsertModel<typeof assets>[] = images.map((img) => ({
      ref: carId,
      key: img,
      type: "image",
    }));
    return result.length > 0 ? db.insert(assets).values(result) : [];
  });

const getCars = protectedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;
  const result = await db
    .select({
      ...getTableColumns(cars),
      images: sql<
        InferSelectModel<typeof assets>[]
      >`IF(COUNT(${assets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${assets.id},'key',${assets.key})))`,
      brand: brand,
      model: model,
      body: body,
      color: colors,
    })
    .from(cars)
    .leftJoin(assets, eq(cars.id, assets.ref))
    .leftJoin(brand, eq(cars.brandId, brand.id))
    .leftJoin(model, eq(cars.modelId, model.id))
    .leftJoin(colors, eq(cars.colorId, colors.id))
    .leftJoin(body, eq(cars.bodyId, body.id))
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
        >`IF(COUNT(${assets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${assets.id},'key',${assets.key})))`,

        brand: brand,
        model: model,

        body: body,
        color: colors,
        options: sql<
          CarOption[]
        >`IF( COUNT(${carOption.id}) = 0, JSON_ARRAY(),json_arrayagg(json_object('id',${carOption.id},'name',${carOption.name})))`,
      })
      .from(cars)
      .leftJoin(assets, eq(cars.id, assets.ref))
      .leftJoin(brand, eq(cars.brandId, brand.id))
      .leftJoin(model, eq(cars.modelId, model.id))
      .leftJoin(carToOption, eq(cars.id, carToOption.carId))
      .leftJoin(carOption, eq(carToOption.optionId, carOption.id))
      .leftJoin(colors, eq(cars.colorId, colors.id))
      .leftJoin(body, eq(cars.bodyId, body.id))
      .where(eq(cars.id, input))
      .groupBy(() => [cars.id]);
    if (!result) new TRPCClientError("Car not found");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return

    return result as unknown as FullCar;
  });

export const carRouter = createTRPCRouter({
  addCar,
  addAssets,
  getCars,
  getCarById,
});
