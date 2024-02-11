/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@nextui-org/react";
import { type InferSelectModel } from "drizzle-orm";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPrice } from "~/app/_components/carCard";
import { AuctionIcon } from "~/app/_components/icons";
import LoadingSection from "~/app/_components/ui/LoadingSection";
import Retry from "~/app/_components/ui/retry";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { getCarImage } from "~/utils/function";
import { type cars } from "../../../server/db/schema";

export const CarsSection = () => {
  const { data, isError, isLoading, refetch } = api.car.getMyCars.useQuery();

  if (isLoading) {
    return <LoadingSection />;
  } else if (isError) {
    return <Retry onClick={refetch} />;
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {data?.map((car) => (
        <CarCard key={car.id} className="bg-white">
          {car}
        </CarCard>
      ))}
    </div>
  );
};

const CarCard = ({
  children: car,
  className,
}: {
  children: RouterOutputs["car"]["getMyCars"][number];
  className?: string;
}) => {
  const primaryImage = getCarImage(car.images?.[0]?.key);

  return (
    <div
      style={{
        boxShadow: "0px 0px 65px -58px rgba(0,0,0,0.7)",
      }}
      className={cn(
        "relative aspect-[.8] overflow-hidden rounded-xl bg-gray-50",
        className,
      )}
    >
      <Image
        src={primaryImage}
        layout="fill"
        objectFit="cover"
        alt={car.name}
      />
      <div className="absolute left-0 top-0 flex h-full w-full flex-col justify-end space-y-[2px] bg-gradient-to-t from-black/70 to-30% p-2">
        <div className="flex flex-row items-center justify-between gap-1">
          <span className="text-sm font-semibold text-white">{car.name}</span>
          {car.type === "auction" && <AuctionIcon className="text-primary" />}
        </div>

        <div className="flex flex-row items-start justify-between gap-1">
          <span className="font-semibold text-green-300 ">
            {getPrice({
              startingPrice: car.startingPrice,
              type: car.type,
              inRange: car.inRange,
              minPrice: car.minPrice,
              maxPrice: car.maxPrice,
              price: car.price,
            })}
          </span>
        </div>
        <div className="flex flex-row items-center justify-end gap-3">
          <Link href={`/forms/car/${car.id}`}>
            <Button startContent={<Edit size={15} />} color="primary" size="sm">
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/car/${car.id}`}>
            <Button size="sm">Details</Button>
          </Link>
        </div>
      </div>
      <div className="absolute right-2 top-2">
        <StatusTag>{car.status}</StatusTag>
      </div>
    </div>
  );
};

export default CarCard;

const StatusTag = ({
  children,
}: {
  children: InferSelectModel<typeof cars>["status"];
}) => {
  const color =
    children === "pending"
      ? "warning"
      : children === "published"
      ? "success"
      : "secondary";

  const description = () => {
    switch (children) {
      case "pending":
        return "Your car is pending for approval";
      case "published":
        return "Your car is published";
      case "paused":
        return "Your car is paused";
      case "finished":
        return "Your auction is expired";
      case "completed":
        return "Your auction is completed";
      case "sold":
        return "Your car is sold";
      default:
        return "";
    }
  };
  return (
    <Popover
      showArrow
      backdrop="opaque"
      placement="right"
      classNames={{
        base: [
          // arrow color
          "before:bg-default-200",
        ],
      }}
    >
      <PopoverTrigger>
        <Chip
          color={color}
          title={children}
          className="font-bold capitalize text-white"
        >
          {children}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="border border-default-200 bg-gradient-to-br from-white to-default-300 px-4 py-3 dark:from-default-100 dark:to-default-50">
        {() => (
          <div className="px-1 py-2">
            <div className="text-tiny">{description()}</div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
