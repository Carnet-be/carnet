"use client";
import Input from "@ui/components/input";
import { EmailIcon, PasswordIcon, PersonIcon, TelIcon } from "@ui/icons";
import React, { useState } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { PRIVACY_POLICY_URL, TERMS_URL } from "@data/link";

import cx from "classnames";
import { type TSignupAuc } from "@model/type";
import Auth from "@ui/auth";
import SignupLayout from "@ui/signup";
import { toast } from 'react-hot-toast';
import { trpc } from "@utils/trpc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Auctionnaire = () => {
  const [agree, setagree] = useState(false);
  const [remember, setremember] = useState(true);
  //const {onCreateUser,createUserDocLoading}=useCreateUserDoc()
  const { register, handleSubmit, watch, formState } =
    useForm<TSignupAuc>({
      mode: "onChange",
    });
  
  const { errors } = formState;
  const router=useRouter()
  const {mutate:signup,isLoading}=trpc.auth.signUp.useMutation({
    onError:(err)=>{
     console.log("Auth signup",err)
     
     toast.error(err.message)
    },
    onSuccess:(user)=>{
       console.log('user after signup',user)
       toast.success("Inscription réussie")
       
       signIn('credentials',{
        email:user.email,
        password:watch('password'),
        redirect:false,
       }).then(()=>{
        router.replace('/dashboard')
       }).catch(()=>{
        router.push('/auth/login')
       })
       //TODO:Signin
    }
  })
  

  const onSubmit: SubmitHandler<TSignupAuc> = async(data) => {
    signup({
      ...data, type: "AUC"
    })
  };
  return (
    <Auth>
      <SignupLayout>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-row gap-4">
            <Input
              label="Nom"
              error={errors.nom}
              icon={<PersonIcon />}
              controler={{
                ...register("nom", { required: "Champs obligatoire" }),
              }}
            />
            <Input
              label="Prénom"
              error={errors.prenom}
              controler={{
                ...register("prenom", { required: "Champs obligatoire" }),
              }}
              icon={<PersonIcon />}
            />
          </div>
          <div className="flex flex-row gap-4">
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
              label="Tél"
              error={errors.tel}
              controler={{
                ...register("tel", { required: "Champs obligatoire" }),
              }}
              icon={<TelIcon />}
            />
          </div>
          <div className="flex flex-row gap-4">
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
            <Input
              label="Confirmation de password"
              type="password"
              error={errors.confirmPassword}
              controler={{
                ...register("confirmPassword", {
                  required: "Champs obligatoire",
                  validate: {
                    isValid: (v) =>
                      v == watch("password")
                        ? true
                        : "Ne correspond pas au password",
                  },
                }),
              }}
              icon={<PasswordIcon />}
            />
          </div>
          <div className="flex flex-row items-center gap-3 text-opacity-75">
            <input
              type="checkbox"
              checked={remember}
              onChange={(v) => setremember(v.currentTarget.checked)}
              className="checkbox-primary checkbox  checkbox-sm"
            />
            <span>Remember Me</span>
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
              I agree to all{" "}
              <Link target={"_blank"} href={TERMS_URL} className="text-primary">
                the terms
              </Link>{" "}
              and{" "}
              <Link
                target={"_blank"}
                href={PRIVACY_POLICY_URL}
                className="text-primary"
              >
                Privacy policy
              </Link>
            </span>
          </div>
          <div className="h-[30px]"></div>
          <button
            type="submit"
            className={cx("btn-primary btn-wide btn rounded-2xl px-7", {
              "btn-disabled": !agree,
              loading:isLoading
            })}
          >
            Créer un compte
          </button>
          <div className="h-[20px]"></div>
          <p>
            Already have account ?{" "}
            <Link href="/auth/login" className="text-primary">
              login
            </Link>
          </p>
        </form>
      </SignupLayout>
    </Auth>
  );
};

export default Auctionnaire;
