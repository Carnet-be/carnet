/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWindowHeight } from "@react-hook/window-size";
import Dashboard from "@ui/dashboard";
import React, { useState } from "react";
import { Table, Pagination } from "rsuite";
import Users from "../../../../mocks/users.json";
import { useEffect } from "react";
import MyTable, { renderDate, RenderTimer } from "@ui/components/table";
import { trpc } from "@utils/trpc";
import { TAuction } from "@model/type";
import { AuctionIcon, CheckIcon, DeleteIcon, ViewIcon } from "@ui/icons";
import Price from "@ui/components/price";
import { Button, Divider, Select, Tag, Tooltip } from "antd";
import { EditIcon } from '../../../ui/icons';
import BigTitle from "@ui/components/bigTitle"
import { ColumnsType } from "antd/es/table";
import { Auction } from "@prisma/client";
const { Column, HeaderCell, Cell } = Table;
const defaultData = Users;

const Auctions = () => {
  const { data: auctions, isLoading } = trpc.auctionnaire.getAuctions.useQuery({
    filter: "all",
  });
const columns:ColumnsType<Auction>=[
    {
      title: "Name",
     
      className:"w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date pub",

      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      render: (v) => renderDate(v),
    },
    {
      title: "Status",
      align: "center",
      dataIndex: "status",
      key: "status",
      render: (v, auction) =>
        !v && (
          <span className="text-green-700 text-sm italic">Opened</span>
        ),
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
          columns={columns}
         // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
    </Dashboard>
  );
};

export default Auctions;
