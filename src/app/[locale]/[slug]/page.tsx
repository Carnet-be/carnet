/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clerkClient } from "@clerk/nextjs/server";

import { notFound } from "next/navigation";
import CarCard from "~/app/_components/carCard";
import { api } from "~/trpc/server";

export default async function GaragePagePublic({ params }: any) {
  const org = await clerkClient.organizations
    .getOrganization({ slug: params.slug! })
    .catch((_) => null);
  if (!org) return notFound();
  const garage = await api.garage.getGarageByOrgId.query(org.id);

  const cars = garage?.cars ?? [];

  if (cars.length == 0) {
    return <span className="py-5 opacity-60">No cars found</span>;
  }

  return (
    <div className="grid h-full w-full grid-cols-3 gap-8 bg-background  px-8 py-5">
      {cars.map((a, i) => (
        <CarCard link={`/${org.slug}/car/${a.id}`} key={i}>
          {{ ...a }}
        </CarCard>
      ))}
    </div>
  );
}
