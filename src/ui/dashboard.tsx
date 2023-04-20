import React, { useState, type ReactNode, useEffect } from "react";
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
import { FaBlog } from "react-icons/fa";
import {
  LangCommonContext,
  useGetNotifications,
  useLang,
  useNotif,
} from "../pages/hooks";
import { Drawer } from "antd";
import moment from "moment";
import { Timestamp } from "firebase/firestore";
import { useAuctionCountStore } from "../state/index";
import { LoadingSpinPage, LoadingSpin } from "./loading";
import { toast } from "react-hot-toast";

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
  const { text: common } = useLang(undefined);
  const wishs = useBidderStore((state) => state.wishList);
  const menu: TMenu = {
    ADMIN: [
      {
        title: common("text.home"),
        route: "/admin/dashboard/accueil",
        icon: <DashboardIcon />,
      },
      {
        title: common("text.auctions"),
        route: "/admin/dashboard/auctions",
        icon: <AuctionIcon />,
      },
      {
        title: common("text.bids"),
        route: "/admin/dashboard/bids",
        icon: <BidderIcon />,
      },
      {
        title: common("text.users"),
        route: "/admin/dashboard/users",
        icon: <PeopleIcon />,
      },
      // {
      //   title: common("text.staffs"),
      //   route: "/admin/dashboard/staffs",
      //   icon: <PeopleIcon />,
      // },
      {
        title: common("text.data"),
        route: "/admin/dashboard/data",
        icon: <DataIcon />,
      },
      {
        title: common("text.chat"),
        route: "/admin/dashboard/chat",
        icon: <ChatIcon />,
      },
      {
        title: common("text.blogs"),
        route: "/admin/dashboard/blogs",
        icon: <FaBlog />,
      },
    ],
    AUC: [
      {
        title: common("text.home"),
        route: "/dashboard/auctionnaire/home",
        icon: <DashboardIcon />,
      },
      {
        title: common("text.my auctions"),
        route: "/dashboard/auctionnaire/myauctions",
        icon: <AuctionIcon />,
      },
      {
        title: common("text.chat"),
        route: "/dashboard/auctionnaire/chat",
        icon: <ChatIcon />,
      },
    ],
    BID: [
      {
        title: common("text.home"),
        route: "/dashboard/bidder/home",
        icon: <DashboardIcon />,
      },
      {
        title: common("text.my bids"),
        route: "/dashboard/bidder/mybiddes",
        icon: <BidderIcon />,
      },
      {
        title: common("text.wishlist"),
        route: "/dashboard/bidder/wishlist",
        icon: <ClipIcon />,
        count: wishs,
      },
      {
        title: common("text.chat"),
        route: "/dashboard/bidder/chat",
        icon: <ChatIcon />,
      },
    ],
    STAFF: [],
  };
  const { loading } = useNotif();
  const hasData = useAuctionCountStore((state) => state.hasData);

  const {} = trpc.admin.getAuctionsCount.useQuery(undefined, {
    enabled: !hasData && (type == "ADMIN" || type == "STAFF"),

    onSuccess: (data) => {
      useAuctionCountStore.getState().init(data);
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  useEffect(() => {
    if (!hasData && (type == "ADMIN" || type == "STAFF")) {
      loading();
    }
  }, []);

  return (
    <>
      <LangCommonContext.Provider value={common}>
        <CreateAuction />
        <div className="drawer-mobile drawer">
          <input id="drawer" type="checkbox" className="drawer-toggle" />
          <div className={cx("drawer-content relative", background)}>
            {!hideNav && <NavBar />}
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
                      {common("text.new auction")}
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
                    {common("text.settings")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </LangCommonContext.Provider>
    </>
  );
};

export const NavBar = () => {
  return (
    <div
      className={cx(
        "sticky top-0 right-0 z-50 flex h-[60px] w-full  flex-row items-center gap-3 px-3 backdrop-blur-md"
      )}
    >
      <div className="flex-grow"></div>
      <NotificationComponent />
      <ProfileCard />
    </div>
  );
};

export const NavBarFixed = () => {
  return (
    <div
      className={cx(
        "flex h-[60px] w-full  flex-row items-center gap-3 border-b border-l px-3"
      )}
    >
      <div className="flex-grow"></div>
      <NotificationComponent />
      <ProfileCard />
    </div>
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
  const { notifications, num, onSeenNotifications, newNotifs } =
    useGetNotifications();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);

    onSeenNotifications();
  };
  const router = useRouter();
  return (
    <>
      <button
        onClick={showDrawer}
        className="btn-ghost btn flex flex-row gap-1 hover:bg-primary/10"
      >
        {num > 0 && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
            {num}
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
        {notifications
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((n, i) => {
            const isNew = newNotifs.map((n) => n.uid).includes(n.uid || "");
            return (
              <div
                onClick={() => {
                  router.push(n.link);
                  onClose();
                }}
                key={i}
                className={cx(
                  "relative mb-3 cursor-pointer rounded-md border p-3",
                  {
                    "text-primary": isNew,
                  }
                )}
              >
                <div
                  hidden={!isNew}
                  className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-red-400"
                ></div>
                <div className="flex flex-col">
                  <div className="text-sm font-bold">{n.title}</div>
                  <div className="text-xs">{n.body}</div>
                  <div className="self-end text-[10px] italic">
                    {moment(n.date).fromNow()}
                  </div>
                </div>
              </div>
            );
          })}
      </Drawer>
    </>
  );
};
