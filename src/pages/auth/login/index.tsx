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
import { type NextPage, type GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log(session?.user);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }
  return { props: {} };
};
const Login: NextPage = () => {
  const router = useRouter();
  const [isLoading,setisLoading] = useState(false);
  const [remember, setremember] = useState(true);
  const { register, handleSubmit, formState } = useForm<TLogin>({
    mode: "onChange",
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<TLogin> = async (data) => {
   
    setisLoading(true)
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then((data)=>{
      if(data?.ok){
        toast.success("Vous êtes connectés avec succès")
        router.replace("/dashboard");
      }else{
        switch (data?.error) {
          case "Password invalid":

             toast.error("Password invalide");
             break
          case "User not exist":
             toast.error("Compte inexistant, veuillez en créer un")
             break
         case "User is admin":
          toast.error("Ce compte est admin ou staff")
          break
          default:
             toast.error("Erreur lors de Sign up");
             break
        
        }
      }
    }).finally(()=>{
      setisLoading(false)
    })


   
    
     
  
    
  };
  return (
    <Auth>
      <div className="flex flex-grow flex-col justify-center gap-2">
        <div className="h-[30px]"></div>

        <h1 className="text-3xl font-semibold  text-primary">
          Vendez votre voiture avec CarNet
        </h1>

        <p className="py-3 text-opacity-70">
          Welcome back! Please login to your account.
        </p>
        <div className="h-[30px]"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-lg flex-col"
        >
          <Input
            label="Email"
            error={errors.email}
            icon={<EmailIcon />}
            controler={{
              ...register("email", {
                required: "Champs obligatoire",
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Email invalide",
                },
              }),
            }}
          />

          <Input
            label="Password"
            error={errors.password}
            type="password"
            icon={<PasswordIcon />}
            controler={{
              ...register("password", {
                required: "Champs obligatoire",
                minLength: {
                  value: 6,
                  message: "La taille doit dépasser 6 caractères",
                },
              }),
            }}
          />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3 text-opacity-75">
              <input
                type="checkbox"
                checked={remember}
                onChange={(v) => setremember(v.currentTarget.checked)}
                className="checkbox-primary checkbox  checkbox-sm"
              />
              <span>Remember Me</span>
            </div>
            <Link href="/">Forgot Password?</Link>
          </div>
          <div className="h-[10px]"></div>

          <div className="h-[30px]"></div>
          <button
            type="submit"
            className={cx("btn-primary btn-wide btn rounded-2xl px-7", {
              loading: isLoading,
            })}
          >
            Login
          </button>
          <div className="h-[20px]"></div>
          <p>
            Don’t have an account ?{" "}
            <Link href="/auth/signup/bidder" className="text-primary">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Auth>
  );
};

export default Login;
