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
      destination: "/admin/dashboard/data/brands",
      permanent: true,
    },
  };
};
const Data = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <div>Data</div>;
};

export default Data;

export const SwitcherData = () => {
  const common = useContext(LangCommonContext);
  const router = useRouter();
  const routers = [
    {
      title: common("table.brand"),
      route: "/admin/dashboard/data/brands",
    },
    {
      title: common("table.model"),
      route: "/admin/dashboard/data/models",
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
