
import Input from "@ui/components/input";
import { EmailIcon, EntrepriseIcon, PasswordIcon, PersonIcon, TelIcon } from "@ui/icons";
import React from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { PRIVACY_POLICY_URL, TERMS_URL } from "@data/link";
import { type TSignupBidder } from "@model/type";
import Auth from "@ui/auth";
import SignupLayout from "@ui/signup";



const Bidder = () => {
  const { register, handleSubmit, watch, formState } = useForm<TSignupBidder>({
    mode: "onChange",
  });
  const { errors } = formState;
 
  const onSubmit: SubmitHandler<TSignupBidder> = (data) => console.log(data);
  return (
    <Auth>
     <SignupLayout>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-row gap-4">
        <Input
          label="Nom"
          error={errors.nom}
          icon={<PersonIcon />}
          controler={{ ...register("nom", { required: "Champs obligatoire" }) }}
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
          controler={{ ...register("tel", { required: "Champs obligatoire" }) }}
          icon={<TelIcon />}
        />
      </div>
      <Input
          label="Nom entreprise"
          error={errors.nomEntreprise}
          controler={{
            ...register("nomEntreprise", { required: "Champs obligatoire" }),
          }}
          icon={<EntrepriseIcon />}
        />
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
      <div className="flex flex-row gap-3 items-center text-opacity-75">
        <input
          type="checkbox"
          checked={true}
          className="checkbox checkbox-sm  checkbox-primary"
        />
        <span>Remember Me</span>
      </div>
      <div className="h-[10px]"></div>
      <div className="flex flex-row gap-3 items-center  text-opacity-75">
        <input
          type="checkbox"
          checked={true}
          className="checkbox checkbox-sm  checkbox-primary"
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
        className="btn btn-primary px-7 btn-wide rounded-2xl"
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

export default Bidder;

