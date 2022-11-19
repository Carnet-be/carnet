
import Input from "@ui/components/input";
import {
  EmailIcon,
  PasswordIcon,

} from "@ui/icons";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";

import { type TLogin } from "@model/type";

import toast from "react-hot-toast";
import cx from "classnames";
import { useRouter } from "next/router";
import Auth from "@ui/auth";
import { signIn } from "next-auth/react";


const Login = () => {
  const router = useRouter();
  const { register, handleSubmit,formState } = useForm<TLogin>({
    mode: "onChange",
  });
   const { errors } = formState;

  const onSubmit: SubmitHandler<TLogin> = async(data) =>{
    await signIn('credentials',{
        email:data.email,
        password:data.password,
        redirect:false,
       
      }).then((res)=>{
       console.log(res)
       if(res?.ok){
        router.replace("/dashboard")
       }
      }).catch((err)=>{
        console.log(err)
        toast.error("Erreur lors de Sign up")
      })
}
  return (
    
    <Auth>
         <div className="flex-grow flex flex-col gap-2 justify-center">
            
           
      <div className="h-[30px]"></div>

      <h1 className="text-primary text-3xl  font-semibold">
        Vendez votre voiture avec CarNet
      </h1>

      <p className="text-opacity-70 py-3">
        Welcome back! Please login to your account.
      </p>
      <div className="h-[30px]"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-lg"
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
          <div className="flex flex-row gap-3 items-center text-opacity-75">
            <input
              type="checkbox"
              checked={true}
              className="checkbox checkbox-sm  checkbox-primary"
            />
            <span>Remember Me</span>
          </div>
          <Link href="/">Forgot Password?</Link>
        </div>
        <div className="h-[10px]"></div>

        <div className="h-[30px]"></div>
        <button
          type="submit"
          className={cx("btn btn-primary px-7 btn-wide rounded-2xl")}
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
