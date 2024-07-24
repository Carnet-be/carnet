"use client";

import { Avatar, Button, ScrollShadow, cn } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { MdEmail, MdPhone, MdVisibility } from "react-icons/md";
import CarCard from "~/app/_components/carCard";
import { type RouterOutputs } from "~/trpc/shared";
import { getImage } from "~/utils/function";

export const CarsSectionGarage = ({
  cars,
}: {
  cars: RouterOutputs["garage"]["getGarages"][number]["cars"];
}) => {
  const carousel = useRef<HTMLDivElement | null>(null);
  const next = () =>
    carousel.current?.scrollBy({ left: 300, behavior: "smooth" });
  const prev = () =>
    carousel.current?.scrollBy({ left: -300, behavior: "smooth" });

  //TODO: scroll to the element
  return (
    <div className="flex flex-row items-center gap-2 py-5">
      <Button variant={"light"} isIconOnly onClick={prev}>
        <ChevronLeft
          className={cn("text-white", cars.length <= 2 && "opacity-0")}
        />
      </Button>
      <ScrollShadow
        orientation="horizontal"
        ref={carousel}
        className="flex flex-grow flex-row gap-6 overflow-x-hidden"
      >
        {cars.map((b) => (
          <CarCard key={b.id} className={"min-w-[300px]"}>
            {b}
          </CarCard>
        ))}
      </ScrollShadow>
      <Button variant={"light"} isIconOnly onClick={next}>
        <ChevronRight
          className={cn("text-white", cars.length <= 2 && "opacity-0")}
        />
      </Button>
    </div>
  );
};

export const SearchGarage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seach, setSearch] = useState(searchParams.get("q") ?? "");
  const c = useTranslations("common");
  const t = useTranslations("dashboard.garages");
  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:block md:pl-4">
        <label htmlFor="topbar-search" className="sr-only">
          {c("search")}
        </label>
        <div className="relative  md:w-96">
          <input
            type="search"
            value={seach}
            onChange={(e) => {
              if (!e.target.value) {
                router.replace(`/dashboard/garages`);
                setSearch("");
              } else {
                setSearch(e.target.value);
              }
            }}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm  text-gray-900 ring-0 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder={t("placeholderSearch")}
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
        {c("search")}
      </Button>
    </div>
  );
};

export function GarageItemContact({
  org,
  profile,
}: {
  org: RouterOutputs["car"]["getCarById"]["owner"];
  profile: RouterOutputs["car"]["getCarById"]["profile"];
}) {
  const [show, setShow] = useState(false);
  const t = useTranslations("common");
  if (!org) return null;

  const { garage } = org;

  return (
    <div
      style={{
        backgroundImage: `url(${getImage(garage?.cover)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative h-[260px] w-full overflow-hidden rounded-md"
    >
      <div className="absolute bottom-0 left-0 right-0 h-full space-y-3 bg-gradient-to-r from-black  to-black/20 p-3 py-5 text-white">
        <div className="flex flex-row justify-between">
          <div className="flex gap-3">
            <Avatar
              src={org?.imageUrl}
              className="h-16 w-16 rounded-full border-2 border-white"
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <h2 className="text-2xl font-bold text-white">{org.name}</h2>
            </div>
          </div>

          <Link href={`/${org.slug}`}>
            <Button color="secondary" className="shadow">
              {t("visit")}
            </Button>
          </Link>
        </div>
        <p className="line-clamp-2 max-w-[500px]">{garage.about}</p>
        <div className="backdrop-blur-40 relative rounded-md bg-white/20 p-4">
          <div className="flex items-center gap-3">
            <MdPhone />
            <span>
              {profile?.phone ?? "--"} | {profile?.phone2 ?? "--"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MdEmail />
            <span>
              {profile?.email ?? "--"} | {profile?.email ?? "--"}
            </span>
          </div>
          {!show && (
            <div
              onClick={() => {
                setShow(true);
              }}
              className="absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md backdrop-blur-md"
            >
              <MdVisibility className="text-lg" />
              {t("show contact")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function UserItemContact({
  org,
  profile,
}: {
  org: RouterOutputs["car"]["getCarById"]["ownerUser"];
  profile: RouterOutputs["car"]["getCarById"]["profile"];
}) {
  const [show, setShow] = useState(false);
  const t = useTranslations("common");
  if (!org) return <div></div>;

  return (
    <div className="relative h-[200px] w-full overflow-hidden rounded-md">
      <div className="absolute bottom-0 left-0 right-0 h-full space-y-3 bg-gradient-to-r from-black  to-black/20 p-3 py-5 text-white">
        <div className="flex flex-row justify-between">
          <div className="flex gap-3">
            <Avatar
              src={org?.imageUrl}
              className="h-16 w-16 rounded-full border-2 border-white"
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <h2 className="text-2xl font-bold text-white">
                {org.firstName} {org.lastName}
              </h2>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-40 relative rounded-md bg-white/20 p-4">
          <div className="flex items-center gap-3">
            <MdPhone />
            <span>
              {profile?.phone ?? "--"} | {profile?.phone2 ?? "--"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MdEmail />
            <span>
              {profile?.email ?? "--"} | {profile?.email2 ?? "--"}
            </span>
          </div>
          {!show && (
            <div
              onClick={() => {
                setShow(true);
              }}
              className="absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md backdrop-blur-md"
            >
              <MdVisibility className="text-lg" />
              {t("show contact")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const NoGarage = () => {
  const t = useTranslations("dashboard.text");
  return (
    <div className="flex h-[300px] w-full items-center justify-center">
      {t("noGarages")}
    </div>
  );
};
