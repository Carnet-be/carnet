/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@nextui-org/react";
import { ArrowUpNarrowWide } from "lucide-react";
import CarCard from "~/app/_components/carCard";
import { api } from "~/trpc/server";
import { CarsSections, SearchSection } from "./_component";

export default async function DashboardPage() {
  const data = await api.public.carData.query();

  return (
    <div className="">
      <div>
        <h1 className="bg-gray-50 text-3xl font-bold text-black">
          Find your next car
        </h1>
        <span>Search thousands of cars, trucks, and SUVs</span>
      </div>

      <div className="my-4 space-y-7 rounded-[16px] bg-white p-4 md:my-7 md:p-7">
        <SearchSection data={data} />
        <div className="flex flex-row items-center justify-between">
          <span className="font-semibold  text-black">Available Cars</span>
          <Button
            variant="bordered"
            color="primary"
            startContent={<ArrowUpNarrowWide />}
          >
            Filter
          </Button>
        </div>

        {/* {cars.length > 0 && (
          <div className="flex flex-row items-center justify-center">
            <Button
              variant="flat"
              color="primary"
              startContent={<ArrowUpNarrowWide />}
            >
              Load More
            </Button>
          </div>
        )} */}
        <CarsSections />
      </div>
    </div>
  );
}
