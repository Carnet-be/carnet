import BigTitle from "@ui/components/bigTitle";
import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
  type NextPage,
} from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import cx from "classnames";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import AuctionCard from "@ui/components/auctionCard";
import { UserType } from "@prisma/client";
import { prisma } from "../../../server/db/client";
import type { TAuction, TUser } from "@model/type";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};
//
const WishList = () => {
  const { data: auctions, refetch } = trpc.auctionnaire.getAuctions.useQuery({
    filter: "mine",
  });
  return (
    <Dashboard type="BID">
         <BigTitle title="My Wishlist"/>
         <div className="h-[20px]"></div>
      {!auctions || auctions.length <= 0 ? (
       
          <div className="px-5 text-blue-800 bg-blue-100 border-blue-800 my-3 rounded-2xl border py-3 italic">
            No data
          </div>
       
      ) : (
        <div className="flex flex-wrap items-center  gap-6">
          {auctions.map((a, i) => (
            <AuctionCard
              key={i}
              auction={a as TAuction}
              isFavorite={true}
              onClickFavorite={() => refetch()}
            />
          ))}
        </div>
      )}
    </Dashboard>
  );
};

export default WishList;
