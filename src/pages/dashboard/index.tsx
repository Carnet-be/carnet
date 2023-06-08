import React from "react";

import Lottie from "@ui/components/lottie";
import animationData from "@animations/dashboard.json";

import {
  type NextPage,
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { signOut } from "next-auth/react";
import { prisma } from "../../server/db/client";
import { type User } from "@prisma/client";

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
  if (!user.isActive) {
    console.log("user is not active");
    return {
      redirect: {
        destination: "/pages/inactive",
        permanent: true,
      },
    };
  }
  switch (user.type) {
    case "AUC":
      route = "/dashboard/pro";
      break;
    case "BID":
      route = "/dashboard/user";
      break;
    default:
      route = "/admin/dashboard";
      break;
  }
  return {
    redirect: {
      destination: route,
      permanent: true,
    },
  };
};
const Dashboard: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const user: User = props.user;
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="w-1/2">
        <Lottie animationData={animationData} />
      </div>
      <div className="">
        <p>
          <span className="text-green-500 underline">{user.email}</span>{" "}
          connecté en tant que{" "}
          <span className="text-primary">
            {user.type == "BID" ? "Bidder" : "Auctionnaire"}
          </span>
        </p>
      </div>
      <button onClick={() => signOut()} className="btn-error btn-sm btn mt-5">
        deconnexion
      </button>
    </div>
  );
};

export default Dashboard;
