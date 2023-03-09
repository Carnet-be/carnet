/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";


import {
  type NextPage,
  type GetServerSideProps, InferGetServerSidePropsType } from "next";
import { type User } from "@prisma/client";
import { prisma } from '../../../server/db/client';
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { LoadingSpinPage } from "@ui/loading";
import { useAdminDashboardStore } from "../../../state";
import { toast } from "react-hot-toast";
import OneSignal from 'react-onesignal';
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

  //const home="/users/auctioneers"
 return {
  redirect: {
    destination: "/admin/dashboard/users/auctioneers",
 }}
};
const AdminDashboard: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {setNums,setReload}=useAdminDashboardStore(state=>state)
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
const router=useRouter();
// const init=async()=>{
 
//     await  OneSignal.init({
//       appId: "fe92544d-c2b6-4cc8-81be-8bf2607c7a4b",
//       allowLocalhostAsSecureOrigin: true,
//     }).then(async(one) => {
//         console.log('one', one)
//       await OneSignal.sendTag('admin', true);
//       OneSignal.showSlidedownPrompt();
//     }).finally(()=>{
//     router.push("/admin/dashboard/users/auctioneers")}
//     )
// }
async function runOneSignal() {
  await OneSignal.init({ appId: 'fe92544d-c2b6-4cc8-81be-8bf2607c7a4b', allowLocalhostAsSecureOrigin: true});
  await OneSignal.sendTag('admin', true);
  OneSignal.showSlidedownPrompt();
  router.push("/admin/dashboard/users/auctioneers")
}

useEffect(() => {
  
  runOneSignal()
  // if (typeof window !== undefined) {
  //   window.OneSignal = window.OneSignal || [];
  //   OneSignal.push(function () {
  //     OneSignal.init({
  //       appId: "YOUR_ONE_SIGNAL_ID",
  //       notifyButton: {
  //         enable: true,
  //       },
  //     });
  //   });
  // }

  // return () => {
  //   window.OneSignal = undefined;
  // };
}, []);
  // toast.loading("Loading data...")
 


return <div className="flex items-center justify-center w-screen h-screen">
<LoadingSpinPage/>
</div>
};

export default AdminDashboard;
