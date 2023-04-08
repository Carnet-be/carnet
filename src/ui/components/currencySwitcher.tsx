import { ExpandMoreIcon } from "@ui/icons";
import { trpc } from "@utils/trpc";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useNotif } from "../../pages/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Currency } from "@prisma/client";

export const currencies: {
  code: Currency;
  symbol: string;
}[] = [
  {
    code: "EUR",
    symbol: "€",
  },
  {
    code: "USD",
    symbol: "$",
  },
  {
    code: "GBP",
    symbol: "£",
  },
  {
    code: "MAD",
    symbol: "MAD",
  },
];
export function findSymbol(code: Currency) {
  const symbol = currencies.filter((c) => c.code === code)[0]?.symbol;
  return symbol || "€";
}
const CurrencySwitcher = () => {
  const [currency, setCurrency] = useState<string>(
    findSymbol(Cookies.get("currency") as Currency)
  );
  const { error, succes } = useNotif();
  const { mutate } = trpc.user.changeCurrency.useMutation({
    onSuccess: (data) => {
      succes();
      setCurrency(findSymbol(data));
      Cookies.set("currency", data, { expires: 365 });
    },
    onError: (err) => {
      error();
      console.log("err", err);
    },
  });

  return (
    <div className="dropdown-end dropdown font-semibold ">
      <button tabIndex={0} className="flex flex-row items-center gap-1">
        <span className={`rounded-full text-xl font-bold text-primary`}>
          {currency}
        </span>
        <ExpandMoreIcon className="icon" />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box z-50 w-40 gap-2 p-2 shadow"
      >
        {currencies.map((l, i) => {
          return (
            <li key={i}>
              <button
                onClick={() => mutate(l.code)}
                className="flex flex-row items-center justify-between"
              >
                <span>{l.code}</span>
                <span className="text-xs font-bold text-primary">
                  {l.symbol}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CurrencySwitcher;
