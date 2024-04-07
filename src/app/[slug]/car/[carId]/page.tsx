
import CarPage from "~/app/dashboard/car/[carId]/_component.server";
import { BackGarageButton } from "./_components";

export default function CarPageEntreprise({ params }: { params: { carId: number } }) {
  return <div className="py-4 space-y-3">
    <BackGarageButton />
    <CarPage params={params} view="garage" />;
  </div>
}
