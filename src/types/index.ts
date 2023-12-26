
import type { AuctionDetails } from "~/server/db/schema/auction_details";
import type { Body } from "~/server/db/schema/bodies";
import type { Brand } from "~/server/db/schema/brands";
import type { CarAssets } from "~/server/db/schema/car_assets";
import type { CarOption } from "~/server/db/schema/car_options";
import type { CarSpecs } from "~/server/db/schema/car_specs";
import type { CarSpecsRating } from "~/server/db/schema/car_specs_rating";
import type { CarToOption } from "~/server/db/schema/car_to_optons";
import type { Car } from "~/server/db/schema/cars";
import type { Color } from "~/server/db/schema/colors";
import type { Model } from "~/server/db/schema/models";

export type FullCar = Car & {
    brand?: Brand,
    model?: Model,
    images: CarAssets[],
    color?: Color,
    detail: AuctionDetails,
    body?: Body,
    specs?: CarSpecs,
    options: Array<CarOption>,
    specsRating?: CarSpecsRating,
}

export const CAR_STATUS = ['pending', 'published', 'paused', 'finished', 'completed', 'sold'] as const
export type CarStatus = typeof CAR_STATUS[number]