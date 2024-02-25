"use client";
import { Button } from "@nextui-org/react";
import { CarFront, Heart, Home, LucideDatabase, Users2 } from "lucide-react";
import Link from "next/link";
import { AiFillCar } from "react-icons/ai";
import { BiRightArrow } from "react-icons/bi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiAuctionLine } from "react-icons/ri";
import { TbPremiumRights } from "react-icons/tb";
import useIsAdmin from "~/hooks/use-is-admin";
import MenuItem, { type TMenuItem } from "./MenuItem";
import { GarageIcon } from "./icons";

const Sidebar = () => {
  const admin = useIsAdmin();
  const menuAdmin: TMenuItem[] = [
    {
      label: "Overview",
      icon: <Home size={20} />,
      route: "/dashboard/admin/overview",
    },
    {
      label: "Cars",
      icon: <CarFront size={20} />,
      route: "/dashboard/admin/cars",
    },
    {
      label: "Users",
      icon: <Users2 size={20} />,
      route: "/dashboard/admin/users",
    },
    {
      label: "Garages",
      icon: <GarageIcon size={20} />,
      route: "/dashboard/admin/garages",
    },

    {
      label: "Chat",
      icon: <IoChatbubblesOutline size={20} />,
      route: "/dashboard/admin/chat",
    },
    {
      label: "Subscriptions",
      icon: <TbPremiumRights size={20} />,
      route: "/dashboard/admin/subscriptions",
    },
    {
      label: "Data",
      icon: <LucideDatabase size={20} />,
      route: "/dashboard/admin/data",
    },
  ];
  const menu: TMenuItem[] = [
    {
      label: "Home",
      icon: <Home size={20} />,
      route: "/dashboard/home",
    },
    {
      label: "My cars",
      icon: <CarFront size={20} />,
      route: "/dashboard/my-cars",
    },
    {
      label: "Active bids",
      icon: <RiAuctionLine size={20} />,
      route: "/dashboard/active-bids",
    },
    {
      label: "Favorites",
      icon: <Heart size={20} />,
      route: "/dashboard/favorites",
    },
  ];
  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white pt-14 transition-transform dark:border-gray-700 dark:bg-gray-800 md:translate-x-0"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="h-full overflow-y-auto bg-white px-8 py-8 dark:bg-gray-800">
        <form action="#" method="GET" className="mb-2 md:hidden">
          <label htmlFor="sidebar-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clip-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="sidebar-search"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="Search"
            />
          </div>
        </form>
        <ul className="space-y-3">
          {(admin ? menuAdmin : menu).map((m, i) => {
            return (
              <li key={i}>
                <MenuItem>{m}</MenuItem>
              </li>
            );
          })}
        </ul>
        {!admin && (
          <>
            <div className="my-7 border-t border-gray-200"></div>
            <ul className=" space-y-2  dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="group flex items-center rounded-lg p-2 text-base font-medium text-gray-900 no-underline transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Help</span>
                </a>
              </li>
            </ul>
            <div className="my-5"></div>
            <SellCarBanner />
          </>
        )}
      </div>
      <div className="absolute bottom-0 left-0 z-20 hidden w-full justify-center space-x-4 bg-white p-8 dark:bg-gray-800 lg:flex">
        <ul className="w-full space-y-2">
          <li>
            <Link
              href="https://buy.stripe.com/test_5kA9DH9UXaeubracMN"
              className="group flex items-center justify-between rounded-lg bg-gradient-to-r from-cyan-500 to-amber-500 p-2 px-2 text-xs font-semibold text-white no-underline"
            >
              <span className="ml-3">Try Carnet Pro</span>
              {/* animate with motion left and right */}

              <BiRightArrow />
            </Link>
          </li>
          {/* <li>
            <Link
              href="#"
              className="group flex items-center rounded-lg p-2 text-base font-medium text-gray-900 no-underline hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <Settings2Icon />
              <span className="ml-3">Settings</span>
            </Link>
          </li> */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

const SellCarBanner = () => {
  return (
    <div className="center flex-col gap-4 rounded-lg bg-gray-50 p-4 text-center">
      <span className="text-[12px] font-semibold opacity-40">
        A new way to sell modern and classic cars
      </span>
      <Link href={"/forms/car/new"}>
        <Button
          size="sm"
          className="bg-white text-sm font-semibold text-black"
          startContent={<AiFillCar />}
        >
          Sell your car
        </Button>
      </Link>
    </div>
  );
};
