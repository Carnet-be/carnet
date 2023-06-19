/* eslint-disable @next/next/no-img-element */
import Dashboard from "@ui/dashboard";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";

import { getServerAuthSession } from "@server/common/get-server-auth-session";
import BigTitle from "@ui/components/bigTitle";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Loading from "@ui/components/loading";
import type { TAuction, TUser } from "@model/type";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { trpc } from "@utils/trpc";
import { createContext } from "react";
import { LangCommonContext, LangContext, useLang } from "../../../hooks";
import { LeftSide, RightSide } from "../auction/[id]";
import { prisma } from "../../../../server/db/client";

export const UserContext = createContext<TUser | undefined>(undefined);

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
  const id = ctx.query.id as string | undefined;

  if (!id) {
    return {
      redirect: {
        destination: "/dashboard/user/cars",
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
  const { data: auction } = trpc.auctionnaire.getCar.useQuery(props.id, {
    onError: (err) => {
      console.log(err);
      toast.error("");
    },
  });

  return (
    <Dashboard type="BID" background="bg-[#FCFCFF]">
      {!auction ? (
        <Loading classContainer="h-[80vh]" />
      ) : (
        <UserContext.Provider value={props.user}>
          <LangCommonContext.Provider value={common}>
            <LangContext.Provider value={text}>
              <BigTitle title={auction.name} />
              <div className="flex flex-wrap justify-center gap-6">
                <LeftSide auction={auction as unknown as TAuction} />
                <RightSide
                  auction={auction as unknown as TAuction}
                  isBuyNow={true}
                />
              </div>
            </LangContext.Provider>
          </LangCommonContext.Provider>
        </UserContext.Provider>
      )}
    </Dashboard>
  );
};

export default Home;
