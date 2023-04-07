import { Language } from "@prisma/client";
import { ExpandMoreIcon } from "@ui/icons";
import { trpc } from "@utils/trpc";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useNotif } from "../../pages/hooks";
import { useEffect } from "react";

const LangSwitcher = () => {
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

    {
      title: "العربية",
      icon: "ma",
      locale: "ar",
    },
  ];
  const router = useRouter();

  const { locale: activeLocale, pathname, query, asPath } = router;
  const { error, succes, loading } = useNotif();
  const { mutate } = trpc.user.changeLang.useMutation({
    onSuccess: (data) => {
      succes();
      // location.reload();
      // router.push(pathname, asPath, { locale: data.locale });
    },
    onError: (err) => {
      error();
    },
  });
  function handleLanguageChange(lang: Language) {
    Cookies.set("lang", lang, { expires: 365 });
    mutate(lang);
  }

  const getIcon = () => {
    const icon =
      langs.filter((l) => l.locale === activeLocale)[0]?.icon || "fr";
    return icon;
  };

  return (
    <div className="dropdown-end dropdown font-semibold">
      <button tabIndex={0} className="flex flex-row items-center gap-1">
        <span className={`fi fi-${getIcon()} text-2xl`}></span>
        <ExpandMoreIcon className="icon" />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box z-50 w-52 gap-2 bg-base-200 p-2 shadow"
      >
        {langs.map((l, i) => {
          const { title, icon, locale } = l;
          return (
            <li key={i}>
              <button onClick={() => handleLanguageChange(locale)}>
                <span
                  className={`justify-start ${
                    activeLocale == locale && "active"
                  }`}
                >
                  <span className={`fi fi-${icon}`}></span>
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
