

import { clerkClient } from "@clerk/nextjs"
import { Avatar, Button } from "@nextui-org/react"
import { Link2 } from "lucide-react"
import Link from "next/link"
import { type RouterOutputs } from "~/trpc/shared"
import { getImage } from "~/utils/function"
import { CarsSectionGarage } from "./_components.client"

export function GarageItem({ garage }: { garage: RouterOutputs["garage"]["getGarages"][number] }) {

  return (
    <div
      style={{
        backgroundImage: `url(${getImage(garage.cover)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative w-full rounded-md overflow-hidden h-[400px]">

      <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-r from-black to-black/20  h-full p-1 py-5">
        <div className="flex flex-row justify-between  px-10">
          <div className="flex gap-3">
            <Avatar
              src={garage.imageUrl}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div className="flex flex-col gap-1 justify-center items-start">
              <h2 className="text-2xl font-bold text-white">{garage.name}</h2>
              <p className="max-w-[500px] line-clamp-2">{garage.about}</p>
            </div>
          </div>

          <Link href={`/${garage.slug}`}>
            <Button color="secondary" className="shadow">Visite</Button>
          </Link>

        </div>
        <CarsSectionGarage cars={garage.cars} />
      </div>
    </div >
  )
}
