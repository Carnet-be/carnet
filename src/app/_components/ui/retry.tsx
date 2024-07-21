import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";

const Retry = ({ onClick }: { onClick(): void }) => {
  const t = useTranslations("common");
  return (
    <div className="flex w-full items-center justify-center pt-4">
      <Button onClick={onClick}>{t("retry")}</Button>
    </div>
  );
};

export default Retry;
