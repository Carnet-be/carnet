/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TSignupAuc, type TLogin } from "@model/type";
import Input from "@ui/components/input";
import { EmailIcon, PasswordIcon, PersonIcon, TelIcon } from "@ui/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import cx from "classnames";
import { TERMS_URL, PRIVACY_POLICY_URL } from "@data/link";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import { LangCommonContext, LangContext, useLang } from "../../pages/hooks";
const Step2 = () => {
  const [isLogin, setisLogin] = useState(false);
  if (isLogin) {
    return <Login setisLogin={setisLogin} />;
  }
  return <SignUp setisLogin={setisLogin} />;
};

const SignUp = ({ setisLogin }: { setisLogin: any }) => {
  const [agree, setagree] = useState(false);
  //const {onCreateUser,createUserDocLoading}=useCreateUserDoc()
  const { register, handleSubmit, watch, formState } = useForm<TSignupAuc>({
    mode: "onChange",
  });

  const text = useContext(LangContext);
  const common = useContext(LangCommonContext);
  const { errors } = formState;
  const router = useRouter();
  const { mutate: signup, isLoading } = trpc.auth.signUp.useMutation({
    onError: (err) => {
      console.log("Auth signup", err);

      toast.error(text("toast.error"));
    },
    onSuccess: (user) => {
      console.log("user after signup", user);
      toast.success(text("text.sign up success"));

      signIn("credentials", {
        email: user.email,
        password: watch("password"),
        redirect: false,
      });
      //TODO:Signin
    },
  });

  const onSubmit: SubmitHandler<TSignupAuc> = async (data) => {
    signup({
      ...data,
      setEmailVerified: true,
      type: "AUC",
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-[80%] flex-col items-center"
    >
      <div className="h-[20px]"></div>
      <Input
        label={common("input.username")}
        error={errors.username}
        icon={<PersonIcon />}
        controler={{
          ...register("username", { required: common("input.required") }),
        }}
      />
      <div className="flex w-full flex-row gap-4">
        <Input
          label={common("input.email")}
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
          label={common("input.tel")}
          error={errors.tel}
          controler={{
            ...register("tel", { required: common("input.required") }),
          }}
          icon={<TelIcon />}
        />
      </div>
      <div className="flex w-full flex-row gap-4">
        <Input
          label={common("input.password")}
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
          label={common("input.confirm password")}
          type="password"
          error={errors.confirmPassword}
          controler={{
            ...register("confirmPassword", {
              required: common("input.required"),
              validate: {
                isValid: (v) =>
                  v == watch("password") ? true : common("input.no conform"),
              },
            }),
          }}
          icon={<PasswordIcon />}
        />
      </div>

      <div className="h-[10px]"></div>

      <div className="h-[30px]"></div>
      <button
        type="submit"
        className={cx("btn-primary btn-wide btn rounded-2xl px-7", {
          loading: isLoading,
        })}
      >
        {common("button.sign up")}
      </button>
      <div className="h-[20px]"></div>
      <p>
        {text("text.you do have an account")}
        {` `}
        <label
          onClick={() => setisLogin(true)}
          className="cursor-pointer text-primary"
        >
          {common("button.login")}
        </label>
      </p>
    </form>
  );
};

const Login = ({ setisLogin }: { setisLogin: any }) => {
  const [isLoading, setisLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<TLogin>({
    mode: "onChange",
  });
  const { errors } = formState;
  const text = useContext(LangContext);
  const common = useContext(LangCommonContext);
  const onSubmit: SubmitHandler<TLogin> = async (data) => {
    setisLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((data) => {
        if (data?.ok) {
          toast.success(common("toast.auth.success"));
        } else {
          switch (data?.error) {
            case "Password invalid":
              toast.error(common("toast.auth.password invalid"));
              break;
            case "User not exist":
              toast.error(common("toast.auth.user not exist"));
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
    <div className="mx-auto flex w-[80%] flex-col items-center">
      <h5 className="py-3 text-opacity-70">
        {text("text.welcome, please login")}
      </h5>
      <div className="h-[30px]"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col  items-center"
      >
        <Input
          label={common("input.email")}
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
          label={common("input.password")}
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
        <div className="h-[10px]"></div>
        <button
          type="submit"
          className={cx("btn-primary btn-wide btn rounded-2xl px-7", {
            loading: isLoading,
          })}
        >
          {common("button.login")}
        </button>
        <div className="h-[20px]"></div>
        <p>
          {text("text.don't have an account")}
          {` `}
          <label
            onClick={() => setisLogin(false)}
            className="cursor-pointer text-primary"
          >
            {common("button.sign up")}
          </label>
        </p>
      </form>
    </div>
  );
};
export default Step2;
