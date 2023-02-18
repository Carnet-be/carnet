import { getServerAuthSession } from '@server/common/get-server-auth-session';
import type { InferGetServerSidePropsType } from 'next';
import { type GetServerSideProps } from 'next';
import React from 'react'
import Dashboard  from '@ui/dashboard';

import { trpc } from '@utils/trpc';
import BigTitle from '@ui/components/bigTitle';
import type { TableType } from '@ui/components/table';
import MyTable,{ActionTable} from '@ui/components/table';
import type { User } from '@prisma/client';
import type { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { Switcher } from './users';
import { AddIcon } from '@ui/icons';
import { AddStaffDialog } from './staff';
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
    props: {},
  };
};
 const Staffs = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {data:auctioneers,isLoading,refetch}=trpc.admin.getUsers.useQuery({type:"STAFF"})
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
        title: "Actions",
  
        dataIndex: "actions",
        key: "actions",
        align: "center",
        fixed:"right",
        render: () => <ActionTable onDelete={()=>{console.log('delete')}} onEdit={()=>{console.log('edit')}} onView={()=>{console.log('view')}}/>,
      },
    ]
    const idAdd = "add";
  return (
      <Dashboard type="ADMIN">

      <div className="flex flex-col mt-6">
<div className='flex flex-row justify-end'>

    <label htmlFor={idAdd} className="btn-primary btn flex flex-row gap-2">
          <AddIcon className="icon" />
          Nouveau
        </label>
</div>
        <MyTable
          loading={isLoading}
          data={auctioneers || []}
         // xScroll={1000}
         
          columns={columns as ColumnsType<TableType>}
         // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
      <AddStaffDialog id={idAdd} refetch={refetch} />
      </Dashboard>
  )
}

export default Staffs