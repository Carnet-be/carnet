/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @next/next/no-img-element */
"use client";
import {
  OrganizationSwitcher,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import { Bell } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GiHomeGarage } from "react-icons/gi";
import { IoAnalyticsSharp } from "react-icons/io5";
import { MdAdd, MdModeEditOutline, MdVisibility } from "react-icons/md";
import { api } from "~/trpc/react";
import { ADMIN_ROLES, type AdminRole } from "~/utils/constants";
import Logo from "./ui/logo";
const Navbar = ({
  auth,
}: {
  auth: {
    orgId: string;
    userId: string;
  };
}) => {
  const { orgId } = auth;

  const { user } = useUser();
  const role = user?.publicMetadata?.role as AdminRole | undefined;
  const [isAdmin, setIsAdmin] = React.useState<boolean | undefined>(false);
  useEffect(() => {
    setIsAdmin(role && ADMIN_ROLES.includes(role));
  }, [role, user]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [seach, setSearch] = useState(searchParams.get("q") ?? "");
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-start">
          <button
            data-drawer-target="drawer-navigation"
            data-drawer-toggle="drawer-navigation"
            aria-controls="drawer-navigation"
            className="mr-2 cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 md:hidden"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              className="hidden h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </button>

          <div className="center w-56">
            <Logo type={"1"} size={60} />
          </div>
          <div className="hidden md:block md:pl-4">
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <div className="relative  md:w-96">
              <input
                type="search"
                value={seach}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="Looking for something?"
              />
            </div>
          </div>

          <Button
            className="mx-2 px-2"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (seach) {
                params.set("q", seach);
              } else {
                params.delete("q");
              }
              router.replace(`/dashboard/home?${params.toString()}`);
            }}
          >
            Search
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4  lg:order-2">
          {orgId && <GarageButton id={orgId} />}
          <button className="iconButton">
            <Bell />
          </button>

          {!isAdmin && (
            <div className="translate-y-[3px]">
              <OrganizationSwitcher />
            </div>
          )}
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

const GarageButton = ({ id }: { id: string }) => {
  const { orgSlug } = useAuth();
  const { data, isLoading, refetch } = api.garage.checkMyGarage.useQuery();
  const router = useRouter();
  const { mutateAsync, isLoading: isCreatingGarage } =
    api.garage.createGarage.useMutation();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button startContent={<GiHomeGarage />} color="primary" variant="faded">
          My Garage
        </Button>
      </DropdownTrigger>

      {isLoading || isCreatingGarage ? (
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem key="loading" className="grid justify-center ">
            <Spinner className="mx-auto " />
          </DropdownItem>
        </DropdownMenu>
      ) : data ? (
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            key="view"
            shortcut="⌘V"
            onClick={() => {
              router.push(`/${orgSlug}`);
            }}
            startContent={<MdVisibility />}
          >
            View
          </DropdownItem>
          <DropdownItem
            key="edit"
            shortcut="⌘E"
            onClick={() => router.push(`/dashboard/my-garage`)}
            startContent={<MdModeEditOutline />}
          >
            Edit page
          </DropdownItem>
          <DropdownItem
            key="analytics"
            shortcut="⌘A"
            startContent={<IoAnalyticsSharp />}
          >
            Analytics
          </DropdownItem>
        </DropdownMenu>
      ) : (
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            key="create"
            //shortcut="⌘"
            onClick={() => {
              toast.promise(
                mutateAsync({
                  orgId: id,
                }).then(() => {
                  router.push(`/dashboard/my-garage`);
                  refetch();
                }),
                {
                  loading: "Creating the garage page...",
                  success: <b>The page has been created</b>,
                  error: <b>Error creating the page </b>,
                },
              );
              //toast.success('Creating new page')
            }}
            startContent={<MdAdd />}
          >
            Create my garage page
          </DropdownItem>
        </DropdownMenu>
      )}

      {/* <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          shortcut="⌘⇧D"
          startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
        >
          Delete file
        </DropdownItem> */}
    </Dropdown>
  );
};
