"use client"
import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { MdLogout } from "react-icons/md";

const LogoutButton = () => {
  const { signOut } = useClerk();
  return <Button onClick={() => signOut()} color="danger" variant="flat" size="sm" fullWidth startContent={<MdLogout />} className="flex justify-start">

    Logout

  </Button>


}

export default LogoutButton;
