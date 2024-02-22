"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Skeleton,
} from "@nextui-org/react";
import { Mail, PhoneCall } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdVisibility } from "react-icons/md";
import { useInterval } from "usehooks-ts";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { z } from "zod";
import RatingStar from "~/app/_components/ui/ratingStar";
import useDate from "~/hooks/use-date";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { getCarImage, priceFormatter } from "~/utils/function";
export function ContentCarPage({
  car,
}: {
  car: RouterOutputs["car"]["getCarById"];
}) {
  const rating = [
    {
      title: "Handling",
      // list: HANDLING,
      rate: car?.handling,
    },
    {
      title: "Exterior",
      //list: EXTERIOR,
      rate: car?.exterior,
    },
    {
      title: "Interior",
      //  list: INTERIOR,
      rate: car?.interior,
    },
    {
      title: "Tires",
      //list: TIRES,
      rate: car?.tires,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5">
      <Card shadow="none">
        {car.description && (
          <CardHeader>
            <span className="min-w-[100px]">Description : </span>
          </CardHeader>
        )}
        <CardBody>
          <p className="whitespace-pre-line">{car.description}</p>
          {!car.description && (
            <div className="text-center font-light opacity-50">
              No description
            </div>
          )}
        </CardBody>
      </Card>

      <Card shadow="none">
        {car?.options?.length != 0 && (
          <CardHeader>
            <span className="min-w-[100px]">Options : </span>
          </CardHeader>
        )}
        <CardBody>
          <div className="flex flex-wrap gap-3">
            {car?.options?.map((k) => {
              return (
                <div
                  key={k.id}
                  className="rounded-xl border border-primary p-1 px-2 text-sm text-primary text-opacity-100 opacity-70 transition-all duration-300"
                >
                  {k.name}
                </div>
              );
            })}
            {car?.options?.length == 0 && (
              <div className="text-center font-light opacity-50">
                No options !
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Card shadow="none">
        {rating.filter((r) => !!r.rate).length != 0 && (
          <CardHeader>
            <span className="min-w-[100px]">Rating : </span>
          </CardHeader>
        )}
        <CardBody>
          {rating
            .filter((r) => !!r.rate)
            .map((r, i) => {
              return (
                <div key={i} className="flex flex-row items-center gap-2">
                  <h6 className="min-w-[100px]">{r.title} :</h6>

                  <RatingStar value={r.rate!} />
                </div>
              );
            })}
          {rating.filter((r) => !!r.rate).length == 0 && (
            <div className="text-center font-light opacity-50">No rating !</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export const BidSection = ({
  car,
}: {
  car: RouterOutputs["car"]["getCarById"];
}) => {
  const getTime = (data: Date | null | undefined) => {
    if (!data) return 0;
    return data.getTime() - new Date().getTime();
  };
  const [timeLeft, setTimeLeft] = useState<number>(getTime(car.endedAt));

  useInterval(
    () => {
      // Your custom logic here
      setTimeLeft(getTime(car.endedAt));
    },
    // Delay in milliseconds or null to stop it
    true ? 1000 : null,
  );

  //format second to XXd XXh
  const formatTime = (time: number) => {
    const day = Math.floor(time / (1000 * 60 * 60 * 24));
    const hour = Math.floor((time / (1000 * 60 * 60)) % 24);
    // const min = Math.floor((time / (1000 * 60)) % 60);
    // const sec = Math.floor((time / 1000) % 60);
    //return `${day}d ${hour}h ${min}m ${sec}s`;
    return `${day}d ${hour}h`;
  };
  const { dayjs } = useDate();
  const {
    data: bids,
    isLoading: gettingBids,
    refetch,
  } = api.car.getBidsCount.useQuery(car.id!);
  const getMaxBid = () => {
    let maxBid: RouterOutputs["car"]["getBidsCount"][number] | undefined =
      undefined;
    if (bids === undefined) {
      return maxBid;
    }
    for (let i = 0; i < bids!.length; i++) {
      if (maxBid === undefined || maxBid?.amount < bids[i]!.amount) {
        maxBid = bids[i];
      }
    }
    return maxBid;
  };
  const bidSchema = z.object({
    amount: z
      .number({
        required_error: "Please enter a valid amount",
      })
      .min((getMaxBid()?.amount ?? car.startingPrice ?? 0) + 100, {
        message: "Minimum bid is 100€ more than the current bid",
      }),
  });

  const { formState, control, trigger, getValues, reset } = useForm<
    z.infer<typeof bidSchema>
  >({
    resolver: zodResolver(bidSchema),
  });

  const { mutate: addBid, isLoading: isAddingBid } = api.car.addBid.useMutation(
    {
      onSuccess: () => {
        toast.success("You have successfully placed a bid");
        reset();
        void refetch();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Something went wrong");
      },
    },
  );
  return (
    <div className="space-y-4 py-7">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-gray-100 p-3">
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold text-black">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[12px] text-gray-500">Time left</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold text-black">
            {dayjs(car.endedAt).format("MMM DD, LT")}
          </span>
          <span className="text-[12px] text-gray-500">Auction ends</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          {gettingBids ? (
            <Skeleton className="h-[20px] w-[40px] rounded-md" />
          ) : (
            <span className="font-semibold text-black">
              {bids?.length ?? 0}
            </span>
          )}
          <span className="text-[12px] text-gray-500">Active bid</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          {gettingBids ? (
            <Skeleton className="h-[20px] w-[40px] rounded-md" />
          ) : (
            <span className="font-semibold text-black">
              {priceFormatter.format(
                getMaxBid()?.amount ?? car.startingPrice ?? 0,
              )}
            </span>
          )}
          <span className="text-[12px] text-gray-500">Current bid</span>
        </div>
      </div>
      <div>
        <div className="flex items-end gap-3 pt-3">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">€</span>
                  </div>
                }
                labelPlacement="outside"
                type="number"
                step={100}
                onBlur={field.onBlur}
                value={field.value?.toString()}
                onChange={(v) => {
                  console.log(v.target.value);
                  field.onChange(parseFloat(v.target.value));
                }}
                variant="bordered"
                label={`Entrer your bid (Minimum ${priceFormatter.format(
                  (getMaxBid()?.amount ?? car.startingPrice ?? 0) + 100,
                )})`}
              />
            )}
          />
          <Button
            isLoading={isAddingBid}
            onClick={async () => {
              await trigger();
              if (!formState.isValid) return;
              addBid({
                carId: car.id!,
                amount: getValues("amount"),
              });
            }}
            color="primary"
          >
            Place bid
          </Button>
        </div>
        <span className="text-sm text-red-500">
          {formState.errors.amount?.message ?? formState.errors.amount?.message}
        </span>
      </div>
      <div className="flex max-h-[400px]  flex-col items-center justify-between gap-4 overflow-y-scroll rounded-md bg-gray-100 p-3">
        {bids?.map((bid, i) => {
          const num = bids?.length - i;
          return (
            <div
              key={i}
              className="flex w-full flex-row items-center justify-between"
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary text-sm text-white">
                  {num}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-500">
                    #{bid?.id}
                  </span>
                  <span className="text-[12px] text-gray-500">
                    {dayjs(bid?.createdAt).fromNow()}
                  </span>
                </div>
              </div>
              <span className="font-semibold text-black">
                {priceFormatter.format(bid?.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ContactSection = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div className="flex w-[50px] items-center justify-center">
          <PhoneCall size={20} />
        </div>
        <span className="">00 1243 654 789</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex w-[50px] items-center justify-center">
          <Mail size={20} />
        </div>
        <span className="">nima.contact@gmail.com</span>
      </div>
      {!show && (
        <div
          onClick={() => {
            setShow(true);
          }}
          className="absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center gap-2 backdrop-blur-md"
        >
          <MdVisibility className="text-lg" />
          Show contact
        </div>
      )}
    </div>
  );
};

export const ImagesSection = ({ images }: { images: string[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="relative flex aspect-[3/2] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border bg-white">
        <Image
          onClick={() => setOpen(true)}
          src={getCarImage(images[0])}
          alt="photo"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-md bg-primary p-1 px-2 text-white">
            {images.length} photos
          </span>
        </div>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((img) => {
          return {
            src: getCarImage(img),
          };
        })}
      />
    </div>
  );
};
