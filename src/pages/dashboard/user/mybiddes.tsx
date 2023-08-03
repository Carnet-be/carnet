/* eslint-disable @typescript-eslint/no-explicit-any */
import Dashboard from "@ui/dashboard";
import React, { useState } from "react";

import type {
  TableType} from "@ui/components/table";
import MyTable, {
  renderDate,
  RenderTimer
} from "@ui/components/table";
import { trpc } from "@utils/trpc";
import type { TAuction } from "@model/type";
import { AuctionIcon, CheckIcon, DeleteIcon, ViewIcon } from "@ui/icons";
import Price from "@ui/components/price";
import { Button, Tag, Tooltip } from "antd";
import { EditIcon } from "../../../ui/icons";
import BigTitle from "@ui/components/bigTitle";
import type { ColumnsType } from "antd/es/table";
import type { Auction } from "@prisma/client";
import type { Bid } from "@prisma/client";
import Link from "next/link";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLang } from "../../hooks";

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
    props: {
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};

const Auctions = () => {
  const { text } = useLang({ file: "dashboard", selector: "auction" });
  const { text: common } = useLang(undefined);
  const tab = (v: string) => common("table." + v);
  const { data: bids, isLoading } = trpc.auctionnaire.getBids.useQuery({
    filter: "mine",
  });
  const columns: ColumnsType<Bid> = [
    {
      title: tab("id"),
      width: "150px",
      dataIndex: "id",
      key: "id",
      render: (v) => (
        <span className="text-[12px] italic text-primary">#{v}</span>
      ),
    },
    {
      title: tab("date"),

      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      render: (v) => renderDate(v),
    },
    {
      title: tab("numero"),
      dataIndex: "numero",
      key: "numero",
      align: "right",
      render: (v) => <Tag>2</Tag>,
    },
    // {
    //   title: "Bidder",

    //   dataIndex: "bidder",
    //   key: "bidder",
    //   render: (_,v) => <div>
    //       <h6>{(v as any).bidder.username}</h6>
    //       <span className="italic text-primary text-[12px]">#{(v as any).bidder.id}</span>
    //   </div>,
    // },
    {
      title: tab("auction"),

      dataIndex: "name",
      key: "name",
      render: (_, v) => (
        <div className="flex flex-col gap-1">
          <Link href={"/dashboard/user/auction/" + (v as any).auction.id}>
            {(v as any).auction.name}
          </Link>
          <span className="text-[12px] italic text-blue-400">
            #{(v as any).auction.id}
          </span>
        </div>
      ),
    },

    {
      title: tab("value"),
      dataIndex: "montant",
      align: "right",
      key: "montant",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
    },
    {
      title: tab("time left"),

      dataIndex: "end_date",
      key: "end_date",
      align: "center",

      render: (_, v) => (
        <RenderTimer
          date={(v as any).auction.end_date}
          state={(v as any).state}
          init={(v as any).pause_date}
        />
      ),
    },
  ];

  return (
    <Dashboard type="BID">
      <BigTitle title={common("text.my bids")} />
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
