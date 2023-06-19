/* eslint-disable @typescript-eslint/no-explicit-any */
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
import type { TAuction, TCar, TUser } from "@model/type";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLang } from "../../hooks";
import { LoadingSpinPage } from "@ui/loading";
import CarCard from "@ui/components/carCard";

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
    .findUnique({
      where: { email: session.user?.email || "" },
      include: {
        favoris_auctions: true,
      },
    })
    .then((user) => JSON.parse(JSON.stringify(user)));

  if (!user.isActive) {
    return {
      redirect: {
        destination: "/pages/inactive",
        permanent: true,
      },
    };
  }

  return {
    props: {
      user,
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
type TFilterBidde = "auctions" | "buy now"; //| "feature" | "trending";
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const user: TUser = props.user;
  const { text } = useLang({ file: "dashboard", selector: "bidder" });
  const filter = (router.query.filter as TFilterBidde) || "auctions";
  const { data: auctions, isLoading } = trpc.auctionnaire.getAuctions.useQuery(
    {
      filter,
      state: "published",
    },
    {
      enabled: filter == "auctions",
    }
  );
  const { data: cars, isLoading: isLoadingCars } =
    trpc.auctionnaire.getCars.useQuery(
      { filter: "all", state: "published" },
      {
        enabled: filter == "buy now",
      }
    );
  return (
    <Dashboard type="BID">
      <BigTitle />
      <div className="flex flex-row gap-4 py-6">
        {(["auctions", "buy now"] as TFilterBidde[]).map((f, i) => {
          const isActive = filter == f;
          return (
            <button
              key={i}
              onClick={() => {
                if (!isActive) {
                  router.push(
                    {
                      pathname: "/dashboard/user/home",
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
              {text("filter." + f)}
            </button>
          );
        })}
      </div>
      {filter == "auctions" && (
        <AuctionsList
          auctions={auctions as unknown as TAuction[]}
          isLoading={isLoading}
          user={user}
        />
      )}
      {filter == "buy now" && (
        <CarList
          auctions={cars as unknown as TCar[]}
          isLoading={isLoadingCars}
        />
      )}
    </Dashboard>
  );
};

export default Home;

const AuctionsList = ({
  auctions,
  isLoading,
  user,
}: {
  auctions: TAuction[];
  isLoading: boolean;
  user: TUser;
}) => {
  return (
    <div className="flex flex-wrap items-center  gap-6">
      {isLoading ? (
        <LoadingSpinPage />
      ) : !auctions ? (
        <span>No data</span>
      ) : (
        auctions.map((a, i) => <AuctionCard key={i} auction={a as any} />)
      )}
    </div>
  );
};

export const CarList = ({
  auctions,
  isLoading,
}: {
  auctions: TCar[];
  isLoading: boolean;
}) => {
  return (
    <div className="flex flex-wrap items-center  gap-6">
      {isLoading ? (
        <LoadingSpinPage />
      ) : !auctions ? (
        <span>No data</span>
      ) : (
        auctions.map((a, i) => <CarCard key={i} auction={a as any} />)
      )}
    </div>
  );
};
