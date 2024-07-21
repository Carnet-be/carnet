import { useTranslations } from "next-intl";
import { SearchGarage } from "./_components.client";

function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("dashboard.garages");
  return (
    <div className="space-y-1">
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <div className="flex w-full justify-end">
        <SearchGarage />
      </div>
      <div className="py-2" />
      {children}
      <div className="py-5" />
    </div>
  );
}

export default Layout;
