import Input from "@ui/components/input";
import { EmailIcon, PasswordIcon } from "@ui/icons";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";

import { type TLogin } from "@model/type";

import toast from "react-hot-toast";
import cx from "classnames";
import { useRouter } from "next/router";
import Auth from "@ui/auth";
import { signIn } from "next-auth/react";

import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { type NextPage, type GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangCommonContext, LangContext, useLang } from "../../hooks";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
 
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }
  const {locale}=ctx
    return {
      props: {
        ...(await serverSideTranslations(locale||"fr", ["common","pages"])),
      },
    };
};
const Login: NextPage = () => {
  const router = useRouter();
  const {text}=useLang({
    file:"pages",
    selector:"auth"
  })
  const {text:common}=useLang(undefined)
  const [isLoading, setisLoading] = useState(false);
  const [remember, setremember] = useState(true);
  const { register, handleSubmit, formState } = useForm<TLogin>({
    mode: "onChange",
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<TLogin> = async (data) => {
    setisLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((data) => {
        if (data?.ok) {
          toast.success("Vous êtes connectés avec succès");
          router.replace("/dashboard");
        } else {
          switch (data?.error) {
            case "Password invalid":
              toast.error("Password invalide");
              break;
            case "User not exist":
              toast.error("Compte inexistant, veuillez en créer un");
              break;
            case "User is admin":
              toast.error("Ce compte est admin ou staff");
              break;
            default:
              toast.error("Erreur lors de Sign up");
              break;
          }
        }
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  return (
    <LangContext.Provider value={text}>
      <LangCommonContext.Provider value={common}>
    <Auth>
      <div className="flex flex-grow flex-col justify-center gap-2">
        <div className="h-[30px]"></div>

        <h1 className="text-3xl font-semibold  text-primary">
          {text("login.title")}
        </h1>

        <p className="py-3 text-opacity-70">
          {text("login.subtitle")}
        </p>
        <div className="h-[30px]"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-lg flex-col"
        >
          <Input
            label={text("form.email")}
            error={errors.email}
            icon={<EmailIcon />}
            controler={{
              ...register("email", {
                required: common("input.required"),
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message:common("input.invalid"),
                },
              }),
            }}
          />

          <Input
            label={text("form.password")}
            error={errors.password}
            type="password"
            icon={<PasswordIcon />}
            controler={{
              ...register("password", {
                required: common("input.required"),
                minLength: {
                  value: 6,
                  message: common("input.min6"),
                },
              }),
            }}
          />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3 text-opacity-75">
              
            </div>
            <Link href="/">{text("forget password")}</Link>
          </div>
          <div className="h-[10px]"></div>

          <div className="h-[30px]"></div>
          <button
            type="submit"
            className={cx("btn-primary btn-wide btn rounded-2xl px-7", {
              loading: isLoading,
            })}
          >
            {text("login.button")}
          </button>
          <div className="h-[20px]"></div>
          <p>
              {text("login.footer.no account")}{" "}
            <Link href="/auth/signup/bidder" className="text-primary">
              {text("login.footer.link")}
            </Link>
          </p>
        </form>
      </div>
    </Auth>

    </LangCommonContext.Provider>
    </LangContext.Provider>
  );
};

export default Login;
