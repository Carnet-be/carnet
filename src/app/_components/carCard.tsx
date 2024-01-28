import { Button, cn } from "@nextui-org/react";
import { type InferSelectModel } from "drizzle-orm";
import { type assets, type cars } from "drizzle/schema";
import Image from "next/image";
import Link from "next/link";
import { getCarImage, priceFormatter } from "~/utils/function";
import { AuctionIcon } from "./icons";

export const getPrice = ({
  type,
  maxPrice,
  minPrice,
  startingPrice,
  inRange,
  price,
}: {
  type: InferSelectModel<typeof cars>["type"];
  inRange: boolean | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  startingPrice?: number | null;
  price?: number | null;
}) => {
  if (type == "direct") {
    if (inRange && minPrice && maxPrice) {
      return `${minPrice}-${maxPrice}`; //priceFormatter.formatRange(car.minPrice, car.maxPrice)
    }
    if (price) {
      return priceFormatter.format(price);
    }
  } else {
    return priceFormatter.format(startingPrice ?? 0);
  }
};

const CarCard = ({
  children: car,
  className,
}: {
  children: InferSelectModel<typeof cars> & {
    images: InferSelectModel<typeof assets>[];
  };
  className?: string;
}) => {
  const primaryImage = getCarImage(car.images?.[0]?.key);

  return (
    <div
      style={{
        boxShadow: "0px 0px 65px -58px rgba(0,0,0,0.7)",
      }}
      className={cn("overflow-hidden rounded-xl bg-gray-50", className)}
    >
      <div className="relative aspect-[5/3]">
        <Image
          priority
          src={primaryImage}
          layout="fill"
          objectFit="cover"
          alt={car.name}
        />
      </div>
      <div className="space-y-1 p-3">
        <div className="flex flex-row items-center justify-between gap-1">
          <span className="text-sm font-semibold text-black">{car.name}</span>
          {car.type === "auction" && <AuctionIcon className="text-primary" />}
        </div>
        <hr />
        <div className="flex flex-row items-start justify-between gap-1">
          <span className="font-semibold text-primary">
            {getPrice({
              startingPrice: car.startingPrice,
              inRange: car.inRange == 1 ? true : false,
              maxPrice: car.maxPrice,
              minPrice: car.minPrice,
              price: car.price,
              type: car.type,
            })}
          </span>
          <Link href={`/dashboard/car/${car.id}`}>
            <Button size="sm" color="primary" variant="flat">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
