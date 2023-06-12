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
import { useAdminDashboardStore, useAuctionCountStore } from "../../../state";
import { useLang, useNotif } from "../../hooks";
import CreateAuctionCar from "@ui/createAuction/car";
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
      destination: "/admin/dashboard/cars/published",
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

const SwitcherCars = () => {
  const { text } = useLang({
    file: "dashboard",
    selector: "auction",
  });
  const data = useAuctionCountStore((state) => state.buyNow);
  const router = useRouter();
  const routers = [
    {
      title: text("status.published"),
      value: "published",
      route: "/admin/dashboard/cars/published",
    },
    {
      title: text("status.pending"),
      value: "pending",
      route: "/admin/dashboard/cars/pending",
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
              {data[r.value as keyof typeof data]}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export const CarsPage = ({ state }: { state: "published" | "pending" }) => {
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
  } = trpc.auctionnaire.getCars.useQuery({
    filter: "all",
    state,
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
      title: tab("auctioneer"),

      dataIndex: "auctionnaire",
      key: "auctionnaire",
      render: (_, v) => (
        <div>
          <h6>{(v as any).auctionnaire.username}</h6>
          <span className="text-[12px] italic text-primary">
            #{(v as any).auctionnaire.id}
          </span>
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
      title: tab("price"),
      dataIndex: "price",
      align: "right",
      key: "price",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
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
            onEdit={() => {
              console.log("edit");
            }}
            onView={
              state != "published"
                ? undefined
                : () => {
                    router.push(`/admin/auction/${auction.id}`);
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
          <CreateAuctionCar
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
        <SwitcherCars />
        <div className="mt-6 flex w-full flex-col items-end">
          <MyTable
            loading={isLoading}
            data={(auctions || []).map((auc) => ({ ...auc, key: auc.id }))}
            // options={{ scroll: { x: 1400 } }}
            columns={columns as ColumnsType<TableType>}
          />
        </div>
      </Dashboard>
    </>
  );
};
