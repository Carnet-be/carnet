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
      destination: "/dashboard/auctionnaire/"+home,
      permanent:true
    }
  };
};
const AuctionnaireDashboard: NextPage = () => {
return <div>
    Auctionnaire
</div>
};

export default AuctionnaireDashboard;
