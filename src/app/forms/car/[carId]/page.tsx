import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import NewCarPage from "~/app/_components/pages/NewCarPage";

import { api } from "~/trpc/server";

export default async function NewCar({
  params,
}: {
  params: { carId?: number | string };
}) {
  const { userId, orgId, user } = auth();
  const data = await api.public.carData.query();
  const carId = params.carId;
  console.log("carId", carId);
  let car;
  if (carId && carId !== "new") {
    car = await api.car.getCarById.query(Number(carId));
    console.log("car", car);
    if (!car) {
      return notFound();
    }
    if (
      car.belongsTo !== orgId &&
      car.belongsTo !== userId &&
      user?.publicMetadata?.role !== "admin"
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
