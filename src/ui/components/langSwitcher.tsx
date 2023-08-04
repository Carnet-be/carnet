import type { Language } from "@prisma/client";
import { ExpandMoreIcon } from "@ui/icons";
import { trpc } from "@utils/trpc";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useNotif } from "../../pages/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
const LangSwitcher = ({ border }: { border?: boolean }) => {
  type TLang = {
    title: string;
    icon: string;
    locale: Language;
  };

  const langs: Array<TLang> = [
    {
      title: "Français",
      icon: "fr",
      locale: "fr",
    },
    {
      title: "English",
      icon: "gb",
      locale: "en",
    },

    // {
    //   title: "العربية",
    //   icon: "ma",
    //   locale: "ar",
    // },
  ];
  const router = useRouter();

  const { locale: activeLocale, pathname, query, asPath } = router;
  const { error, succes, loading } = useNotif();
  const { mutate } = trpc.user.changeLang.useMutation({
    onSuccess: (data) => {
      succes();

      router.push(pathname, asPath, { locale: data.lang });
      location.reload();
    },
    onError: (err) => {
      error();
    },
  });

  const { i18n } = useTranslation();

  function handleLanguageChange(lang: Language) {
    Cookies.set("lang", lang, { expires: 365 });
    mutate(lang);
  }

  const getIcon = () => {
    const icon =
      langs.filter((l) => l.locale === i18n.language)[0]?.icon || "fr";
    return icon;
  };

  return (
    <div className="dropdown-end dropdown font-semibold">
      <button tabIndex={0} className="flex flex-row items-center gap-1">
        <span
          className={cx(`fi fi-${getIcon()}  h-6 w-7 rounded-lg text-xl`, {
            "border-2 border-white": border,
          })}
        ></span>
        <ExpandMoreIcon className="icon" />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box z-50 w-52 gap-2 bg-base-100 p-2 shadow"
      >
        {langs.map((l, i) => {
          const { title, icon, locale } = l;
          return (
            <li key={i}>
              <button onClick={() => handleLanguageChange(locale)}>
                <span
                  className={`flex flex-row justify-start gap-3 ${
                    activeLocale == locale && "active"
                  }`}
                >
                  <span className={`fi fi-${icon}  rounded-lg`}></span>
                  {title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LangSwitcher;
