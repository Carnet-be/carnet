/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { redirect } from "next/navigation";

export default function  DashboardPage() {
   redirect("/dashboard/home");
}