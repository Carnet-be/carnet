import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { localePrefix, locales } from "./config";

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix,
    pathnames: {},
  });
