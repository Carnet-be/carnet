import { getServerAuthSession } from '@server/common/get-server-auth-session';
import type { InferGetServerSidePropsType } from 'next';
import { type GetServerSideProps } from 'next';
import React from 'react'
import cx from 'classnames'
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
 
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    }

  return {
    redirect: {
      destination: "/admin/dashboard/data/brands",
      permanent: true,
    },
  };
};
 const Data = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>Data</div>
  )
}

export default Data

export const SwitcherData=()=>{
  const router=useRouter()
  const routers=[{
    title:"Brand",
    route:"/admin/dashboard/data/brands"
  },
  {
    title:"Model",
    route:"/admin/dashboard/data/models"
  }
]
  return <div className="tabs tabs-boxed px-3 py-1 gap-4">
    {routers.map((r,i)=>{
      const isActive=router.pathname==r.route
      return <Link key={i} href={r.route} className={cx("tab no-underline",{"tab-active":isActive})}>{r.title}</Link>
    })}

</div>
}