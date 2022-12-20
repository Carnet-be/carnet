import { type Auction } from "@prisma/client";
import { TimerIcon } from "@ui/icons";
import { ProcessAuction } from "@utils/processAuction";
import Image from "next/image"
import { getRandomNumber } from '../../utils/utilities';
import Swapper from './swapper';
import { FavIcon, FavFillIcon } from '../icons';
type AuctionCardProps = {
  auction: Auction;
};


const AuctionCard = ({ auction }: AuctionCardProps) => {
const src=auction.images.length>0 && auction.images[0]?auction.images[0]:`/assets/v${getRandomNumber(1,5)}.png`
const util=new ProcessAuction(auction)
  return (
    <div className="w-[330px] h-[270px] rounded-xl bg-base-100  drop-shadow-md flex flex-col p-3">
       <div className="flex-grow w-full">
       {/* <Image src={src} alt="image" fill/> */}
       </div>
        <div className="w-full  flex flex-col justify-between gap-[0px]">
           <div className="flex flex-row justify-between gap-1 items-end  text-primary">
              <div  className="flex-grow font-semibold">
              <span>{auction.name}</span>
                </div>
                <span className="whitespace-nowrap text-[12px] flex flex-row gap-1 items-center">
              <TimerIcon/>
           
              {util.getDurationType()}
            
              {" | "}
              {util.getTimer()}
        
              
            </span>
           </div>
           <hr className="h-0 my-1"/>
           <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
               <span className="text-xs opacity-50">Current bid</span>

               <span className="text-green flex flex-row items-center gap-2 font-semibold"><span className="text-lg">€</span> 24000</span>
            </div>
            <div className="bg-[#00A369] flex flex-row rounded-full">
             <button className="bg-green text-white rounded-full p-[5px] px-3 text-[13px] font-semibold">
                Bid Now
             </button>
             <button className="p-1 pr-2 text-white">
                <FavFillIcon className="text-xl"/>
                </button>
            </div>
            </div>
        </div>
    </div>
  );
};

export default AuctionCard;
