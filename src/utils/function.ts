import { env } from "~/env.mjs";

export function invertColor(color: string) {
  return (
    "#" +
    (
      "000000" + (0xffffff ^ parseInt(color.substring(1), 16)).toString(16)
    ).slice(-6)
  );
}

export const getCarImage = (key?: string | null) =>
  key
    ? `${env.NEXT_PUBLIC_ASSET_ENDPOINT}/carnet/${key}`
    : `/images/car_default.png`;
export const getImage = (key?: string | null) =>
  key
    ? `${env.NEXT_PUBLIC_ASSET_ENDPOINT}/carnet/${key}`
    : "https://via.placeholder.com/150";

export const priceFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
