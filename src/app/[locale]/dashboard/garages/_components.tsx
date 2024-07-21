import { Avatar, Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { type RouterOutputs } from "~/trpc/shared";
import { getImage } from "~/utils/function";
import { CarsSectionGarage } from "./_components.client";

export function GarageItem({
  garage,
}: {
  garage: RouterOutputs["garage"]["getGarages"][number];
}) {
  const c = useTranslations("common");
  return (
    <div
      style={{
        backgroundImage: `url(${getImage(garage.cover)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative h-[400px] w-full overflow-hidden rounded-md"
    >
      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-r from-black to-black/20  p-1 py-5 text-white">
        <div className="flex flex-row justify-between  px-10">
          <div className="flex gap-3">
            <Avatar
              src={garage.imageUrl}
              className="h-16 w-16 rounded-full border-2 border-white"
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <h2 className="text-2xl font-bold text-white">{garage.name}</h2>
              <p className="line-clamp-2 max-w-[500px]">{garage.about}</p>
            </div>
          </div>

          <Link href={`/${garage.slug}`}>
            <Button color="secondary" className="shadow">
              {c("visit")}
            </Button>
          </Link>
        </div>
        <CarsSectionGarage cars={garage.cars} />
      </div>
    </div>
  );
}
