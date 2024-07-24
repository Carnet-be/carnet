"use client";

import { usePathname, useRouter } from "@/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

type Props = {
  defaultValue: string;
};

export default function LocaleSwitcherSelect({ defaultValue }: Props) {
  const labels = {
    en: "English",
    fr: "Français",
    nl: "Netherlandish",
  } as const;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(locale?: string) {
    const nextLocale = locale ?? defaultValue;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    // <label
    //   className={clsx(
    //     "relative text-gray-400",
    //     isPending && "transition-opacity [&:disabled]:opacity-30",
    //   )}
    // >
    //   <p className="sr-only">{label}</p>
    //   <select
    //     className="inline-flex appearance-none bg-transparent py-1 pr-6"
    //     defaultValue={defaultValue}
    //     disabled={isPending}
    //     onChange={onSelectChange}
    //   >
    //     {children}
    //   </select>
    //   <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span>
    // </label>
    <Dropdown>
      <DropdownTrigger>
        <Button
          isLoading={isPending}
          isIconOnly
          variant="bordered"
          className="font-bold uppercase text-primary"
        >
          {defaultValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {Object.entries(labels).map(([locale, label]) => (
          <DropdownItem
            className={locale === defaultValue ? "bg-primary text-white" : ""}
            key={locale}
            onClick={() => onSelectChange(locale)}
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
