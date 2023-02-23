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
import { CheckIcon } from "@ui/icons";
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
    props: {},
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
  const { mutate: deleteUser } = trpc.global.delete.useMutation({
    onMutate: () => {
      toast.loading("In process");
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Faild to delete");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success");
      refetch();
    },
  });
  const { mutate: setUserStatus } = trpc.admin.statusUser.useMutation({
    onMutate: () => {
      toast.loading("In process");
    },
    onError: (err, da) => {
      console.log(err);
      toast.dismiss();
      toast.error("Faild to " + (da.isActive ? "activate" : "deactivate"));
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success");
      refetch();
    },
  });

  const columns: ColumnsType<User> = [
  
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (v,u) => <div className="flex flex-col">
        <h6>{v}</h6>
        <span className="text-[12px] italic text-primary">#{u.id}</span>
      
      </div>,
    },
    {
      title: "Phone",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (v, b) => (
        <div className="flex flex-row items-center gap-2">
          <span className="text-[12px]">{v}</span>
          <CheckIcon
            className={cx(
              "text-lg text-primary",
              b.emailVerified ? "" : "hidden"
            )}
          />{" "}
        </div>
      ),
    },
    {
      title: "Bids",
      dataIndex: "bids",
      key: "bids",
      align: "center",
      render: (v) => <Tag>{v.length}</Tag>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (v, b) => (
        <input
          onChange={(e) =>
            setUserStatus({ isActive: e.target.checked, user_id: b.id })
          }
          type="checkbox"
          className="toggle toggle-md toggle-primary"
          checked={v}
        />
      ),
    },
    {
      title: "Actions",

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
          onEdit={() => {
            console.log("edit");
          }}
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
