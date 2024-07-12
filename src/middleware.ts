import { authMiddleware } from "@clerk/nextjs";

import createMiddleware from "next-intl/middleware";
import { locales } from "./config";

const intlMiddle = createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",
});

export default authMiddleware({
  beforeAuth: (req) => {
    // Execute next-intl middleware before Clerk's auth middleware
    return intlMiddle(req);
  },
  publicRoutes: (req) => {
    // i want to allow all route /*  but not /*/car
    return (
      !req.url.includes("/dashboard") &&
      !req.url.includes("/car/") &&
      !req.url.includes("/cars/")
    );
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
