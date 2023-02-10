import React, { useState } from "react";

import { type NextPage, type GetServerSideProps } from "next";

import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import Lottie from "@ui/components/lottie";
import cx from "classnames";
import animationData from "../../../../public/animations/location.json";
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
  const [hide, setHide] = useState(false);
  return (
    <div className={cx("mx-auto flex h-[250px] max-w-[800px] flex-row items-center justify-between rounded-xl bg-primary p-10 drop-shadow-xl",hide&&"hidden")}>
      
      <div className="flex-grow flex flex-col gap-4 max-w-[400px] space-y-6">
        <p className="text-xl font-bold text-white">
          Join the Excitement: Create Your Own Auction and Watch the Bids Roll
          In!
        </p>
        <label  htmlFor="create_auction" className="bg-white text-primary px-4 py-2 rounded-xl text-center w-[200px] cursor-pointer">
          Create Auction
        </label>
      </div>
      <div className="w-[330px]">
        <Lottie animationData={animationData} />
      </div>
    </div>
  );
};
