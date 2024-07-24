"use client";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { MdLogout } from "react-icons/md";

const LogoutButton = () => {
  const c = useTranslations("common");
  const { signOut } = useClerk();
  return (
    <Button
      onClick={() => signOut()}
      color="danger"
      variant="flat"
      size="sm"
      fullWidth
      startContent={<MdLogout />}
      className="flex justify-start"
    >
      {c("logout")}
    </Button>
  );
};

export default LogoutButton;
