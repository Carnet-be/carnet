/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { BRAND } from "@data/internal";
import type { TAuction } from "@model/type";
import { AuctionState } from "@prisma/client";
import {
  type Data3,
  type Data4,
  type Data5,
  type Data6,
  type Data1,
  type Data7,
} from "@ui/createAuction";

import { ProcessDate } from "@utils/processDate";
import { ProcessUser } from "@utils/processUser";
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
      const data1: Data1 = input.data1;
      const data3: Data3 = input.data3;
      const data4: Data4 = input.data4;
      const data5: Data5 = input.data5;
      const data6: Data6 = input.data6;

      const processDate = new ProcessDate();
      const processUser = new ProcessUser(ctx.session!);
      //

      const duration = processDate.getDuration(data6.duration);
      //const end_date = processDate.endDate(duration);
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
      console.log("images", data6.images);
      const name=
      BRAND[data1.brand || 0]?.title +
      " " +
      BRAND[data1.brand || 0]?.model[data1.model || 0] +
      " " +
      data1.buildYear
      console.log("name",name)
      return await ctx.prisma.auction.create({
        data: {
          id,
          name,
          brand: data1.brand!,
          model: data1.model!,
          build_year: data1.buildYear!,
          fuel: data1.fuel,
          //images,
          description: data6.description,
          duration,
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
              lat: data6.lat!,
              lon: data6.lon!,
              address: data6.address,
            },
          },
          rating: {
            create: data4,
          },
          specs: {
            create: {
              carrosserie: data3.carrosserie,
              cc: data3.cc,
              cv: data3.cv,
              co2: data3.co2,
              kilometrage: data3.kilometrage,
              version: data3.version,
              transmission: data3.transmission,
              doors:data3.doors?parseInt(data3.doors):null,
            },
          },
          options: {
            create: data5,
          },
        },
      });
    }),
  pauseAuction: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.auction.update({
        where: { id: input },
        data: {
          state: AuctionState.pause,
          pause_date: new Date(),
        },
      });
    }),
  updateAuction: publicProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      const auction: TAuction = input.auction;
      const data1: Data1 = input.data1;
      const data3: Data3 = input.data3;
      const data4: Data4 = input.data4;
      delete input.data5.auction_id;
      const data5: Data5 = input.data5;
      const data7: Data7 = input.data7;
      const data6: Data6 = input.data6;

      const processDate = new ProcessDate(auction.createAt);
      //

      const duration = processDate.getDuration(data6.duration);
      const end_date = processDate.endDate(duration);

      console.log("images", data6.images);
      const idsImage = data6.images.map((dim) => dim.fileKey);
      const deleteImage = auction.images.filter(
        (im) => !idsImage.includes(im.fileKey)
      );
      const idsImageAdd = auction.images.map((dim) => dim.fileKey);
      const addImage = data6.images.filter(
        (im) => !idsImageAdd.includes(im.fileKey)
      );
      const auction_id = auction.id;
      const state: AuctionState = input.state;
      const starting_price=data7.starting_price==undefined?undefined: parseFloat(data7.starting_price.toString())
      const commission=data7.commission==undefined?undefined: parseFloat(data7.commission.toString())
      const starting_price_with_commission=starting_price==undefined ||commission==undefined?undefined:starting_price+starting_price*commission/100
      return ctx.prisma.$transaction([
        ctx.prisma.auction.update({
          where: { id: auction.id },
          data: {
            name: data6.name!,
            brand: data1.brand!,
            model: data1.model!,
            state,
            build_year: data1.buildYear!,
            fuel: data1.fuel,
            images: {
              deleteMany: deleteImage,
              createMany: {
                data: addImage,
              },
            },
            description: data6.description,
            duration,
            color: data1.color,
            end_date,
            
            starting_price,
            commission,
starting_price_with_commission,
            expected_price: parseFloat(data6.expected_price!.toString()),
          },
        }),
        ctx.prisma.auctionSpecs.update({
          where: { auction_id },
          data: {
            carrosserie: data3.carrosserie,
            cc: data3.cc,
            cv: data3.cv,
            co2: data3.co2,
            kilometrage: data3.kilometrage,
            version: data3.version,
            transmission: data3.transmission,
            doors: data3.doors?parseInt(data3.doors):null,
          },
        }),
        ctx.prisma.auctionOptions.update({
          where: { auction_id },
          data: data5,
        }),
        ctx.prisma.auctionRating.update({ where: { auction_id }, data: data4 }),
        ctx.prisma.address.update({
          where: { auction_id },
          data: {
            zipCode: data6.zipCode,
            city: data6.city,
            country: data6.country,
            lat: data6.lat,
            lon: data6.lon,
            address: data6.address,
          },
        }),
      ]);
    }),
  getAuctions: publicProcedure
    .input(
      z.object({
        state: z.enum(["pending", "published", "pause"]).nullish(),
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
      let condition = {};

      switch (input.filter) {
        case "mine":
          const user = await ctx.prisma.user.findUnique({
            where: { email: ctx.session?.user?.email || "" },
            select: {
              favoris_auctions: true,
            },
          });
          condition = { id: { in: user?.favoris_auctions } };
          break;

        default:
          break;
      }

      return await ctx.prisma.auction.findMany({
        where: {
          ...condition,
          state: input.state || undefined,
        },
        include: {
          bids: true,
          images: true,
          specs: true,
          rating: true,
          options: true,
          address: true,
        },
        orderBy: {
          createAt: "desc",
        },
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
        orderBy: {
          createAt: "desc",
        },
      });
    }),
  getMyAuctions: publicProcedure
    .input(z.object({ full: z.boolean().nullish() }))
    .query(async ({ input, ctx }) => {
      let more;
      if (input.full) {
        more = { specs: true, options: true, rating: true, address: true };
      }
      return await ctx.prisma.auction.findMany({
        where: {
          auctionnaire: {
            email: ctx.session?.user?.email || "",
          },
        },
        include: { bids: true, images: true, ...more },
        orderBy: {
          createAt: "desc",
        },
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

    getFavCount: publicProcedure.query(async ({ ctx }) => {
      const favorites = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email || "" },
        select: { favoris_auctions: true },
      });
      return favorites?.favoris_auctions.length || 0;
    })
});
