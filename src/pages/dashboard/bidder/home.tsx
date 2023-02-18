import BigTitle from "@ui/components/bigTitle";
import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
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
  const user = await prisma.user
    .findUnique({ where: { email: session.user?.email || "" } })
    .then((user) => JSON.parse(JSON.stringify(user)));

    if(!user.isActive){
        return {
            redirect: {
              destination: "/pages/inactive",
              permanent: true,
            },
          };

    }
  return {
    props: {user},
  };
};
type TFilterBidde = "new" | "feature" | "trending" | "buy now";
const Home = (props:InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const user:TUser=props.user
  const filter = (router.query.filter as TFilterBidde) || "new";
  const { data: auctions } = trpc.auctionnaire.getAuctions.useQuery({ filter,state:"published" });
  return (
    <Dashboard type="BID">
      <BigTitle />
      <div className="flex flex-row gap-4 py-6">
        {(["new", "feature", "trending", "buy now"] as TFilterBidde[]).map(
          (f, i) => {
            const isActive = filter == f;
            return (
              <button
                key={i}
                onClick={() => {
                  if (!isActive) {
                    router.push(
                      {
                        pathname: "/dashboard/bidder/home",
                        query: { filter: f },
                      },
                      undefined,
                      { shallow: true }
                    );
                    console.log("click");
                  }
                }}
                className={cx("  btn", {
                  "btn-primary  btn-active": isActive,
                  "btn-ghost": !isActive,
                })}
              >
                {f}
              </button>
            );
          }
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-6">
        {!auctions ? (
          <span>No data</span>
        ) : (
          auctions.map((a, i) => <AuctionCard key={i} auction={a as TAuction} isFavorite={user.favoris_auctions.includes(a.id)}/>)
        )}
      </div>
    </Dashboard>
  );
};

export default Home;
