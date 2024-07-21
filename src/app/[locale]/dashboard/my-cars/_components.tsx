/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@clerk/nextjs";
import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import cx from "classnames";
import { type InferSelectModel } from "drizzle-orm";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Animation from "~/app/_components/Animation";
import { ModalCheckContact } from "~/app/_components/Sidebar";
import { getPrice } from "~/app/_components/carCard";
import { AuctionIcon } from "~/app/_components/icons";
import LoadingSection from "~/app/_components/ui/LoadingSection";
import Retry from "~/app/_components/ui/retry";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { getCarImage } from "~/utils/function";
import animationData from "../../../../../public/animations/location.json";
import { type cars } from "../../../../server/db/schema";
export const CarsSection = () => {
  const { orgId, userId } = useAuth();
  const { data, isError, isLoading, refetch } = api.car.getMyCars.useQuery(
    orgId ?? userId,
  );

  const t = useTranslations("dashboard.my cars");
  if (isLoading) {
    return <LoadingSection />;
  } else if (isError) {
    return <Retry onClick={refetch} />;
  }
  if (data?.length == 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <span className="text-2xl font-semibold">{t("no cars")}</span>
      </div>
    );
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
  const t = useTranslations("common");
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
              {t("edit")}
            </Button>
          </Link>
          <Link href={`/dashboard/car/${car.id}`}>
            <Button size="sm">{t("details")}</Button>
          </Link>
        </div>
      </div>
      <div className="absolute right-2 top-2">
        <StatusTag>{t(car.status) as any}</StatusTag>
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

export const BannierAddAuction = () => {
  const utils = api.useContext();
  const [loadin, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const t = useTranslations("dashboard.text");
  const c = useTranslations("common");
  return (
    <div
      className={cx(
        "mx-auto flex h-[250px] max-w-[900px] flex-row items-center justify-between rounded-xl bg-primary p-10 drop-shadow-xl",
      )}
    >
      <div className="flex max-w-[400px] flex-grow flex-col gap-4 space-y-6">
        <p className="text-xl font-bold text-white">{t("bannerText")}</p>
        <Button
          isLoading={loadin}
          onClick={async () => {
            setLoading(true);
            const exist = await utils.profile.existProfile.fetch();
            setLoading(false);
            if (!exist) {
              onOpen();
              return;
            }
            router.push("/forms/car/new");
          }}
          className="w-[200px] cursor-pointer rounded-xl bg-white px-4 py-2 text-center text-primary no-underline"
        >
          {c("add car")}
        </Button>
      </div>
      <div className="w-[330px]">
        <Animation animationData={animationData} />
      </div>
      <ModalCheckContact isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};
