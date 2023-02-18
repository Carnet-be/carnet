import React, { useEffect } from "react";


import {
  type NextPage,
  type GetServerSideProps,
} from "next";

import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { trpc } from "@utils/trpc";
import { useBidderStore } from "../../../state";
import { useRouter } from "next/router";
import Loading, { LoadingSpinPage } from "@ui/loading";
import { auctionnaireRouter } from '../../../server/trpc/router/auctionnaire';

import { prisma } from '../../../server/db/client';
import { User } from "@prisma/client";
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
  const caller=auctionnaireRouter.createCaller({prisma:prisma,session})
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

  if(!user.isActive){
    return {
      redirect: {
        destination: "/pages/inactive",
        permanent: true,
      },
    };
  }


 const wishs= await caller.getFavCount()
  return {
    props:{
      wishs
    }
  };
};
const BidderDashboard = (props:{wishs:number}) => {
  const setWish=useBidderStore((state)=>state.setWishs)
  const router=useRouter()

  useEffect(() => {
    setWish(props.wishs)
    router.replace("/dashboard/bidder/home",undefined,{shallow:true})
  }, [])
  
return <div className="flex items-center justify-center w-screen h-screen">
  <LoadingSpinPage/>
</div>
};

export default BidderDashboard;
