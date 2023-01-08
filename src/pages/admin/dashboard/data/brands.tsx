import { getServerAuthSession } from '@server/common/get-server-auth-session';
import type { InferGetServerSidePropsType } from 'next';
import { type GetServerSideProps } from 'next';
import React from 'react'
import Dashboard  from '@ui/dashboard';
import { trpc } from '@utils/trpc';
import BigTitle from '@ui/components/bigTitle';
import type { TableType } from '@ui/components/table';
import MyTable,{ActionTable} from '@ui/components/table';
import type { Brand, User } from '@prisma/client';
import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import toast from 'react-hot-toast';
import { SwitcherData } from '.';
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
 const Brands = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {data:brands,isLoading,refetch}=trpc.admin.getBrand.useQuery()
  
  const columns:ColumnsType<Brand>=[
    {
        title: "Id",
        width:"50px",
        dataIndex: "id",
        key: "id",
        render: (v) => <span className="italic text-primary text-[12px]">#{v}</span>,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (v) => <h6>{v}</h6>,
      }, 
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
       
      }, 
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
       
      }, 
      {
        title: "Models",
        dataIndex: "models",
        key: "models",
        align:"right",
        render: (v) => <Tag>{v.length}</Tag>,
       
      }, 
      {
        title: "Actions",
  
        dataIndex: "actions",
        key: "actions",
        align: "center",
        fixed:"right",
        render: (_,user) => <ActionTable id={user.id.toString()} onDelete={()=>{
        
        }} onEdit={()=>{console.log('edit')}} onView={()=>{console.log('view')}}/>,
      },
    ]
  return (
      <Dashboard type="ADMIN">
        <SwitcherData/>
       
      <div className="flex flex-col mt-6">

        <MyTable
          loading={isLoading}
          data={brands || []}
         // xScroll={1000}
         
          columns={columns as ColumnsType<TableType>}
         // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
      </Dashboard>
  )
}

export default Brands