/* eslint-disable @typescript-eslint/no-explicit-any */
import Dashboard from "@ui/dashboard";
import React, { useState } from "react";

import type { TableType } from "@ui/components/table";
import MyTable, { ActionTable, renderDate, RenderTimer } from "@ui/components/table";
import { trpc } from "@utils/trpc";
import type { TAuction } from "@model/type";
import { AuctionIcon, CheckIcon, DeleteIcon, ViewIcon } from "@ui/icons";
import Price from "@ui/components/price";
import { Button, Tag, Tooltip } from "antd";
import { EditIcon } from '../../../ui/icons';
import BigTitle from "@ui/components/bigTitle"
import type { ColumnsType } from "antd/es/table";
import type { Auction } from "@prisma/client";
import { useRouter } from "next/router";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps } from "next";
import Link from "next/link";
import cx from "classnames"
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
if(!ctx.query.type){
  return {
    redirect: {
      destination: "/admin/dashboard/auctions?type=published",
      permanent: true,
    },
  };
}
return {
  props: {},
};
};
const Auctions = () => {
  const { data: auctions, isLoading } = trpc.auctionnaire.getAuctions.useQuery({
    filter: "all",
  });
const columns:ColumnsType<Auction>=[
    {
        title: "Id",
        width:"100px",
        dataIndex: "id",
        key: "id",
        render: (v) => <span className="italic text-primary text-[12px]">#{v}</span>,
      },
      {
        title: "Date pub",
  
        dataIndex: "createAt",
        key: "createAt",
        align: "center",
        render: (v) => renderDate(v),
      },
    {
      title: "Name",
     
      className:"w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Bids",
      dataIndex: "bids",
      align: "right",
      key: "bids",
     width:"70px",
      render: (v) => (
        <div className="flex flex-row items-center justify-end gap-1 text-sm text-primary">
          {v.length}
          <AuctionIcon />
        </div>
      ),
    },
    {
      title: "Expected Price",
      dataIndex: "expected_price",
      align: "right",
      key: "expected_price",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
    },
    {
      title: "Latest Bid",
      dataIndex: "latest_bid",
      align: "right",
      key: "latest_bid",
      render: (v, auction) => {
        const { bids } = auction as TAuction;

        return bids.length <= 0 ? (
          "--"
        ) : (
          <Price
            value={bids[bids.length - 1]?.montant || 0}
            textStyle="text-sm leading-4"
          />
        );
      },
    },
    {
      title: "Time Left",

      dataIndex: "end_date",
      key: "end_date",
      align: "center",
      
      render: (v) => <RenderTimer date={v} />,
    },
    {
      title: "Publish",
      dataIndex: "publish",
      align: "center",
      key: "publish",
      render: (v) => (
        <Tag
          icon={<CheckIcon />}
          color="#55acee"
          className="flex flex-row items-center justify-center gap-1 px-1"
        >
          published
        </Tag>
      ),
    },
    {
      title: "Actions",

      dataIndex: "actions",
      key: "actions",
      align: "center",
      fixed:"right",
      render: (v) => <ActionTable onDelete={()=>{console.log('delete')}} onEdit={()=>{console.log('edit')}} onView={()=>{console.log('view')}}/>,
    },
  ]
  const [options, setoptions] = useState(columns.map((c)=>c.key))
   const router=useRouter()
  return (
    <Dashboard type="ADMIN">
         <BigTitle title="Management of auctions"/>
         <div className="tabs tabs-boxed px-3 py-1 gap-4">
    {["published","pending"].map((r,i)=>{
      const isActive=router.query.type==r
      return <button key={i} onClick={()=>router.push("/admin/dashboard/auctions?type="+r,undefined,{shallow:true})} className={cx("tab no-underline",{"tab-active":isActive})}>{r}</button>
    })}

</div>
      <div className="flex flex-col items-end mt-6">
      {/* <Select
      mode="multiple"
      allowClear
     className="min-w-[300px]"
      placeholder="Please select"
      defaultValue={options}
      onChange={(value: string[]) => {
      setoptions(value)

      }}
      
      options={columns.map((c)=>({label:c.title,value:c.key}))}
    /> */}
        <MyTable
          loading={isLoading}
          data={auctions || []}
           options={{scroll:{x:1400}}}
          columns={columns as ColumnsType<TableType>}
         // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
    </Dashboard>
  );
};

export default Auctions;
