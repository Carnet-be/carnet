import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

const s3 = new S3Client({
    region: env.C_AWS_REGION,
    credentials: {
      accessKeyId: env.C_AWS_ACCESS_KEY_ID,
      secretAccessKey: env.C_AWS_SECRET_ACCESS_KEY,
    },
  });

export default s3