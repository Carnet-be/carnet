import React from "react";


import {
  type NextPage,
  type GetServerSideProps,
} from "next";
import { type User } from "@prisma/client";
import { prisma } from '../../../server/db/client';
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import Dashboard from "@ui/dashboard";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log(session?.user);
  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: true,
      },
    };
  }
  const user:User = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));
  if (!user) {
    return {
      redirect: {
        destination: "/admin",
        permanent: true,
      },
    };
  }
  if(!user.emailVerified){
    return {
      redirect: {
        destination: "/pages/email-verification",
        permanent: true,
      },
    };
  }
  return {
    props: {
      user,
    },
  };
};
const AdminDashboard: NextPage = () => {

  return (
   <Dashboard type="ADMIN">

   </Dashboard>
  );
};

export default AdminDashboard;
