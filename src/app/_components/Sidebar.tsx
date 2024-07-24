"use client";
import { useAuth } from "@clerk/nextjs";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import { CarFront, Home, Settings, Users2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillCar } from "react-icons/ai";
import { api } from "~/trpc/react";
import MenuItem, { type TMenuItem } from "./MenuItem";
import { GarageIcon } from "./icons";

const Sidebar = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const c = useTranslations("common");
  const menuAdmin: TMenuItem[] = [
    {
      label: c("overview"),
      icon: <Home size={20} />,
      route: "/dashboard/admin/overview",
    },
    {
      label: c("cars"),
      icon: <CarFront size={20} />,
      route: "/dashboard/admin/cars",
    },
    {
      label: c("users"),
      icon: <Users2 size={20} />,
      route: "/dashboard/admin/users",
    },
    {
      label: c("garages"),
      icon: <GarageIcon size={20} />,
      route: "/dashboard/admin/garages",
    },

    // {
    //   label: "Chat",
    //   icon: <IoChatbubblesOutline size={20} />,
    //   route: "/dashboard/admin/chat",
    // },
    // {
    //   label: "Subscriptions",
    //   icon: <TbPremiumRights size={20} />,
    //   route: "/dashboard/admin/subscriptions",
    // },
    // {
    //   label: "Data",
    //   icon: <LucideDatabase size={20} />,
    //   route: "/dashboard/admin/data",
    // },
  ];
  const pathname = usePathname();
  const menu: TMenuItem[] = [
    {
      label: c("home"),
      icon: <Home size={20} />,
      route: "/dashboard/home",
    },
    {
      label: c("garages"),
      icon: <GarageIcon size={20} />,
      route: "/dashboard/garages",
    },
    {
      label: c("my cars"),
      icon: <CarFront size={20} />,
      route: "/dashboard/my-cars",
    },
    // {
    //   label: "Active bids",
    //   icon: <RiAuctionLine size={20} />,
    //   route: "/dashboard/active-bids",
    // },
    // {
    //   label: "Favorites",
    //   icon: <Heart size={20} />,
    //   route: "/dashboard/favorites",
    // },
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
            {c("search")}
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
          {(isAdmin ? menuAdmin : menu).map((m, i) => {
            return (
              <li key={i}>
                <MenuItem>{m}</MenuItem>
              </li>
            );
          })}
        </ul>
        <div className="pt-5"></div>
        {!isAdmin && (
          <>
            <SellCarBanner />
          </>
        )}
      </div>
      <div className="absolute bottom-0 left-0 z-20 hidden w-full justify-center space-x-4 bg-white p-8 dark:bg-gray-800 lg:flex">
        <ul className="w-full space-y-2">
          {/* {!isAdmin && (
            <li>
              <Link
                href="https://buy.stripe.com/test_5kA9DH9UXaeubracMN"
                className="group flex items-center justify-between rounded-lg bg-gradient-to-r from-cyan-500 to-amber-500 p-2 px-2 text-xs font-semibold text-white no-underline"
              >
                <span className="ml-3">Try Carnet Pro</span>
               

                <CrownIcon size={20} />
              </Link>
            </li>
          )} */}
          <li>
            <Link
              href={
                isAdmin ? "/dashboard/admin/settings" : "/dashboard/settings"
              }
              className={cn(
                "group flex items-center rounded-lg p-2 text-base font-medium text-gray-900 no-underline hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                !pathname.includes("/settings")
                  ? "bg-gray-50"
                  : "bg-primary text-white",
              )}
            >
              <Settings />
              <span className="ml-3">{c("settings")}</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

const SellCarBanner = () => {
  const utils = api.useContext();
  const [loadin, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const t = useTranslations("dashboard");
  return (
    <>
      <div className="center flex-col gap-4 rounded-lg bg-gray-100 p-4 text-center">
        <span className="text-[12px] font-semibold opacity-70">
          {t("text.sellYourCar title")}
        </span>

        <Button
          size="sm"
          isLoading={loadin}
          onClick={async () => {
            setLoading(true);
            const exist = await utils.profile.existProfile.fetch();
            setLoading(false);
            if (!exist) {
              onOpen();
              return;
            }
            router.push("/forms/car/new");
          }}
          color="primary"
          className=" text-sm font-semibold"
          startContent={<AiFillCar />}
        >
          {t("text.sellYourCar")}
        </Button>
      </div>
      <ModalCheckContact isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export const ModalCheckContact = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange(): void;
}) => {
  const { orgId } = useAuth();
  const router = useRouter();
  const te = useTranslations("text");
  const c = useTranslations("common");
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {te("contactInformation")}
            </ModalHeader>
            <ModalBody>
              <p>{te("contactInformation desc")}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {c("close")}
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (orgId) {
                    router.push("/dashboard/settings#/org-contact");
                  } else {
                    router.push("/dashboard/settings#/contact");
                  }
                  onClose();
                }}
              >
                {te("contactInformation button")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
