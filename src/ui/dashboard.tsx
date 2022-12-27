import React, { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { AuctionIcon, ClipIcon, DashboardIcon, NotifIcon, PeopleIcon, SettingsIcon,BidderIcon,DataIcon } from "./icons";
import { type UserType } from "@model/type";
import Logo from "./components/logo";
import { useSession } from "next-auth/react";
import ProfileCard from "./profileCard";
import { AddIcon } from '@ui/icons';
import CreateAuction  from '@ui/createAuction';

type TSide = {
  route: string;
  title: string;
  icon: ReactNode;
};

type DashboardType = {
  children: ReactNode;
  type: UserType;
  notification?: ReactNode;
  background?:string
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
      title: "Auctions",
      route: "/admin/dashboard/auctions",
      icon: <AuctionIcon />,
    },
    {
      title: "Bids",
      route: "/admin/dashboard/bids",
      icon:<BidderIcon />,
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
      icon: <DataIcon/>,
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
      icon:<BidderIcon />,
    },
    {
      title: "Wish list",
      route: "/dashboard/bidder/wishlist",
      icon: <ClipIcon />,
    },
  ],
  STAFF: [],
};
const Dashboard = ({ children, type,background="bg-background" }: DashboardType) => {
  const router = useRouter();
  const {data:session}=useSession()
  return (
    <>
       <CreateAuction/>
    <div className="drawer-mobile drawer">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className={cx("drawer-content relative",background)}>
        <div className="sticky z-50 top-0 right-0 flex h-[60px] w-full  flex-row items-center gap-3 px-3 backdrop-blur-md">
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
      <div className="p-3 lg:p-6 lg:px-14">
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
              const active = router.pathname == m.route || router.pathname.includes(m.route);
              return <Side key={i} side={m} active={active} />;
            })}
          </ul>
          <ul className="menu w-[80%] space-y-2">
         {type=="AUC"&& <li>
              <label  htmlFor="create_auction"
                className={cx("flex flex-row gap-5 rounded-lg font-light no-underline border")}
              >
                <div className="text-xl">
                  <AddIcon />
               
                </div>
                New Auction
              </label>
            </li>}
            <li>
              <Link
                href={"/admin/dashboard/settings"}
                className={cx("flex flex-row gap-5 rounded-lg font-light no-underline border")}
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
