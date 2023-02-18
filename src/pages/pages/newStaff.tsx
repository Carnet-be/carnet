import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
  type NextPage,
} from "next";
import { trpc } from "@utils/trpc";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import cx from "classnames";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";
import { type DemandeStaff } from "@prisma/client";
import Logo from "@ui/components/logo";
import { type TSignupAuc } from "@model/type";
import { type SubmitHandler, useForm } from "react-hook-form";
import { PersonIcon, EmailIcon, TelIcon, PasswordIcon } from "@ui/icons";
import Input from "@ui/components/input";
import { signIn } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const id = ctx.query.id as string;
  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const demande: DemandeStaff = await prisma.demandeStaff
    .findFirst({ where: { id } })
    .then((demande) => JSON.parse(JSON.stringify(demande)));
  if (!demande) {
    return {
      redirect: {
        destination: "/admin",
        permanent: true,
      },
    };
  }
  return { props: { demande } };
};
const EmailVerification: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const demande: DemandeStaff = props.demande;
  const { mutate: completAccount,isLoading } = trpc.auth.addStaff.useMutation({
    onError: (err) => {
      console.log("Auth signup", err);

      toast.error(err.message);
    },
    onSuccess: (result) => {
      toast.success("vous avez complété votre compte");

      signIn("credentials", {
        email: result[1].email,
        password: watch("password"),
        redirect: false,
      })
        .then(() => {
          router.replace("/admin/dashboard");
        })
        .catch(() => {
          router.push("/auth/login");
        });
      //TODO:Signin
    },
  });
  const { register, handleSubmit, watch, formState } = useForm<TSignupAuc>({
    mode: "onChange",
    defaultValues: {
      email: demande.email,
      username: demande.username,
    },
  });

  const { errors } = formState;
  const router = useRouter();
  const onSubmit: SubmitHandler<TSignupAuc> = async (data) =>
    completAccount({ idDemande: demande.id, data: { ...data, type: "STAFF" } });
  return (
    <div className="relative flex h-screen w-screen flex-row items-stretch">
      <div className="flex-grow bg-primary"></div>
      <div className="flex-grow bg-[#BBC3D7]"></div>
      <div className="fixed z-20 flex h-screen w-screen flex-row items-center justify-center p-4">
        <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-lg">
          <Logo size={50} />
          <h2>Veuillez compléter votre compte</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <Input
              label="Nom d'utilisateur"
              error={errors.username}
              icon={<PersonIcon />}
              props={{
                disabled: true,
              }}
              controler={{
                ...register("username", { required: "Champs obligatoire" }),
              }}
            />
            <div className="flex flex-row gap-4">
              <Input
                label="Email"
                error={errors.email}
                icon={<EmailIcon />}
                props={{
                  disabled: true,
                }}
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

            <div className="h-[10px]"></div>

            <button
              type="submit"
              className={cx(
                "btn-primary btn-wide btn mx-auto rounded-2xl px-7",
                {
                 loading:isLoading
                }
              )}
            >
              Valider
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
