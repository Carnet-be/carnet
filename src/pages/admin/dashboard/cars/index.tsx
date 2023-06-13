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
import {
  useAdminDashboardStore,
  useAuctionCountStore,
} from "../../../../state";
import { useLang, useNotif } from "../../../hooks";
import CreateAuctionCar from "@ui/createAuction/car";
import SendMessageButton from "@ui/components/sendMessageButton";
import { MdOutlineCancel } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
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

export const SwitcherCars = () => {
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
    {
      title: text("status.confirmation"),
      value: "confirmation",
      route: "/admin/dashboard/cars/confirmation",
    },
    {
      title: text("status.sold"),
      value: "completed",
      route: "/admin/dashboard/cars/sold",
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

export const CarsPage = ({
  state,
}: {
  state: "published" | "pending" | "confirmation" | "completed";
}) => {
  const { loading, error, succes } = useNotif();
  const count = useAuctionCountStore((state) => state.increaseCar);
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

      refetch();
      count(state);
    },
  });

  const { mutate: cancel } = trpc.auctionnaire.cancelBuy.useMutation({
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
      count(state, "published");
    },
  });

  const { mutate: confirm } = trpc.auctionnaire.confirmBuy.useMutation({
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
      count(state, "completed");
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
      title: tab("seller"),

      dataIndex: "auctionnaire",
      key: "auctionnaire",
      render: (a, v) => (
        <div className="flex flex-row gap-1">
          {a && <SendMessageButton receiver={a.id} />}
          <div className="flex flex-col">
            <h6>{a.username}</h6>
            <span className="text-[12px] italic text-primary">#{a.id}</span>
          </div>
        </div>
        // <div>
        //   <h6>{(v as any).auctionnaire.username}</h6>
        //   <span className="text-[12px] italic text-primary">
        //     #{(v as any).auctionnaire.id}
        //   </span>
        // </div>
      ),
    },
    {
      title: tab("buyer"),

      dataIndex: "buyer",
      key: "buyer",
      className: !["confirmation", "completed"].includes(state)
        ? "hidden"
        : undefined,
      render: ["confirmation", "completed"].includes(state)
        ? (a, v) => (
            <div className="flex flex-row gap-1">
              {a && <SendMessageButton receiver={a.id} />}
              <div className="flex flex-col">
                <h6>{a.username}</h6>
                <span className="text-[12px] italic text-primary">#{a.id}</span>
              </div>
            </div>
            // <div>
            //   <h6>{(v as any).auctionnaire.username}</h6>
            //   <span className="text-[12px] italic text-primary">
            //     #{(v as any).auctionnaire.id}
            //   </span>
            // </div>
          )
        : undefined,
    },
    {
      title: tab("date pub"),

      dataIndex: "createAt",
      key: "createAt",
      width: "100px",
      align: "center",
      className: state === "confirmation" ? "hidden" : undefined,
      render: (v) => (
        <div>
          {renderDate(v, "DD/MM/YYYY")}
          {/* <span className="flex gap-1"> at: {renderDate(v, "HH:mm:ss")}</span> */}
        </div>
      ),
    },

    {
      title: tab("price"),
      dataIndex: "price",
      align: "right",
      width: "nowrap",
      key: "price",
      className: "font-bold whitespace-nowrap",
      render: (v) => <Price value={v} textStyle="leading-4 text-sm" />,
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
      className: state === "completed" ? "hidden" : undefined,
      render:
        state === "completed"
          ? undefined
          : (v, auction) => (
              <>
                <ActionTable
                  id={auction.id}
                  onDelete={
                    state === "confirmation"
                      ? undefined
                      : () => {
                          deleteAuction({ id: auction.id, table: "auction" });
                        }
                  }
                  onEdit={
                    state === "confirmation"
                      ? undefined
                      : () => {
                          console.log("edit");
                        }
                  }
                  onView={
                    state === "pending"
                      ? undefined
                      : () => {
                          router.push(`/admin/cars/${auction.id}`);
                        }
                  }
                  onCustom={
                    state !== "confirmation"
                      ? undefined
                      : () => ({
                          icon: (
                            <MdOutlineCancel className="text-lg text-yellow-500" />
                          ),
                          tooltip: common("button.cancel"),
                          onClick: () => {
                            cancel({
                              car_id: auction.id,
                            });
                          },
                        })
                  }
                  onCustom2={
                    state !== "confirmation"
                      ? undefined
                      : () => ({
                          icon: (
                            <BsCheckCircleFill className="text-lg text-blue-500" />
                          ),
                          tooltip: common("button.validate"),
                          onClick: () => {
                            confirm({
                              car_id: auction.id,
                            });
                          },
                        })
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