/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { Fragment } from "react";
import CarCard from "~/app/_components/carCard";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

export const SearchSection = ({
  data,
}: {
  data: RouterOutputs["public"]["carData"];
}) => {
  const bodies = data?.bodies ?? [];
  const brands = data?.brands ?? [];
  const models = data?.models ?? [];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Select
        //variant={variant}
        label="Body Type"
        placeholder="Select a body type"
        variant="faded"
        labelPlacement="outside"
      >
        {bodies.map((b) => (
          <SelectItem key={b.id} value={b.name!}>
            {b.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        //variant={variant}
        label="Brand"
        placeholder="Select a brand"
        variant="faded"
        labelPlacement="outside"
      >
        {brands.map((b) => (
          <SelectItem key={b.id} value={b.name}>
            {b.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        //variant={variant}
        label="Models"
        placeholder="Select a model"
        variant="faded"
        labelPlacement="outside"
      >
        {models.map((b) => (
          <SelectItem key={b.id} value={b.name}>
            {b.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export const CarsSections = () => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.car.getCars.useInfiniteQuery(
      {},
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
