/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { ColumnsType } from "antd/es/table";
import { Auction, Bid } from "@prisma/client";
import { TAuction, TUser } from "@model/type";
import BigTitle from "@ui/components/bigTitle";
import Price from "@ui/components/price";
import App, { Button, Tooltip } from "antd";
import MyTable, {
  renderDate,
  RenderTimer,
  ActionTable,
  TableType,
} from "@ui/components/table";
import {
  AuctionIcon,
  CheckIcon,
  EmailIcon,
  PauseIcon,
  WinIcon,
} from "@ui/icons";
import { trpc } from "@utils/trpc";
import { useState } from "react";

import { Tag } from "antd";
import Dashboard from "@ui/dashboard";
import CreateAuction from "@ui/createAuction";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { BiPause } from "react-icons/bi";
import moment from "moment";
import { SwitcherAuctions } from ".";
import { MdOutlineCancel } from "react-icons/md";
import LogAuction from "@ui/components/logAuction";
import { useAdminDashboardStore } from "../../../../state";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLang, useNotif } from "../../../hooks";
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

const Completed = () => {
  const { text: common } = useLang(undefined);
  const tab = (s: string) => common(`table.${s}`);
  const { text } = useLang({
    file: "dashboard",
    selector: "admin",
  });
  const { loading, succes, error } = useNotif();
  const {
    data: auctions,
    isLoading,
    refetch,
  } = trpc.auctionnaire.getCompleted.useQuery();
  const { reload } = useAdminDashboardStore((state) => state);
  const { mutate: cancelWinner } = trpc.auctionnaire.cancelWinner.useMutation({
    onError: (err) => {
      console.log(err);
      error();
    },
    onSuccess: () => {
      toast.dismiss();
      succes();
      refetch();
      reload();
    },
  });
  const columns: ColumnsType<Auction> = [
    {
      title: tab("name"),

      // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "name",
      key: "name",
      render: (v, record) => (
        <div>
          <h6 className="text-[12px] lg:text-base">{v}</h6>
          <span className="text-[12px] italic text-primary">#{record.id}</span>
        </div>
      ),
    },

    {
      title: tab("completed at"),

      dataIndex: "closedAt",
      key: "createAt",
      width: "100px",
      align: "center",
      render: (v, a) => (
        <div className="flex flex-row items-center">
          <div>
            {renderDate(v, "DD/MM/YYYY")}
            <div className="flex gap-1">
              at:
              {renderDate(v, "HH:mm:ss")}
            </div>
          </div>
          <LogAuction id={a.id} />
        </div>
      ),
    },

    {
      title: tab("starting price"),
      dataIndex: "starting_price",
      align: "right",
      key: "starting_price",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
    },

    {
      title: tab("value"),
      dataIndex: "value",
      align: "right",
      key: "value",
      render: (_, v) => (
        <Price
          value={(v as TAuction).bids.find((b) => b.winner == true)?.montant}
          textStyle="text-sm leading-4"
        />
      ),
    },
    {
      title: tab("commission"),
      dataIndex: "profit",
      align: "right",
      key: "profit",
      render: (_, v) => {
        const value = (v as TAuction).bids.find(
          (b) => b.winner == true
        )?.montant;
        const commission = (v as TAuction).commission;
        const profit = ((value || 0) * (commission || 0)) / 100;
        return (
          <div className="flex flex-col">
            <span className="font-bold">{commission}%</span>
            <Price value={profit} textStyle="text-sm leading-4" />
          </div>
        );
      },
    },
    {
      title: tab("auctioneer"),

      // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "auctionnaire",
      key: "auctionnaire",
      render: (a, v) => (
        <div className="flex flex-row gap-1">
          <Tooltip
            title={common("tooltip.contact")}
            className="flex flex-row items-center justify-center text-primary"
          >
            <Button shape="circle" icon={<EmailIcon className="text-lg" />} />
          </Tooltip>
          <div className="flex flex-col">
            <h6>{(a as TUser).username}</h6>

            <span className="text-[12px] italic text-primary">
              #{(a as TUser).id}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: tab("bidder"),

      // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "bid",
      key: "bid",
      render: (_, v) => (
        <div className="flex flex-row gap-1">
          <Tooltip
            title={common("tooltip.contact")}
            className="flex flex-row items-center justify-center text-primary"
          >
            <Button shape="circle" icon={<EmailIcon className="text-lg" />} />
          </Tooltip>
          <div className="flex flex-col">
            <h6>
              {
                (v as TAuction).bids.find((d) => d.winner == true)?.bidder
                  .username
              }
            </h6>
            <span className="text-[12px] italic text-primary">
              #{(v as TAuction).bids.find((d) => d.winner == true)?.bidder.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: tab("actions"),

      dataIndex: "actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (v, auction) => (
        <>
          <ActionTable
            id={auction.id}
            onCustom={() => ({
              icon: <MdOutlineCancel className="text-lg text-yellow-500" />,
              tooltip: common("tooltip.cancel winner"),
              onClick: () => {
                cancelWinner({
                  auction_id: auction.id,
                });
              },
            })}
          />
        </>
      ),
    },
    // {
    //   title: "Publish",
    //   dataIndex: "publish",
    //   align: "center",
    //   key: "publish",
    //   render: (v) => (
    //     <Tag
    //       icon={<CheckIcon />}
    //       color="#55acee"
    //       className="flex flex-row items-center justify-center gap-1 px-1"
    //     >
    //       published
    //     </Tag>
    //   ),
    // },
  ];

  return (
    <>
      <Dashboard type="ADMIN">
        <BigTitle title={text("text.auction page title")} />
        <SwitcherAuctions />
        <div className="mt-6 flex w-full flex-col items-end">
          <MyTable
            loading={isLoading}
            data={(auctions || []).map((auc) => ({ ...auc, key: auc.id }))}
            // options={{ scroll: { x: 1400 } }}
            columns={columns as ColumnsType<TableType>}
            // options={{ expandedRowRender: expandedColumns }}
          />
        </div>
      </Dashboard>
    </>
  );
};

export default Completed;
