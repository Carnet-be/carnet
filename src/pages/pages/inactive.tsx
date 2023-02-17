import { User } from '@prisma/client';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import React from 'react'

import { prisma } from "../../server/db/client";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    console.log(session?.user);
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
  
    switch (user.type) {
      case "AUC":
        route = "/dashboard/auctionnaire";
        break;
      case "BID":
        if(user.isActive){
            return {
                props:{}
              };
        }else{
          route = "/pages/inactive";
        }
       
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
const Inactive = () => {
    const router=useRouter()
  return (
    <div className='flex flex-col gap-10 items-center justify-center h-screen w-screen'>
        <div className='h-[250px]'>
            <img src='/assets/account_locked.svg' alt='inactive' className='h-full w-full'/>
          
        </div>
    <div className='flex flex-row gap-4 items-center'>
    <h6>Your account need confirmation</h6>
    <button onClick={()=>router.reload()} className='btn btn-sm'>refreach</button>
    </div>
    </div>
  )
}

export default Inactive