"use client"

import { Button, ScrollShadow, cn } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import CarCard from "~/app/_components/carCard";
import { type RouterOutputs } from "~/trpc/shared";

export const CarsSectionGarage = ({
  cars
}: {
  cars: RouterOutputs["garage"]["getGarages"][number]["cars"],
}) => {
  const carousel = useRef<HTMLDivElement | null>(null);
  const next = () =>
    (carousel.current)?.scrollBy({ left: 300, behavior: "smooth" });
  const prev = () =>
    (carousel.current)?.scrollBy({ left: -300, behavior: "smooth" });

  //TODO: scroll to the element
  return (
    <div className="flex flex-row items-center gap-2 py-5">
      <Button variant={"light"} isIconOnly onClick={prev}>
        <ChevronLeft className={cn("text-white", cars.length <= 2 && "opacity-0")} />
      </Button>
      <ScrollShadow
        orientation="horizontal"
        ref={carousel}
        className="flex flex-grow flex-row gap-6 overflow-x-hidden"
      >
        {cars.map((b) => (
          <CarCard key={b.id} className={"min-w-[300px]"}>{b}</CarCard>))}
      </ScrollShadow>
      <Button variant={"light"} isIconOnly onClick={next}>
        <ChevronRight className={cn("text-white", cars.length <= 2 && "opacity-0")} />
      </Button>
    </div>
  );
};


export const SearchGarage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seach, setSearch] = useState(searchParams.get("q") ?? "");

  return <div className="flex items-center gap-2">
    <div className="hidden md:block md:pl-4">
      <label htmlFor="topbar-search" className="sr-only">
        Search
      </label>
      <div className="relative  md:w-96">
        <input
          type="search"
          value={seach}
          onChange={(e) => {
            if (!e.target.value) {
              router.replace(`/dashboard/garages`);
              setSearch("")
            } else {
              setSearch(e.target.value)
            }
          }}
          className="ring-0 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          placeholder="You know a garage name?"
        />
      </div>
    </div>

    <Button
      className="mx-2 px-2"
      onClick={() => {
        const params = new URLSearchParams(searchParams);
        if (seach) {
          params.set("q", seach);
        } else {
          params.delete("q");
        }
        router.replace(`/dashboard/garages?${params.toString()}`);
      }}
    >
      Search
    </Button>
  </div >

}
