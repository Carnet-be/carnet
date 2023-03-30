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
import App, { InputNumber, Modal } from "antd";
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
import LogAuction from "@ui/components/logAuction";
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

const Confirmation = () => {
  const { text: common } = useLang(undefined);
  const tab = (s: string) => common(`table.${s}`);
  const { text } = useLang({
    file: "dashboard",
    selector: "admin",
  });
  const { loading, succes, error } = useNotif();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
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
    onError: (err) => {
      console.log(err);
      error();
    },
    onSuccess: () => {
      succes();
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
              onCustom={() => ({
                icon: <WinIcon className="text-lg text-yellow-500" />,
                tooltip: common("text.make winner"),
                onClick: () => {
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
    onError: (err) => {
      console.log(err);
      error();
    },
    onSuccess: () => {
      succes();
      refetch();
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
      title: tab("ended at"),

      dataIndex: "end_date",
      key: "end_date",
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
      title: tab("bids"),
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
      title: tab("expected price"),
      dataIndex: "expected_price",
      align: "right",
      key: "expected_price",
      render: (v) => <Price value={v} textStyle="text-sm leading-4" />,
    },

    {
      title: tab("lastest bid"),
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
            onRepublish={() => {
              setId(auction.id);
              setOpen(true);
            }}

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
      <GetTime
        onAddTime={(a, b) => {
          repubishAuction({
            auction_id: id || "",
            duration: moment().add(a, "days").add(b, "hours").toDate(),
          });
        }}
        isOpen={open && id !== undefined}
        setOpen={(b) => setOpen(b)}
      />
      <Dashboard type="ADMIN">
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

export default Confirmation;

export const GetTime = ({
  isOpen,
  setOpen,
  onAddTime,
}: {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  onAddTime: (value: number, hour: number) => void;
}) => {
  const { text: common } = useLang(undefined);
  const [value, setValue] = useState(0);
  const [hour, setHour] = useState(0);
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    onAddTime(value, hour);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title={common("text.add time")}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-row gap-4">
          <InputNumber
            addonAfter={"Day(s)"}
            defaultValue={0}
            value={value}
            onChange={(e) => setValue(e || 0)}
          />
          <InputNumber
            addonAfter={"Hour(s)"}
            defaultValue={0}
            value={hour}
            onChange={(e) => setHour(e || 0)}
          />
        </div>
      </Modal>
    </>
  );
};
