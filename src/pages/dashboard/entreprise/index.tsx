import React, { useState } from "react";

import { type NextPage, type GetServerSideProps } from "next";

import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import Lottie from "@ui/components/lottie";
import cx from "classnames";
import animationData from "../../../../public/animations/location.json";
import { useLang } from "../../hooks";
import { prisma } from "../../../server/db/client";
import type { User } from "@prisma/client";
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

  const user: User = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));
  if (!user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
  if (!user.emailVerified) {
    return {
      redirect: {
        destination: "/pages/email-verification",
        permanent: true,
      },
    };
  }
  const home = "/home";
  return {
    redirect: {
      destination: "/dashboard/entreprise/" + home,
      permanent: true,
    },
  };
};
const AuctionnaireDashboard: NextPage = () => {
  return <div>Auctionnaire</div>;
};

export default AuctionnaireDashboard;

export const BannierAddAuction = () => {
  const { text } = useLang({
    file: "dashboard",
    selector: "auctioneer",
  });
  return (
    <div
      className={cx(
        "mx-auto flex h-[250px] max-w-[800px] flex-row items-center justify-between rounded-xl bg-primary p-10 drop-shadow-xl"
      )}
    >
      <div className="flex max-w-[400px] flex-grow flex-col gap-4 space-y-6">
        <p className="text-xl font-bold text-white">
          {text("new auction card.title")}
        </p>
        <label
          htmlFor="create_auction"
          className="w-[200px] cursor-pointer rounded-xl bg-white px-4 py-2 text-center text-primary"
        >
          {text("new auction card.button")}
        </label>
      </div>
      <div className="w-[330px]">
        <Lottie animationData={animationData} />
      </div>
    </div>
  );
};
