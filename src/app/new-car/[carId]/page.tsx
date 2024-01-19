import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import NewCarPage from "~/app/_components/pages/NewCarPage";

import { api } from "~/trpc/server";

export default async function NewCar({
  params,
}: {
  params: { carId?: number };
}) {
  const { userId, orgId, user } = auth();
  const data = await api.public.carData.query();
  const carId = params.carId;
  let car;
  if (carId) {
    car = await api.car.getCarById.query(carId);
    if (!car) {
      return notFound();
    }
    if (
      car.belongsTo !== orgId &&
      car.belongsTo !== userId &&
      user?.publicMetadata?.role !== "admin"
    ) {
      return notFound();
    }
  }

  return (
    <div className="bg-white">
      <NewCarPage data={data} belongsToId={orgId ?? userId} car={car} />
    </div>
  );
}
