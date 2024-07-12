/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Autocomplete, Button, SelectItem, Spinner } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Fragment } from "react";
import CarCard from "~/app/_components/carCard";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

export const SearchSection = ({
  data,
}: {
  data: RouterOutputs["public"]["carData"];
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bodies = data?.bodies ?? [];
  const brands = data?.brands ?? [];
  const models = data?.models ?? [];

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Autocomplete
        //variant={variant}
        label="Body Type"
        placeholder="Select a body type"
        variant="faded"
        onSelectionChange={(k) => {
          const params = new URLSearchParams(searchParams);
          if (k) {
            params.set("body", k.toString());
          } else {
            params.delete("body");
          }

          router.push(`${pathname}?${params.toString()}`);
        }}
        selectedKey={searchParams.get("body")}
        labelPlacement="outside"
        className="w-60"
        classNames={{
          selectorButton: ["placeholder:text-default-700/40"],
        }}
      >
        {bodies.map((b) => (
          <SelectItem key={b.id} value={b.name!}>
            {b.name}
          </SelectItem>
        ))}
      </Autocomplete>
      <Autocomplete
        //variant={variant}
        label="Brand"
        placeholder="Select a brand"
        variant="faded"
        className="w-60"
        selectedKey={searchParams.get("brand")}
        onSelectionChange={(k) => {
          const params = new URLSearchParams(searchParams);

          if (k) {
            params.set("brand", k.toString());
          } else {
            params.delete("brand");
          }

          params.delete("model");
          router.push(`${pathname}?${params.toString()}`);
        }}
        labelPlacement="outside"
        classNames={{
          selectorButton: ["placeholder:text-default-700/40"],
        }}
      >
        {brands.map((b) => (
          <SelectItem key={b.id} value={b.name}>
            {b.name}
          </SelectItem>
        ))}
      </Autocomplete>

      <Autocomplete
        //variant={variant}
        label="Models"
        placeholder="Select a model"
        variant="faded"
        selectedKey={searchParams.get("model")}
        labelPlacement="outside"
        className="w-60"
        isDisabled={!searchParams.get("brand")}
        onSelectionChange={(k) => {
          const params = new URLSearchParams(searchParams);

          if (k) {
            params.set("model", k.toString());
          } else {
            params.delete("model");
          }

          router.push(`${pathname}?${params.toString()}`);
        }}
        classNames={{
          selectorButton: ["placeholder:text-default-700/40"],
        }}
      >
        {models
          .filter((m) => {
            //if (!searchParams.get("brandId")) return true;
            return m.brandId.toString() == searchParams.get("brand");
          })
          .map((b) => (
            <SelectItem key={b.id} value={b.name}>
              {b.name}
            </SelectItem>
          ))}
      </Autocomplete>
      {
        // igonre eslint@typescript-eslint/prefer-nullish-coalescing
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        searchParams.get("body") ||
        searchParams.get("brand") ||
        searchParams.get("model") ? (
          <Button
            // startContent={<X size={16} />}
            onClick={() => {
              router.push(`${pathname}`);
            }}
            color="danger"
            variant="flat"
          >
            Clear
          </Button>
        ) : null
      }
    </div>
  );
};

export const CarsSections = () => {
  const searchParams = useSearchParams();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.car.getCars.useInfiniteQuery(
      {
        filter: {
          body: searchParams.get("body")
            ? parseInt(searchParams.get("body") ?? "0")
            : undefined,
          brand: searchParams.get("brand")
            ? parseInt(searchParams.get("brand") ?? "0")
            : undefined,
          model: searchParams.get("model")
            ? parseInt(searchParams.get("model") ?? "0")
            : undefined,
          q: searchParams.get("q") ?? undefined,
        },
      },
      {
        getNextPageParam: (lastPage) => lastPage.cursor,
      },
    );
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
        {/* {data?.pages?.map((car) => (
          <CarCard key={car.id}>{car as any}</CarCard>
        ))} */}
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.result.map((car) => (
              <CarCard key={car.id}>{car as any}</CarCard>
            ))}
          </Fragment>
        ))}
      </div>
      {data?.pages
        .map((e) => e.result)
        .reduce((b, a) => {
          return b.concat(a);
        }, []).length == 0 && (
        <span className="py-5 opacity-60">
          No cars found, try another search
        </span>
      )}
      {hasNextPage &&
        (isFetchingNextPage ? (
          <Spinner />
        ) : (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-md bg-primary px-4 py-2 text-white"
          >
            Load more
          </button>
        ))}
    </div>
  );
};
