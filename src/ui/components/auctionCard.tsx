import { type Auction } from "@prisma/client";
import { TimerIcon } from "@ui/icons";
import { ProcessAuction } from "@utils/processAuction";
import Image from "next/image";
import { getRandomNumber } from "../../utils/utilities";
import Swapper from "./swapper";
import { FavIcon, FavFillIcon } from "../icons";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { toast } from "react-hot-toast";
type AuctionCardProps = {
  auction: Auction;
  isFavorite: boolean;
};

const AuctionCard = ({ auction, isFavorite }: AuctionCardProps) => {
  const [fav, setfav] = useState(isFavorite);
  const src =
    auction.images.length > 0 && auction.images[0]
      ? auction.images[0]
      : `/assets/v${getRandomNumber(1, 5)}.png`;
  const util = new ProcessAuction(auction);
  const { mutate } = trpc.auctionnaire.favorite.useMutation({
    onError: (err) => {
      console.log("Error lors d'ajout au fav", err);
      toast.error("Echec de l'opération");
    },
    onSuccess(data, variables) {
      const onAdd = "Vous avec ajouté au favori";
      const onRemove = "Vous avec retiré des favoris";
      switch (variables.action) {
        case "add":
          toast.success(onAdd);
          setfav(true)
          break;
        case "remove":
          toast.success(onRemove);
          setfav(false)
          break;
        default:
          toast.success(onAdd);
          setfav(true)
          break;
      }
    },
  });
  return (
    <div className="flex h-[270px] w-[330px] flex-col  rounded-2xl bg-base-100 p-3 drop-shadow-md">
      <div className="relative w-full flex-grow p-2">
        <Image src={src} alt="image" fill className="object-contain" />
      </div>
      <div className="flex  w-full flex-col justify-between gap-[0px]">
        <div className="flex flex-row items-end justify-between gap-1  text-primary">
          <div className="flex-grow font-semibold">
            <span>{auction.name}</span>
          </div>
          <span className="flex flex-row items-center gap-1 whitespace-nowrap text-[12px]">
            <TimerIcon />

            {util.getDurationType()}

            {" | "}
            {util.getTimer()}
          </span>
        </div>
        <hr className="my-1 h-0" />
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs opacity-50">Current bid</span>

            <span className="flex flex-row items-center gap-2 font-semibold text-green">
              <span className="text-lg">€</span> 24000
            </span>
          </div>
          <div className="flex flex-row rounded-full bg-[#00A369]">
            <Link
              href={"/dashboard/bidder/auction/" + auction.id}
              className="rounded-full bg-green p-[5px] px-3 text-[13px] font-semibold text-white no-underline"
            >
              Bid Now
            </Link>
            <button
              onClick={() => {
                mutate({id:auction.id,action:fav?"remove":"add"})
              }}
              className="p-1 pr-2 text-white"
            >
              {fav ? (
                <FavFillIcon className="text-xl" />
              ) : (
                <FavIcon className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
