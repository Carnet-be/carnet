/* eslint-disable @typescript-eslint/no-explicit-any */
import CarPage from "~/app/[locale]/dashboard/car/[carId]/_component.server";

export default function CarPageEntreprise({ params }: any) {
  return <CarPage params={params} view={"admin"} />;
}
