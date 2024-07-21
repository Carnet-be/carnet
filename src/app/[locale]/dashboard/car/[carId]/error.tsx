"use client"; // Error components must be Client Components

import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const t = useTranslations("pages.error");
  const c = useTranslations("common");
  return (
    <div className="animate-gradient flex min-h-screen items-center justify-center bg-gradient-to-r from-primary-50 py-48">
      <div className="flex flex-col">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" width={200} height={200} alt="Error" />

          <div className="mt-10 text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
            {t("noCar")}
          </div>

          <div className="mt-8 max-w-2xl text-center text-sm  text-gray-400">
            {t("noCar description")}
          </div>
          <div className="flex flex-row items-center gap-7">
            <Button
              className="mt-8"
              onClick={() => {
                router.back();
              }}
              startContent={<BackIcon />}
              variant="flat"
            >
              {c("back")}
            </Button>

            <Button
              startContent={<IoReload />}
              onClick={() => reset()}
              className="mt-8"
            >
              {c("reload")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
