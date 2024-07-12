import { api } from "~/trpc/server";
import { GarageItem } from "./_components";

async function GaragesPage({ searchParams }: { searchParams: { q?: string } }) {

  const garages = await api.garage.getGarages.query({ q: searchParams.q });
  if (!garages.length) {
    return <div className="w-full h-[300px] flex items-center justify-center">No garages found</div>
  }
  return (

    <div className="flex flex-col gap-3 w-full">
      {garages.map((g) => (<GarageItem key={g.id} garage={g} />))}
    </div>

  );
};

export default GaragesPage;

export const revalidate = 300;
