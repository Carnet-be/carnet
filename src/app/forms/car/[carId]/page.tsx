import { auth, clerkClient } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import NewCarPage from "~/app/_components/pages/NewCarPage";

import { api } from "~/trpc/server";

export default async function NewCar({
  params,
}: {
  params: { carId?: number | string };
}) {
  const { userId, orgId } = auth();

  const data = await api.public.carData.query();
  const carId = params.carId;
  console.log("carId", carId);
  let car;
  if (carId && carId !== "new") {
    car = await api.car.getCarById.query({ id: Number(carId), mine: true });
    console.log("car", car);
    if (!car) {
      return notFound();
    }

    const user = await clerkClient.users.getUser(userId!);

    if (
      car.belongsTo !== orgId &&
      car.belongsTo !== userId &&
      user?.privateMetadata?.role !== "admin"
    ) {
      console.log("not mine");
      return notFound();
    }
  }

  return (
    <div className="bg-white">
      <NewCarPage data={data} belongsToId={orgId ?? userId} car={car} />
    </div>
  );
}
export const revalidate = 0;
