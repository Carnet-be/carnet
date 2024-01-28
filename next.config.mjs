import withTwin from "./withTwin.mjs";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = withTwin({
    images: {
        domains: ["cdn.clerk.dev",
            "orderbell-upload.s3.eu-north-1.amazonaws.com",
            "images.pexels.com",
            "img.clerk.com"
        ],
    },
});

export default config;
