import React, { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { AuctionIcon, ClipIcon, DashboardIcon, NotifIcon, PeopleIcon, SettingsIcon } from "./icons";
import { type UserType } from "@model/type";
import Logo from "./components/logo";
import { useSession } from "next-auth/react";
import ProfileCard from "./profileCard";

type TSide = {
  route: string;
  title: string;
  icon: ReactNode;
};

type DashboardType = {
  children: ReactNode;
  type: UserType;
  notification?: ReactNode;
};
type TMenu = {
  ADMIN: Array<TSide>;
  STAFF: Array<TSide>;
  AUC: Array<TSide>;
  BID: Array<TSide>;
};
const menu: TMenu = {
  ADMIN: [
    {
      title: "Accueil",
      route: "/admin/dashboard/accueil",
      icon: <DashboardIcon />,
    },
    {
      title: "Staff",
      route: "/admin/dashboard/staff",
      icon: <PeopleIcon />,
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
      icon:<AuctionIcon />,
    },
    {
      title: "Wish list",
      route: "/dashboard/bidder/wishlist",
      icon: <ClipIcon />,
    },
  ],
  STAFF: [],
};
const Dashboard = ({ children, type }: DashboardType) => {
  const router = useRouter();
  const {data:session}=useSession()
  return (
    <div className="drawer-mobile drawer">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content relative bg-background">
        <div className="sticky top-0 right-0 flex h-[60px] w-full  flex-row items-center gap-3 px-3 backdrop-blur-md">
          <div className="flex-grow"></div>
          <div className="btn-ghost hover:bg-primary/10 btn flex flex-row gap-1">
            <span className="badge-error badge indicator-start indicator-item text-sm text-white">
              2
            </span>
            <NotifIcon className="text-2xl text-primary" />
            
          </div>
          <ProfileCard/>
        </div>
        {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
      <div className="p-3 lg:p-6">
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
              const active = router.pathname == m.route;
              return <Side key={i} side={m} active={active} />;
            })}
          </ul>
          <ul className="menu w-[80%]">
            <li>
              <Link
                href={"/admin/dashboard/settings"}
                className={cx("flex flex-row gap-5 rounded-lg font-light")}
              >
                <div className="text-xl">
                  <SettingsIcon />
                </div>
                Compte
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Side = ({ side, active }: { side: TSide; active: boolean }) => {
  return (
    <li>
      <Link
        href={side.route}
        className={cx("flex flex-row gap-5 rounded-lg font-light no-underline", {
          "bg-primary text-white": active,
        })}
      >
        <div className="text-xl">{side.icon}</div> {side.title}
      </Link>
    </li>
  );
};
export default Dashboard;
