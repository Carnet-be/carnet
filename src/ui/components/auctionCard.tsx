import { type Auction } from "@prisma/client";
import { AuctionIcon, TimerIcon } from "@ui/icons";
import { ProcessAuction } from "@utils/processAuction";
import Image from "next/image";
import { getRandomNumber } from "../../utils/utilities";
import Swapper from "./swapper";
import { FavIcon, FavFillIcon } from "../icons";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { toast } from "react-hot-toast";
import CountDown from "./countDown";
import type { TAuction } from "@model/type";
import Price from "./price";
import cx from "classnames";
import { useRouter } from "next/router";
import DisplayImage from "./displayImage";
import cloudy from "@utils/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import CreateAuction from "@ui/createAuction";
import { useBidderStore } from "../../state";
type AuctionCardProps = {
  auction: TAuction;
  isFavorite?: boolean;
  mineAuction?: boolean;
  onClickFavorite?: () => void;
  onEdit?: () => void;
  refetch?: () => void;
  state?: "published" | "pause" | "completed" | "pending" | "confirmation";
};

export const NO_IMAGE_URL = "no-image_g27dbh";
const AuctionCard = ({
  auction,
  isFavorite,
  mineAuction,
  onClickFavorite,
  onEdit,
  refetch,
  state,
}: AuctionCardProps) => {
  const [fav, setfav] = useState(isFavorite);

  const increase = useBidderStore((state) => state.increase);
  const decrease = useBidderStore((state) => state.decrease);

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
          setfav(true);
          increase();
          break;
        case "remove":
          toast.success(onRemove);
          if (onClickFavorite) {
            onClickFavorite();
          }
          setfav(false);
          decrease();
          break;
        default:
          toast.success(onAdd);
          setfav(true);
          increase();
          break;
      }
    },
  });
  const router = useRouter();
  const src = !auction.images[0] ? NO_IMAGE_URL : auction.images[0].fileKey;
  console.log(src);
  return (
    <>
      {mineAuction && (
        <CreateAuction
          isAdmin={false}
          auction={auction}
          isEdit={true}
          id={auction.id}
          refetch={refetch}
        />
      )}

      <div
        onClick={() =>
          mineAuction
            ? undefined
            : router.push("/dashboard/bidder/auction/" + auction.id)
        }
        className={cx(
          "z-50 flex h-[270px] w-[310px] flex-col  gap-[40px] overflow-hidden rounded-2xl bg-base-100 drop-shadow-md",
          {
            "cursor-pointer": !mineAuction,
          }
        )}
      >
        <div className="relative w-full flex-grow ">
          <Image
            src={cloudy.image(src).toURL()}
            alt="image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex w-full flex-col justify-between gap-[0px] px-2 pb-2">
          <div className="flex flex-row items-end justify-between gap-1  text-primary">
            <div className="flex-grow font-semibold">
              <span
                className="cursor-pointer hover:underline"
                onClick={() =>
                  !mineAuction
                    ? undefined
                    : router.push("/dashboard/auctionnaire/auction/" + auction.id)
                }
              >
                {auction.name}
              </span>
            </div>
            {mineAuction && state != "published" ? (
              <span className="text-xs opacity-50">
                {state || auction.state}
              </span>
            ) : (
              <CountDown
                variant="secondary"
                onTimeOut={() => {
                  console.log("is time out");
                }}
                endDate={auction.end_date || auction.createAt}
              />
            )}
          </div>
          <hr className="my-1 h-0" />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="flex flex-row items-center gap-1 text-xs opacity-50">
                {auction.bids.length <= 0 ? "Initial bid" : "Current bid"} |{" "}
                <span className="flex flex-row items-center gap-1 text-primary">
                  {auction.bids.length} <AuctionIcon />
                </span>{" "}
              </span>

              <span className="flex flex-row items-center gap-2 font-semibold text-green">
                <Price
                  textStyle="text-base"
                  value={
                    auction.bids.length <= 0
                      ? auction.starting_price_with_commission
                      : auction.bids[auction.bids.length - 1]?.montant || 0
                  }
                />
              </span>
            </div>
            <div className="flex flex-row rounded-full bg-[#00A369]">
              {mineAuction ? (
                <label
                  onClick={onEdit}
                  htmlFor={auction.id}
                  className={cx(
                    "cursor-pointer rounded-full bg-primary p-[5px] px-3 text-white"
                  )}
                >
                  Edit
                </label>
              ) : (
                <>
                  <Link
                    href={"/dashboard/bidder/auction/" + auction.id}
                    className="rounded-full bg-green p-[5px] px-3 text-[13px] font-semibold text-white no-underline"
                  >
                    Bid Now
                  </Link>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      mutate({
                        id: auction.id,
                        action: fav ? "remove" : "add",
                      });
                    }}
                    className="p-1 pr-2 text-white"
                  >
                    {fav ? (
                      <FavFillIcon className="text-xl" />
                    ) : (
                      <FavIcon className="text-xl" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionCard;
