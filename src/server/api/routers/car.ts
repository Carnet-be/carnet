/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auctionDetails, carAssets, carSpecs, carSpecsRating, carToOption } from './../../db/schema';
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { brand, cars, model } from "~/server/db/schema";
import { type InferInsertModel, and, eq } from "drizzle-orm";

import { z } from 'zod';


const numSchema = z.number().or(z.string().transform((v) => Number(v) || undefined));
const step1Schema = z.object({
    brand: z.number().min(1, { message: "Please select a brand" }),
    model: z.number().min(1, { message: "Please select a model" }),
    year: z.number().optional(),
    fuel: z.enum(["gasoline", "diesel", "electricity", "hybrid"]).optional(),
    color: z.number().optional(),
    state: z.enum(["new", "used"]).optional(),
});

const step2Schema = z.object({
    body: z.number().optional(),
    transmission: z.enum(["manual", "automatic", "semi-automatic"]).optional(),
    //transform to number
    mileage: numSchema.optional(),
    doors: z.string().optional(),
    cv: numSchema.optional(),
    cc: numSchema.optional(),
    co2: numSchema.optional(),
    version: z.string().optional(),
});

const step3Schema = z.object({
    options: z.array(z.number()).default([]),
});

const step4Schema = z.object({
    handling: z.number().optional(),
    tires: z.number().optional(),
    exterior: z.number().optional(),
    interior: z.number().optional(),
});

const step5Schema = z.object({
    country: z.number().optional(),
    city: z.number().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    pos: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
    zipCode: z.string().optional(),
});

const step6Schema = z.object({
    startingPrice: numSchema.optional(),
    duration: z.enum(["3d", "7d", "14d", "30d"]).optional(),
    expectedPrice: numSchema.optional(),
    minPrice: numSchema.optional(),
    maxPrice: numSchema.optional(),
    price: numSchema.optional(),
    type: z.enum(["direct", "auction"]).default("direct"),
    inRange: z.boolean().optional().default(false),
}).refine((data) => {
    if (data.inRange) {
        return data.minPrice && data.maxPrice;
    } else {
        return true
    }
}, { message: "Please enter a min and max price" }).refine((data) => {
    if (data.type == "auction") {
        return data.duration && data.startingPrice;
    } else {
        return true
    }
}
    , { message: "Please enter a duration and starting price" });


const carSchema = z.object({
    step1: step1Schema,
    step2: step2Schema,
    step3: step3Schema,
    step4: step4Schema,
    step5: step5Schema,
    step6: step6Schema
});



const addCar = protectedProcedure.input(carSchema).mutation(async ({ input, ctx }) => {
    //TODO: add state and description
    const { db, auth } = ctx
    const belongsTo = (auth.orgId ?? auth.userId)!
    const { color = null, brand: bd, model: ml, fuel = null, year = null, state = null } = input.step1
    const { type, minPrice, maxPrice, inRange, price, startingPrice, duration } = input.step6

    const { city, country, address, zipCode, pos, description = null } = input.step5
    const lat = pos?.lat ?? null
    const lon = pos?.lng ?? null
    const { handling, interior, exterior, tires } = input.step4
    const { options } = input.step3
    const { cc = null, cv = null, co2 = null, mileage = null, version = null, body, transmission = null, doors = null } = input.step2



    return db.transaction(async (trx) => {
        const [name] = await trx.select({
            brandName: brand.name,
            modelName: model.name
        }).from(brand).innerJoin(model, eq(brand.id, model.brandId)).where(and(eq(brand.id, bd), eq(model.id, ml)))

        const auctionDetail = await trx.insert(auctionDetails).values({
            startingPrice,
            duration,
        })
        const auctionDetailsId = parseInt(auctionDetail.insertId)



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
            description

        }
        const car = await trx.insert(cars).values(carData)

        await trx.insert(carToOption).values(options.map((opt) => ({ carId: parseInt(car.insertId), optionId: opt })))

        await trx.insert(carSpecs).values({
            cc,
            cv,
            co2,
            mileage,
            carId: parseInt(car.insertId),
            body,
            version,
            transmission: transmission as any,
            doors: doors ? parseInt(doors as string) : null
        })
        await trx.insert(carSpecsRating).values({ handling, interior, exterior, tires, carId: parseInt(car.insertId) })
        return parseInt(car.insertId)
    })


})



const addAssets = protectedProcedure.input(z.object({
    images: z.array(z.string()),
    carId: z.number()
})).mutation(async ({ input, ctx }) => {
    const { db } = ctx
    const { images, carId } = input
    const assets: InferInsertModel<typeof carAssets>[] = images.map((img) => ({ carId, key: img }))
    return db.insert(carAssets).values(assets)
})

export const carRouter = createTRPCRouter({
    addCar,
    addAssets
})