import { UserProfile, auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {

  return (
    <div className="">
     <UserProfile appearance={{
       elements:{
        rootBox:"bg-white shadow-none",
        userProfile:"bg-white shadow-none",
        card:"bg-white shadow-none",
       }
     }}/>
    </div>
  );
}