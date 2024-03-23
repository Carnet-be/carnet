import { api } from "~/trpc/server";
import { GarageItem } from "./_components";

async function GaragesPage() {
  const garages = await api.garage.getGarages.query();
  return (
    <div className="space-y-3">
      <h1>Garages</h1>
      <p>
        Find a garage near you, for all your car needs.
      </p>
      <div className="py-3" />
      <div className="flex flex-col gap-3 w-full">
        {garages.map((g) => (<GarageItem key={g.id} garage={g} />))}
      </div>
      <div className="py-5" />
    </div>
  );
};

export default GaragesPage;

export const revalidate = 300;
