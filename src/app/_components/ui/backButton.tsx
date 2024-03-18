"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BackIcon } from "../icons";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      className="mb-3"
      onClick={() => {
        router.back();
      }}
      startContent={<BackIcon />}
      variant="flat"
      size="sm"
    >
      Back
    </Button>
  );
};

export default BackButton;
