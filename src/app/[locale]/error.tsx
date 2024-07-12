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
    <div className="animate-gradient flex min-h-screen items-center justify-center bg-gradient-to-r from-primary-50 py-48">
      <div className="flex flex-col">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" width={200} height={200} alt="Error" />

          <div className="mt-10 text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
            An error occurred
          </div>

          <div className="mt-8 max-w-2xl text-center text-sm  text-gray-400">
            {
              "We apologize for the inconvenience. It seems like something unexpected happened on our end. Our team is actively working to fix the issue and get everything back to normal as soon as possible. Your patience and understanding are greatly appreciated. In the meantime, if you have any urgent concerns or questions, please don't hesitate to reach out to us. Thank you for your understanding."
            }
          </div>
          <div className="flex flex-row items-center gap-7">
            <Button
              onClick={() => {
                router.back();
              }}
              startContent={<BackIcon />}
              variant="flat"
              className="mt-8"
            >
              Back
            </Button>
            <Link href={"/"}>
              <Button
                startContent={<BiHome />}
                color={"primary"}
                className="mt-8"
              >
                Home Page
              </Button>
            </Link>

            <Button
              startContent={<GrLogout />}
              color="danger"
              onClick={() => signOut(() => router.push("/"))}
              className="mt-8"
            >
              Logout
            </Button>
            <Button
              startContent={<IoReload />}
              onClick={reset}
              className="mt-8"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
