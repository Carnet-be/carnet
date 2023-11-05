import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL"
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
      CLERK_SECRET_KEY: z.string().min(1).default("Clerk secret key not set"),
      C_AWS_ACCESS_KEY_ID: z.string().min(1).default("AWS_ACCESS_KEY_ID not set"),
      C_AWS_SECRET_ACCESS_KEY: z.string().min(1).default("AWS_SECRET_ACCESS_KEY not set"),
      C_AWS_BUCKET: z.string().min(1).default("AWS_BUCKET not set"),
      C_AWS_REGION: z.string().min(1).default("AWS_REGION not set"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).default("Clerk publishable key not set"),
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: z.string().min(1).default("Google Map key not set"),
    NEXT_PUBLIC_ASSET_ENDPOINT: z.string().min(1).default("Asset endpoint not set"),
   

  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    NEXT_PUBLIC_ASSET_ENDPOINT: process.env.NEXT_PUBLIC_ASSET_ENDPOINT,
    C_AWS_ACCESS_KEY_ID: process.env.C_AWS_ACCESS_KEY_ID,
    C_AWS_SECRET_ACCESS_KEY: process.env.C_AWS_SECRET_ACCESS_KEY,
    C_AWS_BUCKET: process.env.C_AWS_BUCKET,
    C_AWS_REGION: process.env.C_AWS_REGION,
  
    
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
