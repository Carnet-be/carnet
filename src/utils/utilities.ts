import { ActivationPro } from "@prisma/client";

export function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function isPro(pros: ActivationPro[]) {
  console.log("pros", pros);
  if (pros.length <= 0) {
    return false;
  }

  const last = pros[0];
  if (!last) return false;
  const now = new Date();
  const isPro = now.getTime() < last.expireAt.getTime();
  return isPro;
}
