import {type  CarToOption, } from './../server/db/schema';
import { type CarOption, type AuctionDetails, type Body, type Brand, type Car, type CarAssets, type CarSpecs, type Color, type Model, type CarSpecsRating } from "~/server/db/schema";

export type FullCar = Car & {
    brand?: Brand,
    model?:Model,
    images:CarAssets[],
    color?:Color,
    detail:AuctionDetails,
    body?:Body,
    specs?:CarSpecs,
    options: Array<CarToOption & {option:CarOption}>,
    specsRating?:CarSpecsRating,
}