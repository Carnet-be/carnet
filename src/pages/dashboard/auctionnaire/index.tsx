import React, { useState } from "react";

import { type NextPage, type GetServerSideProps } from "next";

import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import Lottie from "@ui/components/lottie";
import cx from "classnames";
import animationData from "../../../../public/animations/location.json";
import { useLang } from "../../hooks";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
  const home = "/home";
  return {
    redirect: {
      destination: "/dashboard/auctionnaire/" + home,
      permanent: true,
    },
  };
};
const AuctionnaireDashboard: NextPage = () => {
  return <div>Auctionnaire</div>;
};

export default AuctionnaireDashboard;

export const BannierAddAuction = () => {
  const {text}=useLang({
    file:"dashboard",
    selector:"auctioneer"
  })
  return (
    <div className={cx("mx-auto flex h-[250px] max-w-[800px] flex-row items-center justify-between rounded-xl bg-primary p-10 drop-shadow-xl")}>
      
      <div className="flex-grow flex flex-col gap-4 max-w-[400px] space-y-6">
        <p className="text-xl font-bold text-white">
         {text("new auction card.title")}
        </p>
        <label  htmlFor="create_auction" className="bg-white text-primary px-4 py-2 rounded-xl text-center w-[200px] cursor-pointer">
        {text("new auction card.button")}
        </label>
      </div>
      <div className="w-[330px]">
        <Lottie animationData={animationData} />
      </div>
    </div>
  );
};
