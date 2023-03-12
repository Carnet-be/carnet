import React, { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import {
  AuctionIcon,
  ClipIcon,
  DashboardIcon,
  NotifIcon,
  PeopleIcon,
  SettingsIcon,
  BidderIcon,
  DataIcon,
  ChatIcon,
} from "./icons";
import { type UserType } from "@model/type";
import Logo from "./components/logo";
import { useSession } from "next-auth/react";
import ProfileCard from "./profileCard";
import { AddIcon } from "@ui/icons";
import CreateAuction from "@ui/createAuction";
import { trpc } from "@utils/trpc";
import { useBidderStore } from "../state";
import { useGetNotifications } from "../pages/hooks";
import { Drawer } from "antd";
import moment from "moment";
import { Timestamp } from "firebase/firestore";

type TSide = {
  route: string;
  title: string;
  icon: ReactNode;
  count?: number;

  isLoading?: boolean;
};

type DashboardType = {
  children: ReactNode;
  type: UserType;
  notification?: ReactNode;
  background?: string;
  wishListNumber?: number;
  hideNav?: boolean;
};
type TMenu = {
  ADMIN: Array<TSide>;
  STAFF: Array<TSide>;
  AUC: Array<TSide>;
  BID: Array<TSide>;
};

const Dashboard = ({
  children,
  type,
  hideNav = false,
  background = "bg-background",
}: DashboardType) => {
  const router = useRouter();

  const wishs = useBidderStore((state) => state.wishList);
  const menu: TMenu = {
    ADMIN: [
      {
        title: "Accueil",
        route: "/admin/dashboard/accueil",
        icon: <DashboardIcon />,
      },
      {
        title: "Auctions",
        route: "/admin/dashboard/auctions",
        icon: <AuctionIcon />,
      },
      {
        title: "Bids",
        route: "/admin/dashboard/bids",
        icon: <BidderIcon />,
      },
      {
        title: "Users",
        route: "/admin/dashboard/users",
        icon: <PeopleIcon />,
      },
      {
        title: "Staff",
        route: "/admin/dashboard/staffs",
        icon: <PeopleIcon />,
      },
      {
        title: "Data",
        route: "/admin/dashboard/data",
        icon: <DataIcon />,
      },
      {
        title: "Chat",
        route: "/admin/dashboard/chat",
        icon: <ChatIcon />,
      },
    ],
    AUC: [
      {
        title: "Home",
        route: "/dashboard/auctionnaire/home",
        icon: <DashboardIcon />,
      },
      {
        title: "My Auctions",
        route: "/dashboard/auctionnaire/myauctions",
        icon: <AuctionIcon />,
      },
      {
        title: "Chat",
        route: "/dashboard/auctionnaire/chat",
        icon: <ChatIcon />,
      },
    ],
    BID: [
      {
        title: "Home",
        route: "/dashboard/bidder/home",
        icon: <DashboardIcon />,
      },
      {
        title: "My biddes",
        route: "/dashboard/bidder/mybiddes",
        icon: <BidderIcon />,
      },
      {
        title: "Wish list",
        route: "/dashboard/bidder/wishlist",
        icon: <ClipIcon />,
        count: wishs,
      },
      {
        title: "Chat",
        route: "/dashboard/bidder/chat",
        icon: <ChatIcon />,
      },
    ],
    STAFF: [],
  };

  return (
    <>
      <CreateAuction />
      <div className="drawer-mobile drawer">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className={cx("drawer-content relative", background)}>
          <div
            className={cx(
              "sticky top-0 right-0 z-50 flex h-[60px] w-full  flex-row items-center gap-3 px-3 backdrop-blur-md",
              {
                hidden: hideNav,
              }
            )}
          >
            <div className="flex-grow"></div>
            <NotificationComponent />
            <ProfileCard />
          </div>
          {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
          <div
            className={cx("", {
              "p-3 lg:p-6 lg:px-14": !hideNav,
            })}
          >
            {children}
          </div>
        </div>
        <div className="drawer-side w-[300px]">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <div className="flex flex-col items-center gap-3 py-4 ">
            <div className="flex flex-row items-center justify-center py-4">
              <Logo size={70} />
            </div>
            <ul className="menu flex w-[80%] flex-grow flex-col gap-2 py-3 text-base-content">
              {menu[type].map((m, i) => {
                const active =
                  router.pathname == m.route ||
                  router.pathname.includes(m.route);
                return (
                  <Side
                    key={i}
                    side={m}
                    active={active}
                    count={m.count}
                    isLoading={m.isLoading}
                  />
                );
              })}
            </ul>
            <ul className="menu w-[80%] space-y-2">
              {type == "AUC" && (
                <li>
                  <label
                    htmlFor="create_auction"
                    className={cx(
                      "flex flex-row gap-5 rounded-lg border font-light no-underline"
                    )}
                  >
                    <div className="text-xl">
                      <AddIcon />
                    </div>
                    New Auction
                  </label>
                </li>
              )}
              <li>
                <Link
                  href={"/pages/settings"}
                  className={cx(
                    "flex flex-row gap-5 rounded-lg border font-light no-underline"
                  )}
                >
                  <div className="text-xl">
                    <SettingsIcon />
                  </div>
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const Side = ({
  side,
  active,
  count,
  isLoading,
}: {
  side: TSide;
  active: boolean;
  count: number | undefined;
  isLoading: boolean | undefined;
}) => {
  return (
    <li>
      <Link
        href={side.route}
        className={cx(
          "flex flex-row gap-5 rounded-lg font-light no-underline",
          {
            "bg-primary text-white": active,
          }
        )}
      >
        <div className="text-xl">{side.icon}</div> {side.title}
        <div
          className={cx(
            "flex-grow justify-end text-end font-bold",
            active && "text-white"
          )}
        >
          {count}
        </div>
      </Link>
    </li>
  );
};
export default Dashboard;

const NotificationComponent = () => {
  const { notifications, num,onSeenNotifications,newNotifs } = useGetNotifications();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);

    onSeenNotifications()
  };
  const router=useRouter()
  return (
    <>
      <button
        onClick={showDrawer}
        className="btn-ghost btn flex flex-row gap-1 hover:bg-primary/10"
      >
        {num > 0 && (
          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white">
            
          </div>
        )}
        <NotifIcon className="text-2xl" />
      </button>
      <Drawer
        title="Notifications"
        placement="right"
        onClose={onClose}
        open={open}
      >
        {notifications.sort((a,b)=>b.date.getTime()-a.date.getTime()).map((n, i) => {

          return (
            <div onClick={()=>{
            router.push(n.link)
            onClose()
            }} key={i} className={cx("rounded-md border p-3 cursor-pointer mb-3",{
              "text-primary":newNotifs.map((n)=>n.uid).includes(n.uid||""),
            })}>
              
                <div className="flex flex-col">
                  <div className="text-sm font-bold">{n.title}</div>
                  <div className="text-xs">{n.body}</div>
                  <div className="self-end italic text-[10px]">{moment(n.date).fromNow()}</div>
              </div>
            </div>
          );
        })}
      </Drawer>
    </>
  );
};
