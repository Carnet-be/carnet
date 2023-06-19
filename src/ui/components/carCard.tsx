import { type Auction } from "@prisma/client";
import { AuctionIcon, DeleteIcon, TimerIcon } from "@ui/icons";
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
import type { TAuction, TCar } from "@model/type";
import Price from "./price";
import cx from "classnames";
import { useRouter } from "next/router";
import DisplayImage from "./displayImage";
import cloudy from "@utils/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import CreateAuction from "@ui/createAuction";
import { useBidderStore } from "../../state";
import { useConfirmation, useLang, useNotif } from "../../pages/hooks";
import { Button } from "antd";
import { Modal } from "antd";
const { confirm } = Modal;
import ConfirmationDialog from "./confirmation";
import { BsExclamation } from "react-icons/bs";
import CreateAuctionCar from "@ui/createAuction/car";
type AuctionCardProps = {
  auction: TCar;
  // isFavorite?: boolean;
  mineAuction?: boolean;
  onClickFavorite?: () => void;
  onEdit?: () => void;
  refetch?: () => void;
  state?: "published" | "pause" | "completed" | "pending" | "confirmation";
};

export const NO_IMAGE_URL = "no-image_g27dbh";
const CarCard = ({
  auction,
  // isFavorite,
  mineAuction,
  onEdit,
  refetch,
  state,
}: AuctionCardProps) => {
  const { text } = useLang({ file: "dashboard", selector: "auction" });
  const { text: common } = useLang(undefined);
  const { error, succes } = useNotif();
  const { show } = useConfirmation();
  const increase = useBidderStore((state) => state.increase);
  const decrease = useBidderStore((state) => state.decrease);

  const router = useRouter();
  const { loading, error: er, succes: suc } = useNotif();
  const src = !auction.images[0] ? NO_IMAGE_URL : auction.images[0].fileKey;
  console.log(src);
  const { mutate: deleteAuction } = trpc.global.delete.useMutation({
    onMutate: () => {
      loading();
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      er();
    },
    onSuccess: () => {
      toast.dismiss();
      suc();
      if (refetch) refetch();
    },
  });
  return (
    <>
      {mineAuction && (
        <CreateAuctionCar
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
            : router.push("/dashboard/user/cars/" + auction.id)
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
                    : router.push("/dashboard/entreprise/car/" + auction.id)
                }
              >
                {auction.name}
              </span>
            </div>
            {mineAuction && state != "published" && (
              <span className="text-xs opacity-50">
                {text("status." + state || auction.state)}
              </span>
            )}
          </div>
          <hr className="my-1 h-0" />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="flex flex-row items-center gap-2 font-semibold text-green">
                <Price textStyle="text-base" value={auction.price} />
              </span>
            </div>
            <div className="flex flex-row rounded-full bg-[#00A369]">
              {mineAuction ? (
                <div className="flex flex-row items-center gap-1 bg-white">
                  <Button
                    onClick={() => {
                      show(() =>
                        deleteAuction({
                          id: auction.id,
                          table: "car",
                        })
                      );
                    }}
                    color="error"
                    danger
                    className="rounded-full"
                  >
                    <DeleteIcon />
                  </Button>

                  <label
                    onClick={onEdit}
                    htmlFor={auction.id}
                    className={cx(
                      "cursor-pointer rounded-full bg-primary p-[5px] px-3 text-white"
                    )}
                  >
                    {common("button.edit")}
                  </label>
                </div>
              ) : (
                <>
                  <Link
                    href={"/dashboard/user/auction/" + auction.id}
                    className="rounded-full bg-green p-[5px] px-3 text-[13px] font-semibold text-white no-underline"
                  >
                    {common("button.buy")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarCard;

type CarCardReadOnlyProps = {
  auction: TCar;
  // isFavorite?: boolean;
};

export const CarCardReadOnly = ({ auction }: CarCardReadOnlyProps) => {
  const { text: common } = useLang(undefined);

  const router = useRouter();
  const src = !auction.images[0] ? NO_IMAGE_URL : auction.images[0].fileKey;

  return (
    <>
      <div
        onClick={() => router.push("/dashboard/user/cars/" + auction.id)}
        className={cx(
          " flex h-[270px] flex-col  gap-[40px] overflow-hidden rounded-2xl bg-base-100 drop-shadow-md",
          {
            "cursor-pointer": true,
          }
        )}
      >
        <div className="relative flex-grow ">
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
              <span>{auction.name}</span>
            </div>
          </div>
          <hr className="my-1 h-0" />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="flex flex-row items-center gap-2 font-semibold text-green">
                <Price textStyle="text-base" value={auction.price} />
              </span>
            </div>
            <div className="flex flex-row rounded-full bg-[#00A369]">
              <Link
                href={"/dashboard/user/cars/" + auction.id}
                className="rounded-full bg-green p-[5px] px-3 text-[13px] font-semibold text-white no-underline"
              >
                {common("button.buy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
