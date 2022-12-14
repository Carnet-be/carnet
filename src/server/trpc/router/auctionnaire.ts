
import { z } from "zod";
import { router,publicProcedure } from "../trpc";


export const auctionnaireRouter=router({
   addAuction: publicProcedure.input(z.any()).mutation(async({input,ctx})=>{
    console.log("request > ",input.data1);
   
   // return 
    return "Coucou 👀"
   })
    
  });
  