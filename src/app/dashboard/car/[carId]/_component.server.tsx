/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { auth, clerkClient } from "@clerk/nextjs";
import cx from "classnames";
import Image from "next/image";
import Map from "~/app/_components/ui/map";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";
import {
  BidSection,
  ContactSection,
  ContentCarPage,
  ImagesSection,
} from "./_components";
export default async function CarPage({ params }: any) {
  const carId: number = parseInt(params.carId!);
  const car = await api.car.getCarById.query(carId);
  const user = auth();
  const mine = car.belongsTo === user?.orgId || car.belongsTo === user?.userId;
  console.log("car", car);
  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-6">
        <LeftSide car={car} />
        <RightSide car={car} mine={mine} />
      </div>
    </div>
  );
}

const LeftSide = ({ car }: { car: RouterOutputs["car"]["getCarById"] }) => {
  console.log("car", car);
  return (
    <div className="flex  w-full flex-grow flex-col gap-3 lg:w-[57%]">
      <ImagesSection
        images={
          (car.images?.map((t) => (t as any)?.key) as string[] | undefined) ??
          []
        }
      />
      <div className="py-2"></div>
      <ContentCarPage car={car} />
    </div>
  );
};

const RightSide = async ({
  car,
  mine = false,
}: {
  car: RouterOutputs["car"]["getCarById"];
  mine?: boolean;
}) => {
  const org = await clerkClient.organizations.getOrganization({
    organizationId: car.belongsTo!,
  });
  return (
    <div className=" w-full lg:w-[40%] ">
      <div className="w-full space-y-4 rounded-xl bg-white p-3">
        <div className="flex flex-row items-center justify-between gap-2 px-5">
          {/* <MiniCard
            containerClass="w-[70px]"
            value={""}
            size={94}
            img="/assets/Cars/Audi.svg"
          /> */}
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
      {car.type === "direct" ? (
        <div className="mt-5 flex flex-col gap-2 rounded-lg bg-primary p-4 text-white">
          <span>Contact the owner of the car to buy it</span>
          <div className="flex items-center gap-3">
            <Image
              src={org.imageUrl}
              alt="logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="font-bold">{org.name}</span>
          </div>
          <ContactSection />
        </div>
      ) : (
        <BidSection car={car} />
      )}
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
