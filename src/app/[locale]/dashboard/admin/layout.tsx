/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { type AdminRole } from "~/utils/constants";

async function AdminLayout({ children }: any) {
  const user = await currentUser();
  const role = user?.privateMetadata?.role as AdminRole | undefined;
  if (!role) redirect("dashboard");
  return <div>{children}</div>;
}

export default AdminLayout;
