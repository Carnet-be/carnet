"use client"

import { Button, ScrollShadow, cn } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import CarCard from "~/app/_components/carCard";
import { RouterOutputs } from "~/trpc/shared";

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
        <ChevronLeft className={cn("text-white", cars.length<=2 &&"opacity-0")} />
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
        <ChevronRight className={cn("text-white", cars.length<=2 &&"opacity-0")} />
      </Button>
    </div>
  );
};
