/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { TAuction } from "@model/type";
import { TRPCClientError } from "@trpc/client";
import {
  type Data3,
  type Data4,
  type Data5,
  type Data6,
  type Data1,
} from "@ui/createAuction";

import { ProcessDate } from "@utils/processDate";
import { ProcessUser } from "@utils/processUser";
import { getRandomNumber } from "@utils/utilities";
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
        images: true,
        bids: {
          include: {
            bidder: true,
          },
        },
      },
    });
  }),
  addAuction: publicProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      const idAcution=input.id
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
        } else {
          id = Math.random().toString().slice(2, 9);
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
          images: {
            createMany: {
              data: data6.images,
            },
          },
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
   updateAuction: publicProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      const auction:TAuction=input.auction
      const data1: Data1 = input.data1;
      const data3: Data3 = input.data3;
      const data4: Data4 = input.data4;
      delete input.data5.auction_id
      const data5: Data5 = input.data5;
     
      const data6: Data6 = input.data6;

      const processDate = new ProcessDate(auction.createAt);
      const processUser = new ProcessUser(ctx.session!);
      //

      const duration = processDate.getDuration(data6.duration);
      const end_date = processDate.endDate(duration);

console.log("images",data6.images)
const idsImage=data6.images.map((dim)=>dim.fileKey)
const deleteImage=auction.images.filter((im)=>!idsImage.includes(im.fileKey))
const idsImageAdd=auction.images.map((dim)=>dim.fileKey)
const addImage=data6.images.filter((im)=>!idsImageAdd.includes(im.fileKey))
const auction_id=auction.id
      return ctx.prisma.$transaction([
        ctx.prisma.auction.update({where:{  id:auction.id},data:{
          name: data6.name!,
          brand: data1.brand!,
          model: data1.model!,
          build_year: data1.buildYear!,
          fuel: data1.fuel,
          images:{
            deleteMany:deleteImage,
            createMany:{
              data:addImage
            }
          },
          description: data6.description,
          duration,
          color: data1.color,
          end_date,
          expected_price: parseFloat(data6.expected_price!.toString()),
        }}),
        ctx.prisma.auctionSpecs.update({where:{auction_id},data:{
          carrosserie: data3.carrosserie,
          cc: data3.cc!.toString(),
          cv: data3.cv!.toString(),
          co2: data3.co2!.toString(),
          kilometrage: data3.kilometrage!.toString(),
          version: data3.version,
          transmission: data3.transmission,
          doors: data3.doors,
        }}),
        ctx.prisma.auctionOptions.update({where:{auction_id},data:data5}),
        ctx.prisma.auctionRating.update({where:{auction_id},data:data4}),
        ctx.prisma.address.update({where:{auction_id},data:{
          zipCode: data6.zipCode,
          city: data6.city,
          country: data6.country,
          lat: data6.lat,
          lon: data6.lon,
          address: data6.address,
        }}),
      ])
      
    }),
  getAuctions: publicProcedure
    .input(
      z.object({
        filter: z.enum([
          "new",
          "trending",
          "feature",
          "buy now",
          "all",
          "mine",
        ]),
      })
    )
    .query(async ({ input, ctx }) => {
     let condition={}
      switch (input.filter) {
        case "mine":
          const user = await ctx.prisma.user.findUnique({
            where: { email: ctx.session?.user?.email || "" },
            select: {
              favoris_auctions: true,
            },
          });
          condition={where:{id:{in:user?.favoris_auctions}}}
          break;
      
        default:
          break;
      }
      return await ctx.prisma.auction.findMany({
        ...condition,
        include: { bids: true, images: true },
        orderBy:{
          createAt:'desc'
        }
      });
    }),
  getBids: publicProcedure
    .input(z.object({ filter: z.enum(["all", "mine"]) }))
    .query(async ({ input, ctx }) => {
      let condition;
      switch (input.filter) {
        case "mine":
          condition = {
            where: {
              bidder: {
                email: ctx.session?.user?.email || "",
              },
            },
          };
          break;

        default:
          break;
      }
      return await ctx.prisma.bid.findMany({
        ...condition,
        include: {
          bidder: true,
          auction: { include: { auctionnaire: true, bids: true } },
        },
        orderBy:{
          createAt:'desc'
        }
      });
    }),
  getMyAuctions: publicProcedure.input(z.object({full:z.boolean().nullish()})).query(async ({input, ctx }) => {

    let more
    if(input.full){
      more={specs:true,options:true,rating:true,address:true}
    }
    return await ctx.prisma.auction.findMany({
      where: {
        auctionnaire: {
          email: ctx.session?.user?.email || "",
        },
      },
      include: { bids: true, images: true,...more },
      orderBy:{
        createAt:'desc'
      }
    });
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
    }),
});
