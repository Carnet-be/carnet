import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: (req) => {
    // i want to allow all route /*  but not /*/car
    return !req.url.includes("/dashboard") && !req.url.includes("/car/") && !req.url.includes("/cars/");
  },

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
