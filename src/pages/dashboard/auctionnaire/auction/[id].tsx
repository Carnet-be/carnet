/* eslint-disable @next/next/no-img-element */
import Dashboard from "@ui/dashboard";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";

import Map from "@ui/components/map";
import Slider from "react-slick";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import BigTitle from "@ui/components/bigTitle";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { toast } from "react-hot-toast";
import Loading from "@ui/components/loading";
import type { TAuction, TUser } from "@model/type";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangCommonContext, LangContext, useLang } from "../../../hooks";
import { LeftSide, RightSide } from "../../bidder/auction/[id]";
import { prisma } from "../../../../server/db/client";
import { createContext } from "react";

export const UserContext = createContext<TUser | undefined>(undefined);

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
  const id = ctx.query.id as string | undefined;

  if (!id) {
    return {
      redirect: {
        destination: "/dashboard/bidder/home",
        permanent: true,
      },
    };
  }

  const user = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  return {
    props: {
      user,
      id,
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { text } = useLang({ file: "dashboard", selector: "auction" });
  const { text: common } = useLang(undefined);
  const { data: auction } = trpc.auctionnaire.get.useQuery(props.id, {
    onError: (err) => {
      console.log(err);
      toast.error("");
    },
  });

  return (
    <Dashboard type="AUC" background="bg-[#FCFCFF]">
      {!auction ? (
        <Loading classContainer="h-[80vh]" />
      ) : (
        <UserContext.Provider value={props.user}>
          <LangCommonContext.Provider value={common}>
            <LangContext.Provider value={text}>
              <BigTitle title={auction.name} />
              <div className="flex flex-wrap justify-center gap-6">
                <LeftSide auction={auction as TAuction} />
                <RightSide auction={auction as TAuction} />
              </div>
            </LangContext.Provider>
          </LangCommonContext.Provider>
        </UserContext.Provider>
      )}
    </Dashboard>
  );
};

export default Home;
