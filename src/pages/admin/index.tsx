import { type UserType, type TLogin } from "@model/type";
import Logo from "@ui/components/logo";
import { EmailIcon, PasswordIcon } from "@ui/icons";
import { hash } from "bcrypt";
import { type GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";
import { useLang } from "../hooks";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
    });

    return {
      redirect: {
        destination: user?.type == "ADMIN" ? "/admin/dashboard" : "/",
        permanent: true,
      },
    };
  }
  const user = {
    username: "Naim Abdelkerim",
    type: "ADMIN" as UserType,

    email: "naimdev@gmail.com",
    emailVerified: true,
  };
  const pwd = await hash("123456", 10);
  const count = await prisma.user.count({
    where: {
      email: user.email,
    },
  });

  if (count === 0) {
    await prisma.user.create({
      data: {
        ...user,
        password: pwd,
      },
    });
  }
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || "fr", ["common"])),
    },
  };
};
const Admin = () => {
  const [remember, setremember] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    //  mode: "onChange",
  });
  const { text: common } = useLang(undefined);
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const onSubmit: SubmitHandler<TLogin> = (data) => {
    setisLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      isAdmin: true,
      redirect: false,
    })
      .then((data) => {
        if (data?.ok) {
          toast.success(common("toast.auth.success"));
          router.replace("/admin/dashboard");
        } else {
          switch (data?.error) {
            case "Password invalid":
              toast.error(common("toast.auth.password invalid"));

              break;
            case "User not exist":
              toast.error(common("toast.auth.user not exist"));
              break;
            case "User not admin":
              toast.error(common("toast.auth.user not admin"));
              break;
            default:
              toast.error(common("toast.auth.failed"));
              break;
          }
        }
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-primary p-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-xl bg-[#196EBD]/60 p-2 py-5"
      >
        <div className="h-[20px]"></div>
        <Logo size={70} type={"2"} />
        <div className="h-[20px]"></div>
        <h1 className="text-2xl font-semibold text-white">
          {common("button.login")}
        </h1>
        <div className="flex w-full max-w-[300px] flex-col gap-1 rounded-md bg-primary p-3">
          <div className="flex flex-row gap-3">
            <EmailIcon className="text-2xl text-white " />
            <input
              placeholder={common("input.email")}
              {...register("email", {
                required: common("input.required"),
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: common("input.invalid"),
                },
              })}
              className="text-semibold w-full bg-transparent text-white"
            />
          </div>
        </div>
        <div className="flex w-full max-w-[300px] flex-col gap-1 rounded-md bg-primary p-3">
          <div className="flex flex-row gap-3">
            <PasswordIcon className="text-2xl text-white " />
            <input
              type={"password"}
              placeholder={common("input.password")}
              {...register("password", {
                required: common("input.required"),
                minLength: {
                  value: 6,
                  message: common("input.min6"),
                },
              })}
              className="text-semibold w-full bg-transparent text-white"
            />
          </div>
        </div>
        <div className="flex w-full max-w-[300px] flex-row justify-between text-sm text-white">
          <div className="flex flex-row items-center gap-3 text-opacity-75"></div>
          <Link href="/">{common("text.password forget")}?</Link>
        </div>
        <div className="h-[20px]"></div>
        <div className="flex flex-row gap-6">
          <div
            onClick={() => router.push("/")}
            className="w-full w-[130px] cursor-pointer rounded-lg border border-white py-2 px-1 text-center font-semibold text-white"
          >
            {common("text.home")}
          </div>
          <button
            type="submit"
            className="w-full w-[130px] rounded-lg bg-white py-2 px-1 font-semibold text-primary"
          >
            {common("button.login")}
          </button>
        </div>
        <div className="h-[20px]"></div>
      </form>
    </div>
  );
};

export default Admin;
