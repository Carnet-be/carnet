import { useLocale } from "next-intl";
import { locales } from "~/config";
import LocaleSwitcherSelect from "./LangueSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale() as (typeof locales)[number];

  const labels = {
    en: "English",
    fr: "Français",
    ln: "Netherlandish",
  } as const;

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={labels[locale]}>
      {locales.map((cur) => (
        <option key={cur} value={cur}>
          {labels[cur]}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
