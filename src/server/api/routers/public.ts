
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


import { v4 as uuidv4 } from 'uuid';
import { env } from "~/env.mjs";
import s3 from "~/server/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import body from "~/server/db/schema/bodies";
import brand from "~/server/db/schema/brands";
import carOption from "~/server/db/schema/car_options";
import cities from "~/server/db/schema/cities";
import countries from "~/server/db/schema/countries";
import model from "~/server/db/schema/models";
import colors from "~/server/db/schema/colors";

const presignedUrl = publicProcedure.mutation(async()=>{
       const key=uuidv4()
      
       const url = await getSignedUrl(s3,new PutObjectCommand({
          Bucket: env.C_AWS_BUCKET,
          Key: `carnet/${key}`,
          ContentType: 'image/*'
        }))
        return {
          url,
          key
        }
})

export const publicRouter = createTRPCRouter({
  presignedUrl,
  carData: publicProcedure.query(({ ctx }) => {
    return ctx.db.transaction(async (trx) => {
      const ctries = await trx.select().from(countries).orderBy(countries.name);
      const cties = await trx.select().from(cities).orderBy(cities.name);
      const opts = await trx.select().from(carOption).orderBy(carOption.name);
      const brds = await trx.select().from(brand).orderBy(brand.name);
      const models = await trx.select().from(model).orderBy(model.name);
      const bdy = await trx.select().from(body);
      const clors = await trx.select().from(colors).orderBy(colors.id);
      return {
        countries: ctries,
        cities: cties,
        carOptions: opts,
        brands: brds,
        models: models,
        bodies: bdy,
        colors: clors,
      };
    });
  }),
});
