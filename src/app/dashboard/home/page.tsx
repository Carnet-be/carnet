/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@nextui-org/react";
import { ArrowUpNarrowWide } from "lucide-react";
import CarCard from "~/app/_components/carCard";
import { api } from "~/trpc/server";
import { SearchSection } from "./_component";

export default async function DashboardPage() {
  const data = await api.public.carData.query();
  const cars = await api.car.getCars.query();

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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id}>{car as any}</CarCard>
          ))}
        </div>
        {cars.length > 0 && (
          <div className="flex flex-row items-center justify-center">
            <Button
              variant="flat"
              color="primary"
              startContent={<ArrowUpNarrowWide />}
            >
              Load More
            </Button>
          </div>
        )}
        {cars.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <span className="text-2xl font-semibold text-black">
              No cars found
            </span>
            <span className="text-black">
              Try changing your search criteria
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
