/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { type AdminRole } from "~/utils/constants";

export default async function DashboardPage() {
  const user = await currentUser();
  const role = user?.privateMetadata?.role as AdminRole | undefined;
  if (role) redirect("dashboard/admin/overview");
  redirect("/dashboard/home");
}
