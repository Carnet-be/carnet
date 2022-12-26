/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Address, DurationType } from "@prisma/client";
import { previewFile } from "@ui/components/upload";
import {
  type Data3,
  type Data4,
  type Data5,
  type Data6,
  type Data1,
} from "@ui/createAuction";
import { cloudy } from "@utils/cloudinary";
import { ProcessDate } from "@utils/processDate";
import { ProcessUser } from "@utils/processUser";
import { getRandomNumber } from "@utils/utilities";
import { FileType } from "rsuite/esm/Uploader";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const auctionnaireRouter = router({
  get: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return await ctx.prisma.auction.findUnique({
      where: { id: input },
      include: {
       
        address: true,
        specs: true,
        options: true,
        rating: true,
        bids: {
          include:{
            bidder:true
          }
        },
      
      },
    });
  }),
  addAuction: publicProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      const data1: Data1 = input.data1;
      const data3: Data3 = input.data3;
      const data4: Data4 = input.data4;
      const data5: Data5 = input.data5;
      const data6: Data6 = input.data6;

      const processDate = new ProcessDate();
      const processUser = new ProcessUser(ctx.session!);
      //

      const duration = processDate.getDuration(data6.duration);
      const end_date = processDate.endDate(duration);
      // return
      const auctionnaire_id = await processUser.getId();

      let id = Math.random().toString().slice(2, 9);
      let incorrectId = true;
      while (incorrectId) {
        const count = await ctx.prisma.auction.count({ where: { id } });
        if (count === 0) {
          incorrectId = false;
        }else{
          id = Math.random().toString().slice(2, 9)
        }
      }
      console.log("id user", auctionnaire_id);
      return await ctx.prisma.auction.create({
        data: {
          id,
          name: data6.name!,
          brand: data1.brand!,
          model: data1.model!,
          build_year: data1.buildYear!,
          fuel: data1.fuel,
          //images,
          description: data6.description,
          duration,
          end_date,
          expected_price: parseFloat(data6.expected_price!.toString()),
          color: data1.color,

          auctionnaire: {
            connect: { id: auctionnaire_id },
          },
          address: {
            create: {
              zipCode: data6.zipCode,
              city: data6.city,
              country: data6.country,
              lat: data6.lat,
              lon: data6.lon,
              address: data6.address,
            },
          },
          rating: {
            create: data4,
          },
          specs: {
            create: {
              carrosserie: data3.carrosserie,
              cc: data3.cc!.toString(),
              cv: data3.cv!.toString(),
              co2: data3.co2!.toString(),
              kilometrage: data3.kilometrage!.toString(),
              version: data3.version,
              transmission: data3.transmission,
              doors: data3.doors,
            },
          },
          options: {
            create: data5,
          },
        },
      });
    }),
  getAuctions: publicProcedure
    .input(
      z.object({ filter: z.enum(["new", "trending", "feature", "buy now","all"])})
    )
    .query(async ({ ctx }) => {

 
      return await ctx.prisma.auction.findMany({
     
        include:{bids:true}}).then((auctions) =>
        auctions.map((a) => ({
          ...a,
          images: [`/assets/v${getRandomNumber(1, 5)}.png`],
        }))
      );
    }),
    getMyAuctions: publicProcedure
    .query(async ({ input, ctx }) => {

      return await ctx.prisma.auction.findMany({
        where:{
auctionnaire:{
  email:ctx.session?.user?.email||""
}
        },
        include:{bids:true}}).then((auctions) =>
        auctions.map((a) => ({
          ...a,
          images: [`/assets/v${getRandomNumber(1, 5)}.png`],
        }))
      );
    }),
  favorite: publicProcedure
    .input(
      z.object({ id: z.string(), action: z.enum(["add", "remove"]).nullable() })
    )
    .mutation(async ({ input, ctx }) => {
      const favorites = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email || "" },
        select: { favoris_auctions: true },
      });
      const add = () =>
        ctx.prisma.user.update({
          where: { email: ctx.session?.user?.email || "" },
          data: {
            favoris_auctions: [
              ...(favorites?.favoris_auctions || []),
              input.id,
            ],
          },
        });
      const remove = () =>
        ctx.prisma.user.update({
          where: { email: ctx.session?.user?.email || "" },
          data: {
            favoris_auctions: favorites?.favoris_auctions.filter(
              (f) => f != input.id
            ),
          },
        });
      switch (input.action) {
        case "add":
          return add();
        case "remove":
          return remove();
        default:
          return add();
      }
    })
});

const uploadImage = async (images: Array<string>) => {
  const result = await Promise.all(
    images.map((im, i) => {
      console.log("im.url", im);

      return cloudy.uploader.upload(
        im,
        {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        },
        async (error: any, result: any) => {
          console.log("error", error);
          console.log(i, result);
        }
      );
    })
  ).then((datas) => {
    console.log("Datas >", datas);
  });

  return [];
};
