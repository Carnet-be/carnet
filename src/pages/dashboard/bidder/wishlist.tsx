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
import { useContext, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import AuctionCard from "@ui/components/auctionCard";
import { UserType } from "@prisma/client";
import { prisma } from "../../../server/db/client";
import type { TAuction, TUser } from "@model/type";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangCommonContext, useLang } from "../../hooks";

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
    props: {
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
//
const WishList = () => {
  const { data: auctions, refetch } = trpc.auctionnaire.getAuctions.useQuery({
    filter: "mine",
  });
  const { text: common } = useLang(undefined);
  return (
    <Dashboard type="BID">
      <BigTitle title={common("text.wishlist")} />
      <div className="h-[20px]"></div>
      {!auctions || auctions.length <= 0 ? (
        <div className="my-3  border border-blue-800 bg-blue-100 px-5 py-3 italic text-blue-800">
          {common("text.no data")}
        </div>
      ) : (
        <div className="flex flex-wrap items-center  gap-6">
          {auctions.map((a, i) => (
            <AuctionCard
              key={i}
              auction={a as unknown as TAuction}
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
