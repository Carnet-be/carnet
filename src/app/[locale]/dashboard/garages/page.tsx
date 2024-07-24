import { api } from "~/trpc/server";
import { GarageItem } from "./_components";
import { NoGarage } from "./_components.client";

async function GaragesPage({ searchParams }: { searchParams: { q?: string } }) {
  const garages = await api.garage.getGarages.query({ q: searchParams.q });

  if (!garages.length) {
    return <NoGarage />;
  }
  return (
    <div className="flex w-full flex-col gap-3">
      {garages.map((g) => (
        <GarageItem key={g.id} garage={g} />
      ))}
    </div>
  );
}

export default GaragesPage;

export const revalidate = 300;
