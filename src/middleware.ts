import createMiddleware from "next-intl/middleware";
import { locales } from "./config";
const intlMiddle = createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",
});

// export default authMiddleware({
//   beforeAuth: (req) => {
//     const { pathname } = req.nextUrl;

//     if (pathname.includes("/:locale/")) {
//       const locale = pathname.split("/")[1];
//       const replacedPathname = pathname.replace("/:locale/", "");
//       return NextResponse.redirect(
//         new URL(
//           `/${
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
//             (locales.includes(locale as any) ?? locale) || "en"
//           }/${replacedPathname}`,
//           req.url,
//         ),
//       );
//     }
//     const path = req.nextUrl.pathname;
//     if (path.includes("/api")) {
//       return;
//     }
//     // Execute next-intl middleware before Clerk's auth middleware
//     return intlMiddle(req);
//   },
//   publicRoutes: (req) => {
//     // i want to allow all route /*  but not /*/car
//     return (
//       !req.url.includes("/dashboard") &&
//       !req.url.includes("/car/") &&
//       !req.url.includes("/cars/")
//     );
//   },
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/"],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/en/dashboard(.*)",
  "/fr/dashboard(.*)",
  "/nl/dashboard(.*)",
  "/en/dashboard/settings(.*)",
  "/fr/dashboard/settings(.*)",
  "/nl/dashboard/settings(.*)",
  "/car/",
  "/cars/",
]); //Like this for starting you can just add the '/' route and you will be able to see the Login screen

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return intlMiddle(req);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
