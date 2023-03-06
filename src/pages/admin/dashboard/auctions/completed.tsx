/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { ColumnsType } from "antd/es/table";
import { Auction, Bid } from "@prisma/client";
import { TAuction } from "@model/type";
import BigTitle from "@ui/components/bigTitle";
import Price from "@ui/components/price";
import App from "antd";
import MyTable, {
  renderDate,
  RenderTimer,
  ActionTable,
  TableType,
} from "@ui/components/table";
import { AuctionIcon, CheckIcon, PauseIcon, WinIcon } from "@ui/icons";
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

const Completed = () => {
  const {
    data: auctions,
    isLoading,
    refetch,
  } = trpc.auctionnaire.getCompleted.useQuery();
  const {reload}=useAdminDashboardStore(state=>state)
  const { mutate: cancelWinner } = trpc.auctionnaire.cancelWinner.useMutation({
    onMutate: () => {
      toast.loading("In process");
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Faild to cancel");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success");
      refetch();
      reload()
    },
  });
  const columns: ColumnsType<Auction> = [
    {
      title: "Name",

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
      title: "Completed At",

      dataIndex: "closedAt",
      key: "createAt",
      width: "100px",
      align: "center",
      render: (v, a) => (
        <div className="flex flex-row items-center">
          {renderDate(v, "DD/MM/YYYY HH:mm:ss")}
          <LogAuction id={a.id} />
        </div>
      ),
    },

    {
      title: "Starting Price",
      dataIndex: "starting_price",
      align: "right",
      key: "starting_price",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
    },

    {
      title: "Value",
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
      title: "Commission",
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
      title: "Bidder",

      // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "bid",
      key: "bid",
      render: (_, v) => (
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
      ),
    },
    {
      title: "Actions",

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
              tooltip: "Cancel winner",
              onClick: () => {
                console.log("make winner");
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
        <BigTitle title="Management of auctions" />
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
