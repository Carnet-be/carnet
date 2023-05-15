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
import { CheckIcon, XIcon } from "@ui/icons";
import cx from "classnames";
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
const Bidders = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const {
    data: auctioneers,
    isLoading,
    refetch,
  } = trpc.admin.getUsers.useQuery({ type: "BID" });
  const { text: common } = useLang(undefined);
  const { text } = useLang({
    file: "dashboard",
    selector: "admin",
  });
  const tab = (s: string) => common(`table.${s}`);
  const { loading, error, succes } = useNotif();
  const { mutate: deleteUser } = trpc.global.deleteUser.useMutation({
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
  const { mutate: setUserStatus } = trpc.admin.statusUser.useMutation({
    onMutate: () => {
      loading();
    },
    onError: (err, da) => {
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
      title: tab("username"),
      dataIndex: "username",
      key: "username",
      render: (v, u) => (
        <div className="flex flex-col">
          <h6>{v}</h6>
          <span className="text-[12px] italic text-primary">#{u.id}</span>
        </div>
      ),
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
      title: tab("bids"),
      dataIndex: "bids",
      key: "bids",
      align: "center",
      render: (v) => <Tag>{v.length}</Tag>,
    },
    {
      title: tab("active"),
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (v, b) => (
        <input
          onChange={(e) =>
            setUserStatus({ isActive: e.target.checked, user_id: b.id })
          }
          type="checkbox"
          className="toggle-primary toggle toggle-md"
          checked={v}
        />
      ),
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
            deleteUser(user.id);
          }}
          // onEdit={() => {
          //   console.log("edit");
          // }}
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

export default Bidders;
