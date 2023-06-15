/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import type { InferGetServerSidePropsType } from "next";
import { type GetServerSideProps } from "next";
import React, { useContext, useState } from "react";
import Dashboard from "@ui/dashboard";
import { Switcher } from ".";
import { trpc } from "@utils/trpc";
import BigTitle from "@ui/components/bigTitle";
import type { TableType } from "@ui/components/table";
import MyTable, { ActionTable } from "@ui/components/table";
import type { User } from "@prisma/client";
import type { ColumnsType } from "antd/es/table";
import { Button, Divider, Modal, Tag } from "antd";
import toast from "react-hot-toast";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangCommonContext, useLang, useNotif } from "../../../hooks";
import { CheckIcon, XIcon } from "@ui/icons";
import cx from "classnames";
import { isPro } from "@utils/utilities";
import { BadgePro } from "@ui/components/badgeType";
import { RiVipCrownFill } from "react-icons/ri";
import Price from "@ui/components/price";
import { AMOUNT } from "@ui/paymentDialog";
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
const Auctioneers = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const {
    data: auctioneers,
    isLoading,
    refetch,
  } = trpc.admin.getUsers.useQuery({ type: "AUC" });
  const { loading, error, succes } = useNotif();
  const { text: common } = useLang(undefined);
  const { text } = useLang({
    file: "dashboard",
    selector: "admin",
  });
  const [dialogProId, setDialogProId] = React.useState<string | undefined>(
    undefined
  );
  const tab = (s: string) => common(`table.${s}`);
  const { mutate: deleteUser } = trpc.global.delete.useMutation({
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

  const { mutate: cancelPro } = trpc.user.downgradeToPro.useMutation({
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
  const columns: ColumnsType<User> = [
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
      title: tab("username"),
      dataIndex: "username",
      key: "username",
      render: (v) => <h6>{v}</h6>,
    },
    {
      title: tab("tel"),
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: tab("email"),
      dataIndex: "email",
      key: "email",
      render: (v, b) => (
        <div className="flex flex-row items-center gap-2">
          <span className="text-[12px]">{v}</span>
          {!b.emailVerified ? (
            <XIcon className={cx("text-lg text-red-500")} />
          ) : (
            <CheckIcon className={cx("text-lg text-primary")} />
          )}
        </div>
      ),
    },
    {
      title: tab("type"),
      dataIndex: " activations_pro",
      key: " activations_pro",
      align: "center",
      render: (v, a) =>
        isPro((a as any).activations_pro) ? (
          <div className="mx-auto w-[40px]">
            <BadgePro />
          </div>
        ) : (
          <></>
        ),
    },
    // {
    //   title: tab("expired at"),
    //   dataIndex: " activations_pro",
    //   key: " activations_pro",
    //   align: "center",
    //   render: (v, a) =>
    //     isPro((a as any).activations_pro) ? (
    //       <div className="mx-auto w-[40px]">
    //         <BadgePro />
    //       </div>
    //     ) : (
    //       <></>
    //     ),
    // },
    {
      title: tab("auctions"),
      dataIndex: "auctions",
      key: "auctions",
      align: "right",
      render: (v) => <Tag>{v.length}</Tag>,
    },
    {
      title: tab("actions"),

      dataIndex: "actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, user) => (
        <ActionTable
          id={user.id}
          onDelete={() => {
            deleteUser({ id: user.id, table: "user" });
          }}
          onCustom={
            isPro((user as any).activations_pro)
              ? () => ({
                  icon: <XIcon className="text-lg text-red-500" />,
                  tooltip: common("text.cancel pro"),
                  onClick: () => {
                    cancelPro(user.id);
                  },
                })
              : () => ({
                  icon: (
                    <span className="text-[9px] font-extrabold text-yellow-900">
                      pro
                    </span>
                  ),
                  tooltip: common("text.upgrade to pro"),
                  onClick: () => {
                    setDialogProId(user.id);
                  },
                })
          }

          //onEdit={()=>{console.log('edit')}} onView={()=>{console.log('view')}}
        />
      ),
    },
  ];

  return (
    <Dashboard type="ADMIN">
      <UpgradeToPro
        refetch={() => refetch()}
        id={dialogProId}
        setId={(t) => setDialogProId(t)}
      />
      <Switcher />

      <div className="mt-6 flex flex-col">
        <MyTable
          loading={isLoading}
          data={auctioneers || []}
          // xScroll={1000}

          columns={columns as ColumnsType<TableType>}
          // columns={columns.filter((c)=>options.includes(c.key))}
        />
      </div>
    </Dashboard>
  );
};

export default Auctioneers;

const UpgradeToPro = ({
  id,
  setId,
  refetch,
}: {
  id: string | undefined;
  setId: (t: string | undefined) => void;
  refetch: () => void;
}) => {
  const { loading, error, succes } = useNotif();
  const { mutate: toPro } = trpc.user.upgradeToPro.useMutation({
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
  const handleOk = () => {
    if (!id) return;
    toPro({
      unit: AMOUNT,
      cycle: months,
      user_id: id,
    });
    setId(undefined);
  };

  const handleCancel = () => {
    setId(undefined);
  };
  const common = useContext(LangCommonContext);

  const [months, setMonths] = useState(1);
  return (
    <>
      <Modal
        title={common("payment.dialog title")}
        open={id !== undefined}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{common("payment.dialog description admin")}</p>
        <div className="my-6 rounded bg-background p-6">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h6>Add Months</h6>
              <span>
                {common("payment.each month is")}{" "}
                <Price value={AMOUNT} textStyle="font-bold" />
              </span>
            </div>
            <div className="flex flex-row items-center gap-1 overflow-hidden rounded border">
              <button
                onClick={() => {
                  if (months > 1) setMonths(months - 1);
                }}
                className="btn-ghost btn-sm btn rounded-none"
              >
                -
              </button>
              <span className="px-3">{months}</span>
              <button
                onClick={() => {
                  setMonths(months + 1);
                }}
                className="btn-ghost btn-sm btn rounded-none"
              >
                +
              </button>
            </div>
          </div>
          <Divider />
          <div className="flex flex-row items-center justify-between text-primary">
            <h6>{common("payment.total")}</h6>
            <Price value={months * AMOUNT} textStyle="font-bold" />
          </div>
        </div>
      </Modal>
    </>
  );
};
