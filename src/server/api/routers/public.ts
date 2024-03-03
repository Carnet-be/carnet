import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { env } from "~/env.mjs";
import s3 from "~/server/s3";

import { type InferSelectModel } from "drizzle-orm";
import {
  bodies,
  brands,
  carOptions,
  cities,
  colors,
  countries,
  models,
} from "../../db/schema";

const presignedUrl = publicProcedure.mutation(async () => {
  const key = uuidv4();

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: env.C_AWS_BUCKET,
      Key: `carnet/${key}`,
      ContentType: "image/*",
    }),
  );
  return {
    url,
    key,
  };
});

const groupModelYear = (data: InferSelectModel<typeof models>[]) => {
  const names: {
    id: number;
    name: string;
    brandId: number;
  }[] = [];
  data.forEach((d) => {
    const { id, name, brandId } = d;
    if (!names.find((n) => n.name === name && n.brandId === brandId)) {
      names.push({ id, name, brandId });
    }
  });
  const years = data
    .filter((d) => d.year)
    .map((d) => ({
      id: d.id,
      year: d.year!,
      modelName: d.name,
    }))
    .sort((a, b) => b.year - a.year);
  return {
    models: names,
    years,
  };
};
export const publicRouter = createTRPCRouter({
  presignedUrl,
  carData: publicProcedure.query(async ({ ctx }) => {
    const trx = ctx.db;
    const ctries = await trx.select().from(countries).orderBy(countries.name);
    const cties = await trx.select().from(cities).orderBy(cities.name);
    const opts = await trx.select().from(carOptions).orderBy(carOptions.name);
    const brds = await trx.select().from(brands).orderBy(brands.name);
    const modelsData = await trx.select().from(models).orderBy(models.name);
    const bdy = await trx.select().from(bodies);
    const clors = await trx.select().from(colors).orderBy(colors.id);
    return {
      countries: ctries,
      cities: cties,
      carOptions: opts,
      brands: brds,
      //  ...groupModelYear(modelsData),
      models: [],
      years: [],
      bodies: bdy,
      colors: clors,
    };
  }),
});
