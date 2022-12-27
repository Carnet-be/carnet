import { getServerAuthSession } from '@server/common/get-server-auth-session';
import type { InferGetServerSidePropsType } from 'next';
import { type GetServerSideProps } from 'next';
import React from 'react'
import Dashboard  from '@ui/dashboard';
import { Switcher } from '.';
import { trpc } from '@utils/trpc';
import BigTitle from '@ui/components/bigTitle';
import type { TableType } from '@ui/components/table';
import MyTable,{ActionTable} from '@ui/components/table';
import type { User } from '@prisma/client';
import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    console.log(session?.user);
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    }

  return {
    props: {},
  };
};
 const Bidders = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {data:auctioneers,isLoading}=trpc.admin.getUsers.useQuery({type:"BID"})
  const columns:ColumnsType<User>=[
    {
        title: "Id",
        width:"150px",
        dataIndex: "id",
        key: "id",
        render: (v) => <span className="italic text-primary text-[12px]">#{v}</span>,
      },
      {
        title: "Username",
        dataIndex: "username",
        key: "username",
        render: (v) => <h6>{v}</h6>,
      }, 
      {
        title: "Phone",
        dataIndex: "tel",
        key: "tel",
       
      }, 
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
       
      }, 
      {
        title: "Bids",
        dataIndex: "bids",
        key: "bids",
        align:"right",
        render: (v) => <Tag>{v.length}</Tag>,
       
      }, 
      {
        title: "Actions",
  
        dataIndex: "actions",
        key: "actions",
        align: "center",
        fixed:"right",
        render: () => <ActionTable onDelete={()=>{console.log('delete')}} onEdit={()=>{console.log('edit')}} onView={()=>{console.log('view')}}/>,
      },
    ]
  return (
      <Dashboard type="ADMIN">
        <Switcher/>
       
      <div className="flex flex-col mt-6">

        <MyTable
          loading={isLoading}
          data={auctioneers || []}
         // xScroll={1000}
         
          columns={columns as ColumnsType<TableType>}
         // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
      </Dashboard>
  )
}

export default Bidders