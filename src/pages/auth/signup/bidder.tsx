import Input from "@ui/components/input";
import {
  EmailIcon,
  EntrepriseIcon,
  PasswordIcon,
  PersonIcon,
  TelIcon,
} from "@ui/icons";
import React, { useState } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { PRIVACY_POLICY_URL, TERMS_URL } from "@data/link";
import { type TSignupBidder } from "@model/type";
import Auth from "@ui/auth";
import SignupLayout from "@ui/signup";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import cx from "classnames";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLang, LangContext, LangCommonContext } from "../../hooks";
import { Trans } from "react-i18next";

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
  const { locale } = ctx;
  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", ["common", "pages"])),
    },
  };
};
const Bidder = () => {
  const { text } = useLang({
    file: "pages",
    selector: "auth",
  });
  const { text: common } = useLang(undefined);
  const [agree, setagree] = useState(false);
  const [remember, setremember] = useState(true);
  //const {onCreateUser,createUserDocLoading}=useCreateUserDoc()
  const { register, handleSubmit, watch, formState } = useForm<TSignupBidder>({
    mode: "onChange",
  });

  const { errors } = formState;
  const router = useRouter();
  const { mutate: signup, isLoading } = trpc.auth.signUp.useMutation({
    onError: (err) => {
      console.log("Auth signup", err);

      toast.error(err.message);
    },
    onSuccess: (user) => {
      console.log("user after signup", user);
      toast.success("Inscription réussie");

      signIn("credentials", {
        email: user.email,
        password: watch("password"),
        redirect: false,
      })
        .then(() => {
          router.replace("/dashboard");
        })
        .catch(() => {
          router.push("/auth/login");
        });
      //TODO:Signin
    },
  });

  const onSubmit: SubmitHandler<TSignupBidder> = async (data) => {
    signup({
      ...data,
      type: "BID",
    });
  };
  return (
    <LangContext.Provider value={text}>
      <LangCommonContext.Provider value={common}>
        <Auth>
          <SignupLayout type="bidder">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <Input
                label={text("form.username")}
                error={errors.username}
                icon={<PersonIcon />}
                controler={{
                  ...register("username", {
                    required: common("input.required"),
                  }),
                }}
              />
              <div className="flex flex-row gap-4">
                <Input
                  label="Email"
                  error={errors.email}
                  icon={<EmailIcon />}
                  controler={{
                    ...register("email", {
                      required: common("input.required"),
                      pattern: {
                        value:
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: common("input.invalid"),
                      },
                    }),
                  }}
                />
                <Input
                  label={text("form.telephone")}
                  error={errors.tel}
                  controler={{
                    ...register("tel", { required: common("input.required") }),
                  }}
                  icon={<TelIcon />}
                />
              </div>
              <Input
                label={text("form.company name")}
                error={errors.nomEntreprise}
                controler={{
                  ...register("nomEntreprise", {
                    required: common("input.required"),
                  }),
                }}
                icon={<EntrepriseIcon />}
              />
              <div className="flex flex-row gap-4">
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
                <Input
                  label={text("form.confirm password")}
                  type="password"
                  error={errors.confirmPassword}
                  controler={{
                    ...register("confirmPassword", {
                      required: common("input.required"),
                      validate: {
                        isValid: (v) =>
                          v == watch("password")
                            ? true
                            : common("input.no conform"),
                      },
                    }),
                  }}
                  icon={<PasswordIcon />}
                />
              </div>

              <div className="h-[10px]"></div>
              <div className="flex flex-row items-center gap-3  text-opacity-75">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(v) => setagree(v.currentTarget.checked)}
                  className="checkbox-primary checkbox  checkbox-sm"
                />
                <span>
                  <Trans i18nKey={text("accept terms and privacy")}>
                    {text("accept terms and privacy")}{" "}
                    <Link
                      target={"_blank"}
                      href={TERMS_URL}
                      className="text-primary"
                    >
                      {common("text.terms and conditions")}
                    </Link>
                    ,{" "}
                    <Link
                      target={"_blank"}
                      href={PRIVACY_POLICY_URL}
                      className="text-primary"
                    >
                      {common("text.privacy policy")}
                    </Link>
                  </Trans>
                </span>
              </div>
              <div className="h-[30px]"></div>
              <button
                type="submit"
                className={cx("btn-primary btn-wide btn rounded-2xl px-7", {
                  loading: isLoading,
                  "btn-disabled": !agree,
                })}
              >
                {text("register.button")}
              </button>
              <div className="h-[20px]"></div>
              <p>
                {text("register.footer.have account")}{" "}
                <Link href="/auth/login" className="text-primary">
                  {text("register.footer.link")}
                </Link>
              </p>
            </form>
          </SignupLayout>
        </Auth>
      </LangCommonContext.Provider>
    </LangContext.Provider>
  );
};

export default Bidder;
