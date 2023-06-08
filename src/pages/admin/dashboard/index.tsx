/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";

import {
  type NextPage,
  type GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { type User } from "@prisma/client";
import { prisma } from "../../../server/db/client";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { LoadingSpinPage } from "@ui/loading";
import { useAdminDashboardStore } from "../../../state";
import { toast } from "react-hot-toast";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/admin",
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
        destination: "/admin",
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

  //const home="/users/pro"
  return {
    redirect: {
      destination: "/admin/dashboard/users/pro",
      permanent: true,
    },
  };
};
const AdminDashboard: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { setNums, setReload } = useAdminDashboardStore((state) => state);
  //   const {data,refetch}=trpc.admin.getAuctionsCount.useQuery(undefined,{onError(err) {
  //     console.log(err);

  //   },
  //   onSuccess(data){
  //     setNums(data)
  //     setReload(()=>{refetch()})
  //   },
  //   onSettled(data){
  //    toast.dismiss()
  //   }
  // });
  const router = useRouter();
  // const init=async()=>{

  useEffect(() => {
    router.push("/admin/dashboard/users/pro");
  }, []);
  // toast.loading("Loading data...")

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinPage />
    </div>
  );
};

export default AdminDashboard;
