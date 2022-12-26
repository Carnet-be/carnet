/* eslint-disable @typescript-eslint/no-explicit-any */
import Dashboard from "@ui/dashboard";
import React, { useState } from "react";

import MyTable, { renderDate, RenderTimer, TableType } from "@ui/components/table";
import { trpc } from "@utils/trpc";
import type { TAuction } from "@model/type";
import { AuctionIcon, CheckIcon, DeleteIcon, ViewIcon } from "@ui/icons";
import Price from "@ui/components/price";
import { Button, Tag, Tooltip } from "antd";
import { EditIcon } from '../../../ui/icons';
import BigTitle from "@ui/components/bigTitle"
import type { ColumnsType } from "antd/es/table";
import type { Auction } from "@prisma/client";
import { Bid } from '@prisma/client';


const Auctions = () => {
  const { data: bids, isLoading } = trpc.auctionnaire.getBids.useQuery({
    filter: "all",
  });
const columns:ColumnsType<Bid>=[
    {
        title: "Id",
        width:"150px",
        dataIndex: "id",
        key: "id",
        render: (v) => <span className="italic text-primary text-[12px]">#{v}</span>,
      },
      {
        title: "Bidder",

  
        dataIndex: "bidder",
        key: "bidder",
        render: (_,v) => <div>
            <h6>{(v as any).bidder.username}</h6>
            <span className="italic text-primary text-[12px]">#{(v as any).bidder.id}</span>
        </div>,
      },
    {
      title: "Auction's id",
     
      width:"150px",

      dataIndex: "name",
      key: "name",
      render: (_,v) => <span className="italic text-green-500 text-[12px]">#{(v as any).auction.id}</span>,
    },
    {
      title: "Date",

      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      render: (v) => renderDate(v),
    },
    
    {
      title: "Value",
      dataIndex: "montant",
      align: "right",
      key: "montant",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
    },
    
    {
      title: "Actions",

      dataIndex: "actions",
      key: "actions",
      align: "center",
      fixed:"right",
      render: (v) => (
        <div className="flex flex-row items-center justify-center gap-1">
          <Tooltip title="View" className="flex flex-row items-center justify-center">
            <Button shape="circle" icon={<ViewIcon className="text-lg"/>} />
          </Tooltip>
     
          <Tooltip title="Edit" className="flex flex-row items-center justify-center text-primary">
            <Button shape="circle" icon={<EditIcon className="text-lg"/>} />
          </Tooltip>
       
          <Tooltip title="Delete" className="flex flex-row items-center justify-center text-red-500">
            <Button shape="circle" icon={<DeleteIcon className="text-lg"/>} />
          </Tooltip>
        
        </div>
      ),
    },
  ]
  const [options, setoptions] = useState(columns.map((c)=>c.key))
 
  return (
    <Dashboard type="ADMIN">
         <BigTitle title="Management of auctions"/>
      <div className="flex flex-col">
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
          data={bids || []}
         // xScroll={1000}
         
          columns={columns as ColumnsType<TableType>}
         // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
    </Dashboard>
  );
};

export default Auctions;
