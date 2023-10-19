import { Button } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login");
}
