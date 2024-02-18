"use client"; // Error components must be Client Components

import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white py-48">
      <div className="flex flex-col">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" width={200} height={200} alt="Error" />

          <div className="mt-10 text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
            An error occurred
          </div>

          <div className="mt-8 max-w-xl text-center text-sm font-medium text-gray-400 md:text-xl lg:text-2xl">
            Something went wrong. Please try again later.
          </div>
          <Button onClick={reset} className="mt-8">
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
