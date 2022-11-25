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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log(session?.user);
  if (session) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: true,
      },
    };
  }
  const user = {
    nom: "Naim",
    type: "ADMIN" as UserType,
    prenom: "Abdelkerim",
    email: "naimdev@gmail.com",
    emailVerified: true,
   
  };
const pwd= await hash("123456", 10);
  const count = await prisma.user.count({
    where: {
      email: user.email,
    },
  });

  if (count === 0) {
 
  await prisma.user.create({
    data: {
      ...user,password:pwd
    },
  });
}
  return { props: {} };
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
          toast.success("Vous êtes connectés avec succès");
          router.replace("/admin/dashboard");
        } else {
          switch (data?.error) {
            case "Password invalid":
              toast.error("Password invalide");
              break;
            case "User not exist":
              toast.error("Compte inexistant, veuillez en créer un");
              break;
            case "User not admin":
              toast.error("Ce compte n'est ni admin ni staff");
              break;
            default:
              toast.error("Erreur lors du login");
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
        <h1 className="text-2xl font-semibold text-white">Connexion</h1>
        <div className="flex w-full max-w-[300px] flex-col gap-1 rounded-md bg-primary p-3">
          <div className="flex flex-row gap-3">
            <EmailIcon className="text-2xl text-white " />
            <input
              placeholder="Email"
              {...register("email", {
                required: "Champs obligatoire",
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Email invalide",
                },
              })}
              className="text-semibold w-full bg-transparent text-white"
            />
          </div>
          <span className="pl-7 text-sm italic text-red-500">
            {errors && errors.email?.message}
          </span>
        </div>
        <div className="flex w-full max-w-[300px] flex-col gap-1 rounded-md bg-primary p-3">
          <div className="flex flex-row gap-3">
            <PasswordIcon className="text-2xl text-white " />
            <input
              type={"password"}
              placeholder="Password"
              {...register("password", {
                required: "Champs obligatoire",
                minLength: {
                  value: 6,
                  message: "La taille doit dépasser 6 caractères",
                },
              })}
              className="text-semibold w-full bg-transparent text-white"
            />
          </div>
          <span className="pl-7 text-sm italic text-red-500">
            {errors && errors.password?.message}
          </span>
        </div>
        <div className="flex w-full max-w-[300px] flex-row justify-between text-sm text-white">
          <div className="flex flex-row items-center gap-3 text-opacity-75">
            <input
              type="checkbox"
              checked={remember}
              onChange={(v) => setremember(v.currentTarget.checked)}
              className="checkbox-primary checkbox checkbox-sm  bg-white"
            />
            <span>Remember Me</span>
          </div>
          <Link href="/">Password oublié?</Link>
        </div>
        <div className="h-[20px]"></div>
        <button
          type="submit"
          className="w-full max-w-[200px] rounded-lg bg-white py-2 px-1 font-semibold text-primary"
        >
          {isLoading ? "Chargement..." : "Login"}
        </button>
        <div className="h-[20px]"></div>
      </form>
    </div>
  );
};

export default Admin;
