import { useLocale } from "next-intl";
import { type locales } from "~/config";
import LocaleSwitcherSelect from "./LangueSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale() as (typeof locales)[number];

  return <LocaleSwitcherSelect defaultValue={locale} />;
}
