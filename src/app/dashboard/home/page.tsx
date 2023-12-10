
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button,  } from "@nextui-org/react";
import { ArrowUpNarrowWide } from "lucide-react";
import { api } from "~/trpc/server";
import {  SearchSection } from "./_component";
import CarCard from "~/app/_components/carCard";



export default async  function  DashboardPage() {
  const data = await api.public.carData.query()
const cars=await api.car.getCars.query()

    return (
      <div className="">
      <div>
      <h1 className="text-3xl font-bold text-black bg-gray-50">
            Find your next car
        </h1>
        <span>
            Search thousands of cars, trucks, and SUVs
        </span>
      </div>
     
        <div className="p-4 md:p-7 my-4 md:my-7 rounded-[16px] bg-white space-y-7">
        <SearchSection data={data}/>
          <div className="flex flex-row items-center justify-between">
            <span className="font-semibold  text-black">
              Available Cars
            </span>
            <Button variant="bordered" color="primary" startContent={ <ArrowUpNarrowWide />}>
              Filter 
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cars.map((car) => (<CarCard key={car.id}>{car as any}</CarCard>))}
          </div>
        </div>
      </div>

    );
  }