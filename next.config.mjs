
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["cdn.clerk.dev",
      "orderbell-upload.s3.eu-north-1.amazonaws.com",
      "images.pexels.com",
      "img.clerk.com",
      "images.unsplash.com"
    ],
  },
};

export default withNextIntl(config);
