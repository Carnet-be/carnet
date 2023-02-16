import React from "react";


import {
  type NextPage,
  type GetServerSideProps,
} from "next";

import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { trpc } from "@utils/trpc";
import { useBidderStore } from "../../../state";
import { useRouter } from "next/router";
import Loading from "@ui/loading";

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
  const home="/home"
  return {
    props:{}
  };
};
const BidderDashboard: NextPage = () => {
  const setWish=useBidderStore((state)=>state.setWishs)
  const router=useRouter()
  const { } =
  trpc.auctionnaire.getFavCount.useQuery(undefined,{
    onSuccess: (data) => {
      console.log(data);
      setWish(data)
      router.replace("/dashboard/bidder/home")
    }
  });
return <div className="flex items-center justify-center w-screen h-screen">
  <Loading/>
</div>
};

export default BidderDashboard;
