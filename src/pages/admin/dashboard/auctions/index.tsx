/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { ColumnsType } from "antd/es/table";
import { Auction, AuctionState, Bid } from "@prisma/client";
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
import LogAuction from "@ui/components/logAuction";
import {
  useAdminDashboardStore,
  useAuctionCountStore,
} from "../../../../state";
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
    redirect: {
      destination: "/admin/dashboard/auctions/published",
      permanent: true,
    },
  };
};
const Auctions = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <div>Users</div>;
};

export default Auctions;

export const SwitcherAuctions = () => {
  const { text } = useLang({
    file: "dashboard",
    selector: "auction",
  });
  const data = useAuctionCountStore((state) => state.data);
  const router = useRouter();
  const routers = [
    {
      title: text("status.published"),
      value: "published",
      route: "/admin/dashboard/auctions/published",
    },
    {
      title: text("status.pending"),
      value: "pending",
      route: "/admin/dashboard/auctions/pending",
    },
    {
      title: text("status.paused"),
      value: "pause",
      route: "/admin/dashboard/auctions/pause",
    },
    {
      title: text("status.confirmation"),
      value: "confirmation",
      route: "/admin/dashboard/auctions/confirmation",
    },
    {
      title: text("status.completed"),
      value: "completed",
      route: "/admin/dashboard/auctions/completed",
    },
  ];

  return (
    <div className="tabs tabs-boxed my-4 gap-4 px-3 py-1">
      {routers.map((r, i) => {
        const isActive = router.pathname == r.route;
        return (
          <Link
            key={i}
            href={r.route}
            className={cx("tab flex flex-row items-center gap-3 no-underline", {
              "tab-active": isActive,
            })}
          >
            {r.title}
            <span
              className={cx(
                "rounded-full px-2 text-[11px] font-bold",
                isActive
                  ? "bg-white text-primary"
                  : "bg-primary text-white opacity-80"
              )}
            >
              {data[r.value as AuctionState]}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export const AuctionsPage = ({
  state,
}: {
  state: "published" | "pending" | "pause";
}) => {
  const { loading, error, succes } = useNotif();
  const count = useAuctionCountStore((state) => state.increase);
  const { text: common } = useLang(undefined);
  const tab = (s: string) => common(`table.${s}`);
  const { text } = useLang({
    file: "dashboard",
    selector: "admin",
  });
  const {
    data: auctions,
    isLoading,
    refetch,
  } = trpc.auctionnaire.getAuctions.useQuery({
    filter: "all",
    state,
  });
  const { mutate: makeWinner } = trpc.auctionnaire.makeWinner.useMutation({
    onMutate: () => {
      loading();
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      error();
    },
    onSuccess: () => {
      toast.dismiss();
      count(state, "completed");
      succes();
      refetch();
    },
  });
  const { data: bids, isLoading: isLoadingBids } =
    trpc.auctionnaire.getBids.useQuery({
      filter: "all",
    });
  const { mutate: deleteAuction } = trpc.global.delete.useMutation({
    onMutate: () => {
      loading();
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      error();
    },
    onSuccess: () => {
      toast.dismiss();
      succes();
      count(state);
      refetch();
    },
  });
  const expandedColumns = (record: Auction) => {
    const columns: ColumnsType<Bid> = [
      {
        title: tab("numero"),
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
        width: "150px",
        dataIndex: "createAt",
        key: "createAt",
        align: "center",
        render: (v) => renderDate(v, "DD/MM/YYYY HH:mm:ss"),
      },
      {
        title: tab("bidder"),

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
        title: tab("value"),
        dataIndex: "montant",

        key: "montant",
        render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
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
              // onDelete={state=="published"?undefined: () => {
              //   deleteAuction({ id: auction.id, table: "auction" });
              // }}
              // onEdit={state=="published"?undefined: () => {
              //   console.log("edit");
              // }}
              onCustom={
                state != "published"
                  ? undefined
                  : () => ({
                      icon: <WinIcon className="text-lg text-yellow-500" />,
                      tooltip: common("text.make winner"),
                      onClick: () => {
                        console.log("make winner");
                        makeWinner({
                          auction_id: auction.auction_id,
                          bid_id: auction.id,
                        });
                      },
                    })
              }
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
  const { mutate: pauseAuction } = trpc.auctionnaire.pauseAuction.useMutation({
    onMutate: () => {
      loading();
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      error();
    },
    onSuccess: () => {
      toast.dismiss();
      count(state, "pause");
      succes();
      refetch();
    },
  });
  const { mutate: addTime } = trpc.auctionnaire.addTime.useMutation({
    onMutate: () => {
      loading();
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      error();
    },
    onSuccess: () => {
      toast.dismiss();
      succes();
      refetch();
    },
  });

  const { mutate: resume } = trpc.auctionnaire.resume.useMutation({
    onMutate: () => {
      loading();
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      error();
    },
    onSuccess: () => {
      toast.dismiss();
      count(state, "published");
      succes();
      refetch();
    },
  });
  const afterPublish = (first: AuctionState, second: AuctionState) => {
    if (first == "pending" && second == "published") {
      count("pending", "published");
    }
  };
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
      title: tab("date pub"),

      dataIndex: "createAt",
      key: "createAt",
      width: "100px",
      align: "center",
      render: (v) => (
        <div>
          {renderDate(v, "DD/MM/YYYY")}
          <span className="flex gap-1"> at: {renderDate(v, "HH:mm:ss")}</span>
        </div>
      ),
    },

    {
      title: tab("bids"),
      dataIndex: "bids",
      align: "right",
      key: "bids",
      className: state === "pending" ? "hidden" : "",
      width: "70px",
      render: (v) => (
        <div className="flex flex-row items-center justify-end gap-1 text-sm text-primary">
          {v.length}
          <AuctionIcon />
        </div>
      ),
    },
    {
      title: tab("expected price"),
      dataIndex: "expected_price",
      align: "right",
      key: "expected_price",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
    },
    {
      title: tab("latest bid"),
      dataIndex: "latest_bid",
      className: state === "pending" ? "hidden" : "",
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
      title: tab("time left"),
      width: "130px",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",

      render: (v, a) =>
        state != "pending" ? (
          <div className="flex flex-row items-center">
            <RenderTimer
              onAddTime={(type, time) => {
                const end_date = moment(a.end_date)
                  .add(type, "days")
                  .add(time, "hours");
                addTime({
                  auction_id: a.id,
                  time: end_date.toDate(),
                });
                console.log("add time");
              }}
              date={v}
              state={state}
              init={
                state === "published" ? undefined : a.pause_date || undefined
              }
            />
            <LogAuction id={a.id} />
          </div>
        ) : (
          <RenderTimer
            date={v}
            state={state}
            init={a.pause_date || undefined}
          />
        ),
    },
    {
      title: tab("auctioneer"),

      // className: "w-[150px] text-[12px] lg:w-[240px] lg:text-base",
      dataIndex: "auctionnaire",
      key: "auctionnaire",
      className: state !== "pending" ? "hidden" : "",
      render: (a, v) => (
        <div className="flex flex-row gap-1">
          <Tooltip
            title="Contact"
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
      title: tab("actions"),

      dataIndex: "actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (v, auction) => (
        <>
          <ActionTable
            id={auction.id}
            onDelete={
              state == "published"
                ? undefined
                : () => {
                    deleteAuction({ id: auction.id, table: "auction" });
                  }
            }
            onEdit={
              state == "published"
                ? undefined
                : () => {
                    console.log("edit");
                  }
            }
            onCustom={
              state != "published"
                ? undefined
                : () => ({
                    icon: <PauseIcon className="text-lg" />,
                    tooltip: "Pause",
                    onClick: () => {
                      console.log("pause");
                      pauseAuction(auction.id);
                    },
                  })
            }
            onView={
              state != "published"
                ? undefined
                : () => {
                    router.push(`/admin/auction/${auction.id}`);
                  }
            }
            onPlay={
              state != "pause"
                ? undefined
                : () => {
                    resume({
                      id: auction.id,
                      end_date: auction.end_date || new Date(),
                      pause_date: auction.pause_date || new Date(),
                    });
                  }
            }
          />
        </>
      ),
    },
  ];

  const router = useRouter();

  return (
    <>
      <Dashboard type="ADMIN">
        {auctions?.map((auc, i) => (
          <CreateAuction
            isAdmin
            key={i}
            auction={auc as any}
            isEdit={true}
            id={auc.id}
            refetch={refetch}
            afterPublish={afterPublish}
          />
        ))}
        <BigTitle title={text("text.auction page title")} />
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
