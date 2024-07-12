/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import cx from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export type TMenuItem = {
  label: string;
  route: string;
  icon: React.ReactNode;
  children?: TMenuItem[];
};
const MenuItem = ({ children }: { children: TMenuItem }) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = React.useState(false);
  useEffect(() => {
    if (children.route === "/dashboard/home") {
      setIsActive(
        pathname.includes("/dashboard/home") ||
          pathname.includes("/dashboard/car/"),
      );
    } else {
      setIsActive(pathname.includes(children.route));
    }
  }, [pathname]);
  return (
    <Link
      href={children.route}
      className={cx(
        "group flex items-center rounded-lg p-2 text-base font-medium  no-underline",
        isActive
          ? "bg-primary  text-primary-foreground "
          : "text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      )}
    >
      {children.icon}
      <span className="ml-3 text-sm font-normal">{children.label}</span>
    </Link>
  );
};

export default MenuItem;
