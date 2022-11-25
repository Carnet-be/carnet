import React, { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { DashboardIcon, PeopleIcon, SettingsIcon } from "./icons";
import { type UserType } from "@model/type";
import Logo from "./components/logo";

type TSide = {
  route: string;
  title: string;
  icon: ReactNode;
};

type DashboardType = {
  children: ReactNode;
  type: UserType;
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
  AUC: [],
  BID: [],
  STAFF: [],
};
const Dashboard = ({ children, type }: DashboardType) => {
  const router = useRouter();
  return (
    // <div className='w-screen h-screen relative flex flex-row items-stretch'>
    //   <div className="bg-white flex flex-col w-[300px] fixed top-0 left-0 overflow-scroll">
    //     <div className='w-full h-[1000px] bg-red-400'></div>
    //     <div className='w-full h-[1000px] bg-yellow-400'></div>
    //     <div className='w-full h-[1000px] bg-blue-400'></div>
    //     <div className='w-full h-[1000px] bg-red-400'></div>
    //     <div className='w-full h-[1000px] bg-purple-400'></div>
    //   </div>
    //   <div className='flex-grow bg-background'></div>
    // </div>
    <div className="drawer-mobile drawer">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-background">
        {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> */}
        {children}
      </div>
      <div className="drawer-side w-[300px] px-4">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex flex-row items-center justify-center py-4">
            <Logo size={70} />
          </div>
          <ul className="menu flex w-full flex-grow flex-col gap-2 bg-base-100 py-3 text-base-content">
            {menu[type].map((m, i) => {
              const active = router.pathname == m.route;
              return <Side key={i} side={m} active={active} />;
            })}
          </ul>
          <ul className="menu w-full">
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
        className={cx("flex flex-row gap-5 rounded-lg font-light", {
          "bg-primary text-white": active,
        })}
      >
        <div className="text-xl">{side.icon}</div> {side.title}
      </Link>
    </li>
  );
};
export default Dashboard;
