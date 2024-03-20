/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import MyGaragePage from "~/app/dashboard/my-garage/_components.server";

function MyGaragePagePage({ params }: any) {
  const orgId = params.orgId;
  if (!orgId) redirect("/dashboard/admin/garages");
  return <MyGaragePage orgId={orgId} />;
}

export default MyGaragePagePage;
export const revalidate = 0;
