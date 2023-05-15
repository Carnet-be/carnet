import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps } from "next";
import { User } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect } from "react";
import { prisma } from "../../server/db/client";
import { Token } from "@prisma/client";
import { useLang, useNotif } from "../hooks";
import { TextField } from "@mui/material";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import Image from "next/image";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token_id = ctx.query.token as string;

  const token: Token | undefined = await prisma.token
    .findUnique({
      where: {
        id: token_id,
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  const isExpired = token ? new Date() > token.expireAt : true;
  const tokenId = token?.id || "";
  const notExist = !token;
  let isActivited = false;
  if (token && !isExpired) {
    await prisma.$transaction([
      prisma.token.delete({
        where: {
          id: token_id,
        },
      }),
      prisma.user.update({
        where: {
          id: token.user_id,
        },
        data: {
          emailVerified: true,
        },
      }),
    ]);

    isActivited = true;
  }

  return {
    props: {
      isExpired,
      notExist,
      isActivited,
      ...(await serverSideTranslations(ctx.locale || "en", ["pages"])),
    },
  };
};
const ResetPassword = (props: any) => {
  const { text } = useLang({
    file: "pages",
    selector: "verify email",
  });

  const isExpired = props.isExpired;
  const notExist = props.notExist;
  const isActivited = props.isActivited;
  useEffect(() => {
    if (isActivited) {
      toast.success(text("activated title"));
    }
  }, [isActivited]);

  return (
    <div className="relative flex h-screen w-screen flex-row items-stretch">
      <div className="flex-grow bg-primary"></div>
      <div className="flex-grow bg-[#BBC3D7]"></div>
      <div className="fixed z-20 flex h-screen w-screen flex-row items-center justify-center p-4">
        <div className="flex w-[500px] flex-col gap-4 rounded-xl bg-white p-10">
          <div className="flex flex-col items-center gap-5">
            <Image src="/assets/logo.png" width={100} height={50} alt="logo" />
            <p className="text-center italic text-red-800">
              {isActivited
                ? `🎉 ${text("activated title")}`
                : notExist
                ? text("deleted title")
                : text("expired title")}
            </p>
            <Link
              href="/dashboard"
              className="!important btn-primary btn-wide btn-sm btn no-underline hover:text-white"
            >
              <p>{text(notExist || isActivited ? "button 1" : "button 2")}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
