/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslations } from "next-intl";
import { api } from "~/trpc/server";
import { CarsSections, SearchSection } from "./_component";

export default async function DashboardPage() {
  const data = await api.public.carData.query();
const t = useTranslations('dashboard.home')
  return (
    <div className="">
      <div>
        <h1 className="bg-gray-50 text-3xl font-bold text-black">
          {t("title")}
        </h1>
        <span>
          {t("description")}
        </span>
      </div>

      <div className="my-4 space-y-7 rounded-[16px] bg-white p-4 md:my-7 md:p-7">
        <SearchSection data={data} />
      
        <CarsSections />
      </div>
    </div>
  );
}
