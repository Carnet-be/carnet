/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Image from 'next/image'
import React from 'react'
import { api } from '~/trpc/server'
import { type FullCar } from '~/types'
import { getCarImage, priceFormatter } from '~/utils/function'
import cx from 'classnames'
import Map from '~/app/_components/ui/map'
import { ContentCarPage } from './_components'
import { auth } from '@clerk/nextjs'
import { Button, Input } from '@nextui-org/react'
export default async function CarPage({ params }: any) {
  const carId: number = parseInt(params.carId!)
  const car = await api.car.getCarById.query(carId)
  const user = auth()
  const mine = car.belongsTo === user?.orgId || car.belongsTo === user?.userId
  console.log("car", car)
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <LeftSide car={car} />
        <RightSide car={car} mine={mine} />
      </div>
    </div>
  )
}



const LeftSide = ({ car }: { car: FullCar }) => {


  return (
    <div className="flex  w-full flex-grow flex-col gap-3 lg:w-[57%]">
      <div

        className="relative flex aspect-[3/2] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-white"
      >
        <Image
          src={getCarImage(car.images[0]?.key)}
          alt="photo"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className='py-2'></div>
      <ContentCarPage car={car} />

    </div>
  );
};

const RightSide = ({
  car,
  mine = false
}: {
  car: FullCar;
  mine?: boolean
}) => {

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
            img={`/body/${car.body?.logo ?? 'Coupe'}.svg`}
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
            title={
              "Transmission"
            }
            img={"/images/transmission.png"}
            value={car?.specs?.transmission ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Horse Power"}
            img={"/images/horse.png"}
            value={car.specs?.cc?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Mileage"}
            img={"/images/mileage.png"}
            value={car.specs?.mileage?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%] text-primary"
            size={110}
            title="CO2"
            img={"/images/CO2.svg"}
            value={car.specs?.co2?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Doors"}
            img={"/images/Doors.svg"}
            value={car.specs?.doors?.toString() ?? "-"}
          />
          <MiniCard
            containerClass="w-[48%] lg:w-[30%]"
            size={110}
            title={"Engine Size"}
            img={"/images/engine.svg"}
            value={car.specs?.cc?.toString() ?? "-"}
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
      <div className='py-7 space-y-4'>
        <div className='flex flex-wrap gap-2 items-center justify-between p-3 bg-gray-100 rounded-md'>
          <div className='flex flex-col justify-center items-center'>
            <span className='text-black font-semibold'>
              10d 12h
            </span>
            <span className='text-[12px] text-gray-500'>
              Time left
            </span>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <span className='text-black font-semibold'>
            Sunday, 12:00
            </span>
            <span className='text-[12px] text-gray-500'>
              Auction ends
            </span>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <span className='text-black font-semibold'>
             13
            </span>
            <span className='text-[12px] text-gray-500'>
            Active bid
            </span>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <span className='text-black font-semibold'>
            {priceFormatter.format(car.detail?.startingPrice ?? 0)}
            </span>
            <span className='text-[12px] text-gray-500'>
              Current bid
            </span>
          </div>
        </div>
        <form className='flex items-end gap-3 pt-3'>
        <Input name="bid" startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">€</span>
            </div>
          } labelPlacement='outside' type='number' step={100} variant="bordered" label={"Entrer your bid (Minimum $14,000)"}/>
        <Button type='submit' color="primary">
          Place bid
        </Button>
        </form>
      </div>
      {car.lat && car.lon && (
        <Map
          center={{
            lat: car.lat,
            lng: car.lon,

          }}
          className="rounded-xl overflow-hidden w-full h-[300px] bg-red-100 mt-10"

          markers={[{
            lat: car.lat,
            lng: car.lon

          }]}

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
        "flex flex-col items-center justify-between gap-1 rounded-xl bg-base-100 py-2  px-4 text-primary",
        containerClass,
        { [`h-[${size}px]`]: size }
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
          <span className='text-[12px]'>
            {color}
          </span>
        </>
      ) : (
        <span className="text-[12px]">{value}</span>
      )}
    </div>
  );
};

