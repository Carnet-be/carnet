import CarPage from "~/app/[locale]/dashboard/car/[carId]/_component.server";
import { BackGarageButton } from "./_components";

export default function CarPageEntreprise({
  params,
}: {
  params: { carId: number };
}) {
  return (
    <div className="space-y-3 py-4">
      <BackGarageButton />
      <CarPage params={params} view="garage" />;
    </div>
  );
}
