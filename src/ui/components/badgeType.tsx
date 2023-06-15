import { UserType } from "@prisma/client";
import React from "react";
import cx from "classnames";
import { trpc } from "@utils/trpc";
import { LoadingSpin } from "@ui/loading";
import { Spin } from "antd";
type Props = {
  size?: "small" | "medium" | "large";
};

const BadgeType = ({ size = "medium" }: Props) => {
  const { data: user } = trpc.user.get.useQuery();
  function getConfig():
    | {
        text: string;
        gradient: string;
        loading?: boolean;
      }
    | undefined {
    if (!user)
      return {
        text: "Loading...",
        gradient: "bg-gradient-to-r from-blue-400 to-pink-500",
        loading: true,
      };
    switch (user.type) {
      case "ADMIN":
        return {
          text: "Admin",
          gradient: "bg-gradient-to-r from-blue-400 to-pink-500",
        };
      case "AUC":
        return {
          text: "Pro",
          gradient: "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500",
        };
      default:
        return undefined;
    }
  }
  return getConfig() ? (
    getConfig()?.loading ? (
      <Spin size="small"></Spin>
    ) : (
      <div
        className={cx(
          "rounded-lg text-[9px] font-bold uppercase text-white",
          size === "small"
            ? "rounded px-[4px] py-[1px] text-[7px]"
            : size === "medium"
            ? "px-2  py-[1px] text-[9px]"
            : "px-2 py-[1px]  text-[11px]",

          getConfig()?.gradient
        )}
      >
        {getConfig()?.text}
      </div>
    )
  ) : null;
};

export default BadgeType;

export const BadgePro = ({ size = "medium" }: Props) => {
  return (
    <div
      className={cx(
        "rounded-lg text-[9px] font-bold uppercase text-white",
        size === "small"
          ? "rounded px-[4px] py-[1px] text-[7px]"
          : size === "medium"
          ? "px-2  py-[1px] text-[9px]"
          : "px-2 py-[1px]  text-[11px]",

        "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
      )}
    >
      pro
    </div>
  );
};
