"use client"; // Error components must be Client Components

import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BiHome } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";
import { IoReload } from "react-icons/io5";
import { BackIcon } from "~/app/_components/icons";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { signOut } = useClerk();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center py-48 bg-gradient-to-r from-primary-50 animate-gradient">
      <div className="flex flex-col">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" width={200} height={200} alt="Error" />

          <div className="mt-10 text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
            Car not found
          </div>

          <div className="mt-8 max-w-2xl text-center text-sm  text-gray-400">
            The car you are looking for is not available. Please try again later
          </div>
          <div className="flex flex-row gap-7 items-center">
            <Button
              className="mt-8"
              onClick={() => {
                router.back();
              }}
              startContent={<BackIcon />}
              variant="flat"

            >
              Back
            </Button>

            <Button
              startContent={<IoReload />}
              onClick={() => reset()}
              className="mt-8">
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
