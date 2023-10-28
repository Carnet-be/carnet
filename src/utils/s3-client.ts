// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
// "use client"
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { env } from "~/env.mjs";

// import { v4 as uuidv4 } from 'uuid';


// const s3 = new S3Client({
//     region: env.NEXT_PUBLIC_AWS_REGION,
//     credentials: {
//       accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
//       secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
//     },
//   });
// export const uploadFiles = async ({ list }: { list: Array<string | any> }) => {
//     const listString = list.filter((item) => typeof item === "string") as string[];
//     const listFile = list.filter((item) => typeof item !== "string") as File[];

//     const uploadPromises = listFile.map(async (file) => {
//         const key = uuidv4()
//         console.log('file', file)
//         const params = {
//             Bucket: env.NEXT_PUBLIC_AWS_BUCKET,
//             Key: `carnet/${key}`,
//             Body: file,
//             ContentType: 'application/octet-stream'
//         };

//         await s3.send(new PutObjectCommand(params));

//         return key
//     });

//     const uploadResults = await Promise.all(uploadPromises);
//     const uploadedFiles = uploadResults.map((result) => result);

//     return [...listString, ...uploadedFiles];

// }