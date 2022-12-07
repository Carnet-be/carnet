/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TSignupAuc, type TLogin } from "@model/type";
import Input from "@ui/components/input";
import { EmailIcon, PasswordIcon, PersonIcon, TelIcon } from "@ui/icons";
import { signIn } from "next-auth/react";
import  { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import cx from "classnames";
import { TERMS_URL, PRIVACY_POLICY_URL } from "@data/link";
import { trpc } from "@utils/trpc";
import Link from "next/link";
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
      //TODO:Signin
    },
  });

  const onSubmit: SubmitHandler<TSignupAuc> = async (data) => {
    signup({
      ...data,
      setEmailVerified:true,
      type: "AUC"
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-[80%] flex-col items-center"
    >
      <div className="h-[20px]"></div>
      <Input
        label="Nom d'utilisateur"
        error={errors.username}
        icon={<PersonIcon />}
        controler={{
          ...register("username", { required: "Champs obligatoire" }),
        }}
      />
      <div className="flex w-full flex-row gap-4">
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
      <div className="flex w-full flex-row gap-4">
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
          loading: isLoading,
        })}
      >
        Créer un compte
      </button>
      <div className="h-[20px]"></div>
      <p>
        Vous avez déjà un compte ?{" "}
        <label
          onClick={() => setisLogin(true)}
          className="cursor-pointer text-primary"
        >
          connexion
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
        } else {
          switch (data?.error) {
            case "Password invalid":
              toast.error("Password invalide");
              break;
            case "User not exist":
              toast.error("Compte inexistant, veuillez en créer un");
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
    <div className="mx-auto flex w-[80%] flex-col items-center">
      <h5 className="py-3 text-opacity-70">
        Bienvenue! Veuillez-vous connecter à votre compte.
      </h5>
      <div className="h-[30px]"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col  items-center"
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
        <div className="h-[10px]"></div>
        <button
          type="submit"
          className={cx("btn-primary btn-wide btn rounded-2xl px-7", {
            loading: isLoading,
          })}
        >
          Connexion
        </button>
        <div className="h-[20px]"></div>
        <p>
          {"Vous n'avez pas un compte ? "}
          <label
            onClick={() => setisLogin(false)}
            className="cursor-pointer text-primary"
          >
            Inscription
          </label>
        </p>
      </form>
    </div>
  );
};
export default Step2;
