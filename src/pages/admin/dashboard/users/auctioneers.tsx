/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import type { InferGetServerSidePropsType } from "next";
import { type GetServerSideProps } from "next";
import React from "react";
import Dashboard from "@ui/dashboard";
import { Switcher } from ".";
import { trpc } from "@utils/trpc";
import BigTitle from "@ui/components/bigTitle";
import type { TableType } from "@ui/components/table";
import MyTable, { ActionTable } from "@ui/components/table";
import type { User } from "@prisma/client";
import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import toast from "react-hot-toast";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLang, useNotif } from "../../../hooks";
import { CheckIcon, XIcon } from "@ui/icons";
import cx from "classnames";
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
          //onEdit={()=>{console.log('edit')}} onView={()=>{console.log('view')}}
        />
      ),
    },
  ];
  return (
    <Dashboard type="ADMIN">
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
