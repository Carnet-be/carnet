/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";
import {
  Avatar,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Key } from "react";
import useDate from "~/hooks/use-date";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { getCarImage } from "~/utils/function";
const columns = [
  {
    key: "name",
    label: "User",
  },
  // {
  //   key: "amount",
  //   label: "AMOUNT",
  // },
  {
    key: "email",
    label: "Email",
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
  const { dayjs } = useDate();
  const router = useRouter();

  const searchParams = useSearchParams();
  const {
    data: rows,
    isError,
    isLoading,
    refetch,
  } = api.bo.user.getUsers.useQuery({
    page: parseInt(searchParams.get("page") ?? "1"),
  });
  const pathname = usePathname();
  const render = (
    item: RouterOutputs["bo"]["user"]["getUsers"]["data"]["data"][number],
    columnKey: Key,
  ) => {
    switch (columnKey as (typeof columns)[number]["key"]) {
      case "name":
        return (
          <div className="flex flex-row items-center gap-5">
            <Avatar src={getCarImage(item.imageUrl)} alt="photo" />

            <span className="whitespace-nowrap font-semibold text-blue-500">
              {item.firstName} {item.lastName}
            </span>
          </div>
        );

      case "email":
        return <span>{item.emailAddresses[0]?.emailAddress}</span>;

      case "createdAt":
        return dayjs(item.createdAt).format("llll");
      case "updatedAt":
        return dayjs(item.createdAt).fromNow();
      // case "":
      //   return (
      //     <div className="flex items-center justify-end space-x-2">
      //       <Dropdown>
      //         <DropdownTrigger>
      //           <Button size="sm" isIconOnly>
      //             <MoreIcon />
      //           </Button>
      //         </DropdownTrigger>
      //         <DropdownMenu aria-label="Static Actions">
      //           <DropdownItem
      //             key="new"
      //             onClick={() => {
      //               router.push(`cars/view/${item.id}`);
      //             }}
      //           >
      //             View
      //           </DropdownItem>
      //           <DropdownItem
      //             key="edit"
      //             onClick={() => {
      //               router.push(`garages/${item.orgId}`);
      //             }}
      //           >
      //             Edit
      //           </DropdownItem>

      //           <DropdownItem
      //             key="delete"
      //             className="text-danger"
      //             color="danger"
      //           >
      //             Delete permanently
      //           </DropdownItem>
      //         </DropdownMenu>
      //       </Dropdown>
      //     </div>
      //   );

      default:
        return getKeyValue(item, columnKey);
    }
  };
  return (
    <div className="space-y-4">
      <h1>Users</h1>
      <Table
        aria-label="bids table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              // color="secondary"
              page={
                searchParams.get("page")
                  ? parseInt(searchParams.get("page") ?? "1")
                  : 1
              }
              total={rows?.pages ?? 1}
              onChange={(page) => {
                const params = new URLSearchParams(searchParams);
                params.set("page", page.toString());
                router.replace(`${pathname}?${params.toString()}`);
              }}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
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
          items={rows?.data.data ?? []}
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
