/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type Key } from "react";
import { MoreIcon } from "~/app/_components/icons";
import useDate from "~/hooks/use-date";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { getCarImage } from "~/utils/function";
const columns = [
  {
    key: "name",
    label: "Garage",
  },
  // {
  //   key: "amount",
  //   label: "AMOUNT",
  // },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "createdAt",
    label: "CREATED AT",
  },
  {
    key: "updatedAt",
    label: "UPDATED AT",
  },
  {
    key: "",
    label: "Action",
  },
];
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CarPageEntreprise() {
  const [isLoading, setIsLoading] = useState(true);
  const utils = api.useContext();
  const [hasMore, setPage] = useState(true);
  const { dayjs } = useDate();
  const router = useRouter();

  const list = useAsyncList<
    RouterOutputs["bo"]["garage"]["getGarages"]["result"][number],
    number
  >({
    async load({ cursor }) {
      if (cursor) {
        setPage(true);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const res = await utils.bo.garage.getGarages.fetch({
        page: cursor ?? 1,
      });

      if (!cursor) {
        setIsLoading(false);
      }

      // If the response has a `nextPage` property, then we can load more.
      setPage(!!res.nextPage);

      return {
        items: res.result,
        cursor: res.nextPage,
      };
    },
  });

  const render = (
    item: RouterOutputs["bo"]["garage"]["getGarages"]["result"][number],
    columnKey: Key,
  ) => {
    switch (columnKey as (typeof columns)[number]["key"]) {
      case "name":
        return (
          <div className="flex flex-row items-center gap-5">
            <div className="relative flex aspect-[3/2] w-[80px]  flex-col items-center justify-center overflow-hidden rounded-lg border bg-white">
              <Image
                src={getCarImage(item.cover)}
                alt="photo"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <Link
              href={`/${item.slug}}`}
              className="whitespace-nowrap font-semibold text-blue-500 hover:underline"
            >
              {item.name}
            </Link>
          </div>
        );
      case "status":
        const color = item.state === "published" ? "success" : "warning";
        return (
          <Chip size="sm" color={color}>
            {item.state}
          </Chip>
        );
      case "createdAt":
        return dayjs(item.createdAt).format("llll");
      case "updatedAt":
        return dayjs(item.createdAt).fromNow();
      case "":
        return (
          <div className="flex items-center justify-end space-x-2">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" isIconOnly>
                  <MoreIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="new"
                  onClick={() => {
                    router.push(`cars/view/${item.id}`);
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onClick={() => {
                    router.push(`garages/${item.orgId}`);
                  }}
                >
                  Edit
                </DropdownItem>

                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Delete permanently
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );

      default:
        return getKeyValue(item, columnKey);
    }
  };
  return (
    <div className="space-y-4">
      <h1>Garages</h1>
      <Table
        aria-label="bids table"
        classNames={{
          base: "max-h-[720px] overflow-scroll",
        }}
        bottomContent={
          hasMore && !isLoading ? (
            <div className="flex w-full justify-center">
              <Button
                isDisabled={list.isLoading}
                variant="flat"
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onPress={list.loadMore}
              >
                {list.isLoading && <Spinner color="white" size="sm" />}
                Load More
              </Button>
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          loadingState={isLoading ? "loading" : undefined}
          loadingContent={<Spinner />}
          emptyContent={isLoading ? " " : "No bids found"}
          items={list.items}
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
