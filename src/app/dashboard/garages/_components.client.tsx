"use client"

import { Avatar, Button, ScrollShadow, cn } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { MdVisibility } from "react-icons/md";
import CarCard from "~/app/_components/carCard";
import { type RouterOutputs } from "~/trpc/shared";
import { getImage } from "~/utils/function";

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



export function GarageItemContact({ org }: { org: RouterOutputs["car"]["getCarById"]["owner"] }) {
  const [show, setShow] = useState(false);
  if (!org) return null
  const { garage } = org

  const phone = org.publicMetadata?.phone || org.publicMetadata?.phone2 || "No phone number" as string
  const email = org.publicMetadata?.email || org.publicMetadata?.email2 || "No email" as string
  return (
    <div
      style={{
        backgroundImage: `url(${getImage(garage?.cover)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative w-full rounded-md overflow-hidden h-[260px]">

      <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-r from-black to-black/20  h-full p-3 py-5 space-y-3">
        <div className="flex flex-row justify-between">
          <div className="flex gap-3">
            <Avatar
              src={org?.imageUrl}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div className="flex flex-col gap-1 justify-center items-start">
              <h2 className="text-2xl font-bold text-white">{org.name}</h2>

            </div>
          </div>

          <Link href={`/${org.slug}`}>
            <Button color="secondary" className="shadow">Visite</Button>
          </Link>

        </div>
        <p className="max-w-[500px] line-clamp-2">{garage.about}
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, corporis! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa libero cupiditate architecto perferendis doloribus! Minima iste, provident quis voluptatibus assumenda corporis? Reprehenderit placeat, obcaecati quaerat nam cum eos maiores ab!5
        </p>
        <div className="backdrop-blur-40 p-4 bg-white/20 rounded-md relative">
          <div className="flex gap-2">
            <span>{phone as string}</span>
          </div>
          <div className="flex gap-2">
            <span>{email as string}</span>
          </div>
          {!show && (
            <div
              onClick={() => {
                setShow(true);
              }}
              className="absolute left-0 top-0 flex h-full w-full cursor-pointer rounded-md items-center justify-center gap-2 backdrop-blur-md"
            >
              <MdVisibility className="text-lg" />
              Show contact
            </div>
          )}
        </div>
      </div>
    </div >
  )
}
