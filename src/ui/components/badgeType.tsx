import { UserType } from "@prisma/client";
import React from "react";
import cx from "classnames";
type Props = {
  type: UserType;
};

const BadgeType = (props: Props) => {
  function getConfig():
    | {
        text: string;
        gradient: string;
      }
    | undefined {
    switch (props.type) {
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
    <div
      className={cx(
        "rounded-lg px-2 py-1 text-[9px] font-bold uppercase text-white",
        getConfig()?.gradient
      )}
    >
      {getConfig()?.text}
    </div>
  ) : null;
};

export default BadgeType;
