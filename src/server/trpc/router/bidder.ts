/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProcessUser } from "@utils/processUser";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { sendNotification } from "@repository/index";

const ZAddBid = z.object({
  price: z.number(),
  auctionId: z.string(),
  number: z.number(),
});
export const bidderRouter = router({
  add: publicProcedure.input(ZAddBid).mutation(async ({ input, ctx }) => {
    const processUser = new ProcessUser(ctx.session);
    const bidder_id = await processUser.getId();

    let id = Math.random().toString().slice(2, 13);
    let incorrectId = true;
    while (incorrectId) {
      const count = await ctx.prisma.bid.count({ where: { id } });
      if (count === 0) {
        incorrectId = false;
      } else {
        id = Math.random().toString().slice(2, 13);
      }
    }
    const num: any = await ctx.prisma.auction.findUnique({
      where: { id: input.auctionId },
      select: { bids: true },
    });
    return await ctx.prisma.bid
      .create({
        data: {
          id,
          montant: input.price,
          numero: num.bids.length + 1,
          auction: {
            connect: { id: input.auctionId },
          },
          bidder: {
            connect: { id: bidder_id },
          },
        },
        include: {
          auction: true,
        },
      })
      .then(async (res) => {
        const getLastBidder = await ctx.prisma.bid.findFirst({
          where: { auction_id: res.auction_id, numero: res.numero - 1 },
        });
        sendNotification({
          type: "new bid",
          date: new Date(),
          auction_id: res.auction_id,
          bidder_id: res.bidder_id,
          last_bidder_id: getLastBidder?.bidder_id,
          montant: res.montant,
          auction_name: res.auction.name,
          auctionnaire_id: res.auction.auctionnaire_id,
        });
        return res;
      });
  }),

  getAuctionBidOnly: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.auction.findUnique({
        where: { id: input },

        select: {
          bids: {
            include: { bidder: true },
            orderBy: {
              montant: "desc",
            },
          },
        },
      });
    }),

  setInterested: publicProcedure
    .input(
      z.object({
        models: z.array(z.number()),
        brands: z.array(z.number()),
        carrosserie: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        select: { id: true },
        where: { email: ctx.session?.user?.email || "" },
      });
      if (!user) return null;
      const interested = await ctx.prisma.interest.findFirst({
        where: { user_id: user.id },
      });
      if (interested) {
        return await ctx.prisma.interest.update({
          where: { id: interested.id },
          data: {
            models: {
              connect: input.models.map((model) => ({ id: model })),
            },
            brands: {
              connect: input.brands.map((brand) => ({ id: brand })),
            },
            carrosserie: input.carrosserie,
          },
        });
      }
      return await ctx.prisma.interest.create({
        data: {
          models: {
            connect: input.models.map((model) => ({ id: model })),
          },
          brands: {
            connect: input.brands.map((brand) => ({ id: brand })),
          },
          carrosserie: input.carrosserie,
          user: {
            connect: { id: user.id },
          },
        },
      });
    }),

  getInterested: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.interest.findFirst({
      where: {
        user: {
          email: ctx.session?.user?.email || "",
        },
      },
      include: {
        brands: {
          select: {
            id: true,
            name: true,
          },
        },
        models: true,
      },
    });
  }),
});
