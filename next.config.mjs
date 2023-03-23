/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

import pkg from "./next-i18next.config.js";
const { i18n } = pkg;
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  swcMinify: true,
  i18n,
  images: {
    domains: ['lh3.googleusercontent.com','firebasestorage.googleapis.com','res.cloudinary.com','placehold.jp',"via.placeholder.com"],
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        "fs": false,
        "path": false,
        "os": false,
      }
    }
    return config
  },
};
export default config;
