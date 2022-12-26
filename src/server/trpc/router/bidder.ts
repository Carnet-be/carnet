import { ProcessUser } from "@utils/processUser";
import { z } from "zod";
import { publicProcedure,router } from "../trpc";


const ZAddBid=z.object({price:z.number(),auctionId:z.string()})
export const bidderRouter = router({
    add: publicProcedure.input(ZAddBid).mutation(async({input,ctx})=>{
        const processUser = new ProcessUser(ctx.session);
        const bidder_id = await processUser.getId();
  
        let id = Math.random().toString().slice(2, 13);
        let incorrectId = true;
        while (incorrectId) {
          const count = await ctx.prisma.auction.count({ where: { id } });
          if (count === 0) {
            incorrectId = false;
          }else{
            id = Math.random().toString().slice(2, 13);
          }
        }
        return await ctx.prisma.bid.create({data:{
            id,
            montant:input.price,
            auction:{
                connect:{id:input.auctionId}
            },
            bidder:{
                connect:{id:bidder_id}
            }

        }})
    }),

    getAuctionBidOnly:publicProcedure.input(z.string()).query(async({input,ctx})=>{
        return await ctx.prisma.auction.findUnique({where:{id:input},select:{bids:{include:{bidder:true}}}})
    })
    
  });
  