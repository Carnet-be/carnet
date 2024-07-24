import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MyGaragePage from "./_components.server";

function MyGaragePagePage() {
  const orgId = auth().orgId;
  if (!orgId) redirect("/dashboard/home");
  return <MyGaragePage orgId={orgId} />;
}

export default MyGaragePagePage;
export const revalidate = 0;
