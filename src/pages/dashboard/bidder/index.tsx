import React from "react";


import {
  type NextPage,
  type GetServerSideProps,
} from "next";

import { getServerAuthSession } from "../../../server/common/get-server-auth-session";

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
    redirect:{
      destination: "/dashboard/bidder/"+home,
      permanent:true
    }
  };
};
const BidderDashboard: NextPage = () => {
return <div>
   bidder
</div>
};

export default BidderDashboard;
