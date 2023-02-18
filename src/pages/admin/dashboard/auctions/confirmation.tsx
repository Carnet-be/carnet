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
import { MdRestartAlt } from "react-icons/md";
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

const Confirmation = () => {
  const {
    data: auctions,
    isLoading,
    refetch,
  } = trpc.auctionnaire.getNeedConfirmation.useQuery();
  const { data: bids, isLoading: isLoadingBids } =
    trpc.auctionnaire.getBids.useQuery({
      filter: "all",
    });

  const { mutate: makeWinner } = trpc.auctionnaire.makeWinner.useMutation({
    onMutate: () => {
      toast.loading("In process");
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Failed");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success");
      refetch();
    },
  });
  const expandedColumns = (record: Auction) => {
    const columns: ColumnsType<Bid> = [
      {
        title: "Numero",
        width: "80px",
        dataIndex: "numero",
        key: "numero",
        align: "center",
        render: (v) => (
          <div className="mx-auto flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary/60 text-white">
            <h6>{v}</h6>
          </div>
        ),
      },
      {
        title: "Id",
        width: "150px",
        dataIndex: "id",
        key: "id",
        render: (v) => (
          <span className="text-[12px] italic text-primary">#{v}</span>
        ),
      },
      {
        title: "Date",
        width: "150px",
        dataIndex: "createAt",
        key: "createAt",
        align: "center",
        render: (v) => renderDate(v, "DD/MM/YYYY HH:mm:ss"),
      },
      {
        title: "Bidder",

        dataIndex: "bidder",
        key: "bidder",
        render: (_, v) => (
          <div>
            <h6>{(v as any).bidder.username}</h6>
            <span className="text-[12px] italic text-primary">
              #{(v as any).bidder.id}
            </span>
          </div>
        ),
      },

      {
        title: "Value",
        dataIndex: "montant",

        key: "montant",
        render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
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
              // onDelete={state=="published"?undefined: () => {
              //   deleteAuction({ id: auction.id, table: "auction" });
              // }}
              // onEdit={state=="published"?undefined: () => {
              //   console.log("edit");
              // }}
              onCustom={() => ({
                icon: <WinIcon className="text-lg text-yellow-500" />,
                tooltip: "Make winner",
                onClick: () => {
                  console.log("make winner");
                  makeWinner({
                    auction_id: auction.auction_id,
                    bid_id: auction.id,
                  });
                },
              })}
              // onView={state!="published"?undefined:() => {
              //   console.log("view");
              // }}
            />
          </>
        ),
      },
    ];
    return (
      <MyTable
        loading={isLoadingBids}
        columns={columns as ColumnsType<TableType>}
        data={(bids || [])
          .map((b, i) => ({ ...b, key: b.auction_id }))
          .filter((f) => f.auction_id == record.id)}
        options={{ pagination: false }}
      />
    );
  };
  const { mutate: repubishAuction } = trpc.auctionnaire.relancer.useMutation({
    onMutate: () => {
      toast.loading("In process");
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Faild to republish");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success");
      refetch();
    },
  });
  const columns: ColumnsType<Auction> = [
    {
      title: "Id",
      width: "80px",
      dataIndex: "id",
      key: "id",
      render: (v) => (
        <span className="text-[12px] italic text-primary">#{v}</span>
      ),
    },

    {
      title: "Ended at",

      dataIndex: "end_date",
      key: "end_date",
      width: "100px",
      align: "center",
      render: (v) => renderDate(v, "DD/MM/YYYY HH:mm"),
    },
    {
      title: "Name",

      // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Bids",
      dataIndex: "bids",
      align: "right",
      key: "bids",
      width: "70px",
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
            // onDelete={state=="published"?undefined: () => {
            //   deleteAuction({ id: auction.id, table: "auction" });
            // }}
            // onEdit={state=="published"?undefined: () => {
            //   console.log("edit");
            // }}
            onCustom={() => ({
              icon: <MdRestartAlt className="text-lg text-primary" />,
              tooltip: "Republish",
              onClick: () => {
                repubishAuction({
                  auction_id: auction.id,
                  duration: auction.duration,
                });
              },
            })}
            // onView={state!="published"?undefined:() => {
            //   console.log("view");
            // }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      {auctions?.map((auc, i) => (
        <CreateAuction
          isAdmin
          key={i}
          auction={auc as TAuction}
          isEdit={true}
          id={auc.id}
          refetch={refetch}
        />
      ))}

      <Dashboard type="ADMIN">
        <BigTitle title="Management of auctions" />
        <SwitcherAuctions />
        <div className="mt-6 flex w-full flex-col items-end">
          <MyTable
            loading={isLoading}
            data={(auctions || []).map((auc) => ({ ...auc, key: auc.id }))}
            // options={{ scroll: { x: 1400 } }}
            columns={columns as ColumnsType<TableType>}
            options={{ expandedRowRender: expandedColumns }}
          />
        </div>
      </Dashboard>
    </>
  );
};

export default Confirmation;
