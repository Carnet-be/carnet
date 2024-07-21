import { useTranslations } from "next-intl";
import { api } from "~/trpc/server";
import { GarageItem } from "./_components";

async function GaragesPage({ searchParams }: { searchParams: { q?: string } }) {
  const garages = await api.garage.getGarages.query({ q: searchParams.q });
  const t = useTranslations("dashboard.text");
  if (!garages.length) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        {t("noGarages")}
      </div>
    );
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
