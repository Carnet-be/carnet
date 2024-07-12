/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { clerkClient } from "@clerk/nextjs";
import cx from "classnames";
import Image from "next/image";

import BackButton from "~/app/_components/ui/backButton";
import Map from "~/app/_components/ui/map";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";
import {
  GarageItemContact,
  UserItemContact,
} from "../../garages/_components.client";
import { BidSection, ContentCarPage, ImagesSection } from "./_components";
export default async function CarPage({
  params,
  view = "user",
}: {
  params: any;
  view?: "admin" | "owner" | "user" | "garage";
}) {
  const carId: number = parseInt(params.carId!);
  const car = await api.car.getCarById.query({
    id: carId,
    full: true,
  });

  return (
    <div>
      {view != "garage" && <BackButton />}
      <div className="relative mb-10 flex flex-wrap justify-center gap-6">
        <LeftSide car={car} />
        <RightSide car={car} view={view} />
      </div>
    </div>
  );
}

const LeftSide = ({ car }: { car: RouterOutputs["car"]["getCarById"] }) => {
  console.log("car", car);
  return (
    <div className="flex  w-full flex-grow flex-col gap-3 lg:w-[57%]">
      <ImagesSection images={car.images} />

      <div className="py-2"></div>
      <ContentCarPage car={car} />
    </div>
  );
};

const RightSide = async ({
  car,
  view,
}: {
  car: RouterOutputs["car"]["getCarById"];
  mine?: boolean;
  view?: "admin" | "owner" | "user" | "garage";
}) => {
  let img: string | undefined = undefined;
  let name: string | undefined = undefined;

  try {
    if (car.belongsTo!.startsWith("user")) {
      const user = await clerkClient.users.getUser(car.belongsTo!);
      img = user?.imageUrl;
      name = user?.firstName + " " + user?.lastName;
    } else {
      const org = await clerkClient.organizations.getOrganization({
        organizationId: car.belongsTo!,
      });
      img = org?.imageUrl;
      name = org?.name;
    }
  } catch (error) {
    console.error("error", error);
  }

  return (
    <div className=" sticky right-0 top-0 w-full space-y-8 lg:w-[40%]">
      {car.type === "direct" && view !== "garage" && car.owner && (
        <GarageItemContact org={car.owner as any} profile={car.profile} />
      )}

      {car.type === "direct" && car.ownerUser && (
        <UserItemContact org={car.ownerUser} profile={car.profile} />
      )}
      <div className="w-full space-y-4 rounded-xl bg-white p-3">
        <div className="flex flex-row items-center justify-between gap-2 px-5">
          <div className="flex flex-col items-center font-semibold text-primary">
            <h6 className="text-lg">{car.name}</h6>
            {/* <span>{car.year}</span> */}
          </div>
          <span className="font-semibold text-gray-500">#{car.id}</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Body"}
            img={`/body/${car.body?.logo ?? "Coupe"}.svg`}
            value={car.body?.name ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={90}
            title={"Fuel"}
            img={"/images/fuel.png"}
            value={car.fuel ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Color"}
            value={car.color?.value}
            color={car.color?.name}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Transmission"}
            img={"/images/transmission.png"}
            value={car?.transmission ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Horse Power"}
            img={"/images/horse.png"}
            value={car.cc?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Mileage"}
            img={"/images/mileage.png"}
            value={car.kilometrage?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%] text-primary"
            size={110}
            title="CO2"
            img={"/images/CO2.svg"}
            value={car.co2?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Doors"}
            img={"/images/Doors.svg"}
            value={car.doors?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Engine Size"}
            img={"/images/engine.svg"}
            value={car.cc?.toString() ?? "-"}
          />
        </div>
      </div>
      {/* {car.type==="direct" ? (
        <Buy car={car} />
      ) : user?.type === "BID" ? (
        <>
          <CountDown
            variant="primary"
            onTimeOut={onTimeOut}
            endDate={car.end_date || new Date()}
          />
        </>
      ) : (
        <carStatus car={car} />
      )}
      {!isBuyNow && (
        <BidSection user={user} car={car} isTimeOut={isTimeOut} />
      )} */}
      {car.type === "auction" && <BidSection car={car} />}
      {car.lat && car.lon && (
        <Map
          center={{
            lat: car.lat,
            lng: car.lon,
          }}
          className="mt-10 h-[300px] w-full overflow-hidden rounded-xl bg-red-100"
          markers={[
            {
              lat: car.lat,
              lng: car.lon,
            },
          ]}
        />
      )}
    </div>
  );
};

const MiniCard = (props: {
  value?: string;
  img?: string;
  title?: string;
  imgClass?: string;
  size?: number;
  containerClass?: string;
  color?: string;
}) => {
  const { value, img, title, imgClass, size, containerClass, color } = props;

  return (
    <div
      className={cx(
        "bg-base-100 flex flex-col items-center justify-between gap-1 rounded-xl px-4  py-2 text-primary",
        containerClass,
        { [`h-[${size}px]`]: size },
      )}
    >
      <span className="text-[10px] text-gray-500">{title ? title : ""}</span>
      {img && (
        <div className={cx("relative h-[30px] w-full", imgClass)}>
          <Image alt="logo" src={img} fill className="object-contain" />
        </div>
      )}
      {color ? (
        <>
          <div
            style={{ backgroundColor: value }}
            className={cx("h-8 w-8 rounded-full border")}
          ></div>
          <span className="text-[12px]">{color}</span>
        </>
      ) : (
        <span className="text-[12px]">{value}</span>
      )}
    </div>
  );
};
