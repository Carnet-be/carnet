import { getServerAuthSession } from "@server/common/get-server-auth-session";
import type { InferGetServerSidePropsType } from "next";
import { type GetServerSideProps } from "next";
import React, { useContext } from "react";
import cx from "classnames";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { LangCommonContext } from "../../../hooks";
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
      destination: "/admin/dashboard/users/pro",
      permanent: true,
    },
  };
};
const Users = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <div>Users</div>;
};

export default Users;

export const Switcher = () => {
  const router = useRouter();
  const commmon = useContext(LangCommonContext);
  const routers = [
    {
      title: commmon("text.auctioneers"),
      route: "/admin/dashboard/users/pro",
    },
    {
      title: commmon("text.bidders"),
      route: "/admin/dashboard/users/normal",
    },
  ];
  return (
    <div className="tabs tabs-boxed gap-4 px-3 py-1">
      {routers.map((r, i) => {
        const isActive = router.pathname == r.route;
        return (
          <Link
            key={i}
            href={r.route}
            className={cx("tab no-underline", { "tab-active": isActive })}
          >
            {r.title}
          </Link>
        );
      })}
    </div>
  );
};
