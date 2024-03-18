"use client";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { type Key } from "react";
import useDate from "~/hooks/use-date";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { getCarImage, priceFormatter } from "~/utils/function";

const columns = [
  {
    key: "car",
    label: "CAR",
  },
  {
    key: "amount",
    label: "AMOUNT",
  },

  {
    key: "createdAt",
    label: "BIDDED AT",
  },
];
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CarPageEntreprise() {
  const { dayjs } = useDate();
  const { data: rows, isError, isLoading } = api.car.getMyBids.useQuery();
  const render = (
    item: RouterOutputs["car"]["getMyBids"][number],
    columnKey: Key,
  ) => {
    switch (columnKey) {
      case "car":
        return (
          <div className="flex flex-row items-center gap-5">
            <div className="relative flex aspect-[3/2] w-[80px]  flex-col items-center justify-center overflow-hidden rounded-lg border bg-white">
              <Image
                src={getCarImage(item.car?.images[0]?.key)}
                alt="photo"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <Link
              href={`/dashboard/car/${item.carId}`}
              className="whitespace-nowrap font-semibold"
            >
              {item.car?.name}
            </Link>
          </div>
        );
      case "amount":
        return priceFormatter.format(item.amount);
      case "createdAt":
        return dayjs(item.createdAt).format("llll");
      default:
        return getKeyValue(item, columnKey);
    }
  };
  return (
    <div className="space-y-4">
      <h1>My Bids</h1>
      <Table aria-label="bids table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          loadingState={isError ? "error" : isLoading ? "loading" : undefined}
          loadingContent={<Spinner />}
          emptyContent={isLoading ? " " : "No bids found"}
          items={rows ?? []}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{render(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
