import type { User } from '@prisma/client';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import type{ GetServerSideProps } from 'next';
import React from 'react'

import { prisma } from "../../server/db/client";
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
  let route;
  if(!user.isActive){
    console.log("user is not active")
    return {
      redirect: {
        destination: "/pages/inactive",
        permanent: true,
      },
    }

}
  let isAdmin = false;
  if(user.type === "ADMIN"){
    isAdmin = true;
  }
  return {
   props:{
    id:user.id,
    isAdmin}
  };
};
const Settings = (props: { id: string, isAdmin: boolean }) => {
  const {id,isAdmin} = props;
  return <div></div>
}

export default Settings