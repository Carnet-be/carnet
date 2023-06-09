import { User } from "@prisma/client";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import React from "react";

import { prisma } from "../../server/db/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLang } from "../hooks";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
  const user: User = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));
  if (!user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
  if (!user.emailVerified) {
    return {
      redirect: {
        destination: "/pages/email-verification",
        permanent: true,
      },
    };
  }
  let route;
  if (!user.isActive) {
    console.log("user is not active");
    return {
      props: {
        ...(await serverSideTranslations(ctx.locale || "en", ["pages"])),
      },
    };
  }
  switch (user.type) {
    case "AUC":
      route = "/dashboard/entreprise";
      break;
    case "BID":
      route = "/dashboard/user";

      break;
    default:
      route = "/admin/dashboard";
      break;
  }
  return {
    redirect: {
      destination: route,
      permanent: true,
    },
  };
};
const Inactive = () => {
  const router = useRouter();
  const { text } = useLang({
    file: "pages",
    selector: "inactive",
  });
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-10">
      <div className="h-[250px]">
        <img
          src="/assets/account_locked.svg"
          alt="inactive"
          className="h-full w-full"
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <h6>{text("title")}</h6>
        <button onClick={() => router.reload()} className="btn-sm btn">
          {text("button")}
        </button>
      </div>
    </div>
  );
};

export default Inactive;
