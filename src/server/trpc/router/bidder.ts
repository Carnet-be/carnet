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
    return await ctx.prisma.bid.create({
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
      include:{
        auction:true
        
      }
    }).then((res) => {
      sendNotification({
        type:"new bid", 
        date: new Date(),
        auction_id: res.id,
        bidder_id: res.bidder_id,
        montant: res.montant,
        
        auctionnaire_id: res.auction.auctionnaire_id,
       })
       return res
    });
  }),

  getAuctionBidOnly: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.auction.findUnique({
        where: { id: input },
        
        select: { bids: { include: { bidder: true },orderBy:{
          montant:"desc"
        } } },
      });
    }),
});
