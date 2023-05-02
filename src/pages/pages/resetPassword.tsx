import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { GetServerSideProps } from "next";
import { User } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { prisma } from "../../server/db/client";
import { Token } from "@prisma/client";
import { useLang, useNotif } from "../hooks";
import { TextField } from "@mui/material";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
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
  return {
    props: {
      isExpired,
      tokenId,
      notExist,
      user_id: token?.user_id || "",
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "pages",
      ])),
    },
  };
};
const ResetPassword = (props: any) => {
  const { text: common } = useLang(undefined);
  const { text } = useLang({
    file: "pages",
    selector: "reset password",
  });
  const { succes, error } = useNotif();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const isExpired = props.isExpired;
  const tokenId = props.tokenId;
  const notExist = props.notExist;
  const user_id = props.user_id;
  const router = useRouter();
  const { mutate } = trpc.auth.resetPassword.useMutation({
    onSuccess: (data) => {
      succes();
      router.push("/auth/login");
    },
    onError: (err) => {
      console.log("err", err);
      error();
    },
  });
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error(common("input.fill all fields"));
      return;
    }
    if (password.length < 6) {
      toast.error(common("input.min6"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(common("input.no conform"));
      return;
    }
    mutate({ password, token: tokenId, user_id });
  };

  return (
    <div className="relative flex h-screen w-screen flex-row items-stretch">
      <div className="flex-grow bg-primary"></div>
      <div className="flex-grow bg-[#BBC3D7]"></div>
      <div className="fixed z-20 flex h-screen w-screen flex-row items-center justify-center p-4">
        <form
          onSubmit={onSubmit}
          className="flex w-[500px] flex-col gap-4 rounded-xl bg-white p-10"
        >
          {isExpired ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-center italic text-red-800">
                {notExist ? text("deleted title") : text("expired title")}
              </p>
              <Link
                href="/auth/login"
                className="!important btn-primary btn-wide btn-sm btn no-underline hover:text-white"
              >
                <p>{common("button.login")}</p>
              </Link>
            </div>
          ) : (
            <>
              <h6>{text("title")}</h6>
              <div className="flex flex-col items-stretch gap-2">
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label={common("input.password")}
                  className=""
                  type="password"
                />
                <TextField
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label={common("input.confirm password")}
                  className=""
                  //  size="small"
                  type="password"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-primary btn-sm btn">
                  {common("button.validate")}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
