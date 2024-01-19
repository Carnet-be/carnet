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
} from "drizzle-orm";

import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import auctionDetails from "~/server/db/schema/auction_details";
import body from "~/server/db/schema/bodies";
import brand from "~/server/db/schema/brands";
import { carAssets } from "~/server/db/schema/car_assets";
import carOption, { type CarOption } from "~/server/db/schema/car_options";
import carSpecs, { type CarSpecs } from "~/server/db/schema/car_specs";
import carSpecsRating from "~/server/db/schema/car_specs_rating";
import carToOption from "~/server/db/schema/car_to_optons";
import cars from "~/server/db/schema/cars";
import colors from "~/server/db/schema/colors";
import model from "~/server/db/schema/models";
import { type FullCar } from "~/types";

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
  country: z.number().optional().nullable(),
  city: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  pos: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .nullable(),
  zipCode: z.string().optional().nullable(),
});

const step6Schema = z
  .object({
    startingPrice: numSchema.optional().nullable(),
    duration: z.enum(["3d", "7d", "14d", "30d"]).optional().nullable(),
    expectedPrice: numSchema.optional().nullable(),
    minPrice: numSchema.optional().nullable(),
    maxPrice: numSchema.optional().nullable(),
    price: numSchema.optional().nullable(),
    type: z.enum(["direct", "auction"]).default("direct"),
    inRange: z.boolean().optional().nullable().default(false),
  })
  .refine(
    (data) => {
      if (data.inRange) {
        return data.minPrice && data.maxPrice;
      } else {
        return true;
      }
    },
    { message: "Please enter a min and max price" },
  )
  .refine(
    (data) => {
      if (data.type == "auction") {
        return data.duration && data.startingPrice;
      } else {
        return true;
      }
    },
    { message: "Please enter a duration and starting price" },
  );

const carSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
});

const addCar = protectedProcedure
  .input(carSchema)
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
        })
        .from(brand)
        .innerJoin(model, eq(brand.id, model.brandId))
        .where(and(eq(brand.id, bd), eq(model.id, ml)));

      const auctionDetail = await trx.insert(auctionDetails).values({
        startingPrice,
        duration,
      });
      const auctionDetailsId = parseInt(auctionDetail.insertId);

      const carData: InferInsertModel<typeof cars> = {
        colorId: color,
        brandId: bd,
        modelId: ml,
        fuel,
        state,
        year,
        type,
        name: `${name?.brandName} ${name?.modelName}`,
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
        auctionDetailsId,
        description,
      };
      const car = await trx.insert(cars).values(carData);
      if (options.length > 0)
        await trx.insert(carToOption).values(
          options.map((opt) => ({
            carId: parseInt(car.insertId),
            optionId: opt,
          })),
        );

      await trx.insert(carSpecs).values({
        cc,
        cv,
        co2,
        mileage,
        carId: parseInt(car.insertId),
        body,
        version,
        transmission: transmission as any,
        doors: doors ? parseInt(doors as string) : null,
      });
      await trx.insert(carSpecsRating).values({
        handling,
        interior,
        exterior,
        tires,
        carId: parseInt(car.insertId),
      });
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
    const assets: InferInsertModel<typeof carAssets>[] = images.map((img) => ({
      carId,
      key: img,
    }));
    return assets.length > 0 ? db.insert(carAssets).values(assets) : [];
  });

const getCars = protectedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;
  const result = await db
    .select({
      ...getTableColumns(cars),
      images: sql<
        CarSpecs[]
      >`IF(COUNT(${carAssets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${carAssets.id},'key',${carAssets.key})))`,
      auctionDetails: auctionDetails,
      brand: brand,
      model: model,
      specs: carSpecs,
      specsRating: carSpecsRating,
      body: body,
      color: colors,
    })
    .from(cars)
    .leftJoin(carAssets, eq(cars.id, carAssets.carId))
    .leftJoin(auctionDetails, eq(cars.auctionDetailsId, auctionDetails.id))
    .leftJoin(brand, eq(cars.brandId, brand.id))
    .leftJoin(model, eq(cars.modelId, model.id))
    .leftJoin(carSpecs, eq(cars.id, carSpecs.carId))
    .leftJoin(carSpecsRating, eq(cars.id, carSpecsRating.carId))
    .leftJoin(colors, eq(cars.colorId, colors.id))
    .leftJoin(body, eq(cars.bodyId, body.id))
    .groupBy(() => [cars.id, carSpecs.id, carSpecsRating.id]);

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
          CarSpecs[]
        >`IF(COUNT(${carAssets.id}) = 0, JSON_ARRAY(), json_arrayagg(json_object('id',${carAssets.id},'key',${carAssets.key})))`,
        auctionDetails: auctionDetails,
        brand: brand,
        model: model,
        specs: carSpecs,
        specsRating: carSpecsRating,
        body: body,
        color: colors,
        options: sql<
          CarOption[]
        >`IF( COUNT(${carOption.id}) = 0, JSON_ARRAY(),json_arrayagg(json_object('id',${carOption.id},'name',${carOption.name})))`,
      })
      .from(cars)
      .leftJoin(carAssets, eq(cars.id, carAssets.carId))
      .leftJoin(auctionDetails, eq(cars.auctionDetailsId, auctionDetails.id))
      .leftJoin(brand, eq(cars.brandId, brand.id))
      .leftJoin(model, eq(cars.modelId, model.id))
      .leftJoin(carSpecs, eq(cars.id, carSpecs.carId))
      .leftJoin(carSpecsRating, eq(cars.id, carSpecsRating.carId))
      .leftJoin(carToOption, eq(cars.id, carToOption.carId))
      .leftJoin(carOption, eq(carToOption.optionId, carOption.id))
      .leftJoin(colors, eq(cars.colorId, colors.id))
      .leftJoin(body, eq(cars.bodyId, body.id))
      .where(eq(cars.id, input))
      .groupBy(() => [cars.id, carSpecs.id, carSpecsRating.id]);
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
