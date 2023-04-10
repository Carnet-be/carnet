/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
import pkg from "./next-i18next.config.js";
const { i18n } = pkg;

import removeImports from "next-remove-imports";
const removeImportsFunc = removeImports();
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */

const config = {
  reactStrictMode: false,
  swcMinify: true,
  i18n,

  // localePath: path.resolve('./public/locales'),
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "res.cloudinary.com",
      "res.cloudinary.com",
      "placehold.jp",
      "via.placeholder.com",
    ],
  },
  // @ts-ignore
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };
    return config;
  },
};
// @ts-ignore
export default removeImportsFunc(config);
