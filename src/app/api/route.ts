/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type WebhookEvent } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function POST(request: Request) {
  console.log('request', request)
  const payload: WebhookEvent = await request.json();
  console.log(payload);
  
}

export function GET() {
  return Response.json({ message: "Hello World!" });
}