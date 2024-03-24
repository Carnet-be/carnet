"use client"
import { Button } from "@nextui-org/react"
import { usePathname, useRouter } from "next/navigation"
import { BackIcon } from "~/app/_components/icons"

export const BackGarageButton = () => {
  const pathname = usePathname()
  const router = useRouter()
  return <Button startContent={<BackIcon />} onClick={() => {
    const link = pathname.split("/").slice(0, -2).join("/")
    router.replace(link)
  }}>
    See all cars
  </Button>

}
