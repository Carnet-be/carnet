/* eslint-disable @typescript-eslint/no-explicit-any */
// const user = await currentUser()
// const role=user?.publicMetadata?.role as (AdminRole | undefined)
// if(role) redirect('dashboard/admin/overview')
// redirect("/dashboard/home");

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { type AdminRole } from "~/utils/constants";

async function DashboardLayout({ children }: any) {
  const user = await currentUser();
  const role = user?.privateMetadata?.role as AdminRole | undefined;
  if (role) redirect("admin/overview");
  return children;
}

export default DashboardLayout;
