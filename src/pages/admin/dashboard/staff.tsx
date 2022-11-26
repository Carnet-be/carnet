import React, { useRef } from "react";

import { type NextPage } from "next";

import Dashboard from "@ui/dashboard";
import { AddIcon, MoreIcon } from "@ui/icons";
import { trpc } from "@utils/trpc";
import { toast } from "react-hot-toast";
import cx from "classnames";
import LayoutState from "@ui/layoutState";
import SimpleInput from "@ui/components/simpleInput";
import { type SubmitHandler, useForm } from "react-hook-form";
import { emailPatternValidation } from "@utils/extra";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { User } from "@prisma/client";

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   //   const session = await getServerAuthSession(ctx);
//   //   console.log(session?.user);
//   //   if (!session) {
//   //     return {
//   //       redirect: {
//   //         destination: "/admin",
//   //         permanent: true,
//   //       },
//   //     };
//   //   }

//   return {
//     props: {},
//   };
// };
const AdminDashboard: NextPage = () => {
  const {
    data: staffs,
    isLoading,
    isError,
    refetch,
  } = trpc.admin.getStaff.useQuery(undefined, {
    onError: (err) => {
      console.log(err);
      toast.error("Erreur lors de la récuperation des staffs");
    },
  });

  const [animateStaff] = useAutoAnimate();
  const [animateDemande] = useAutoAnimate();

  //dialog
  const idAdd = "add";
  return (
    <Dashboard type="ADMIN">
      <div className="flex flex-row items-center justify-between">
        <h1 className="title-dashboard">Gestion des staffs</h1>

        <label htmlFor={idAdd} className="btn-primary btn flex flex-row gap-2">
          <AddIcon className="icon" />
          Nouveau
        </label>
      </div>
      <div className="divider" />
      <LayoutState
        isError={isError}
        isLoading={isLoading}
        length={
          [...(staffs?.demandes || []), ...(staffs?.staffs || [])].length || 0
        }
        hasData={staffs ? true : false}
      >
        <h3 className="pt-[20px] pb-[10px] italic opacity-30">
          Comptes actifs
        </h3>
        <ul className="flex flex-col gap-4">
          {staffs?.staffs.map((d, i) => {
            return <StaffItem key={i} item={d} />;
          })}
        </ul>
        <h3 className="pt-[20px] pb-[10px] italic opacity-30">En attente</h3>
        <ul className="flex flex-col gap-4">
          {staffs?.demandes.map((d, i) => {
            return (
              <div key={i} className="rounded-lg bg-white py-4 px-2">
                {d.username}
              </div>
            );
          })}
        </ul>
      </LayoutState>
      <AddStaffDialog id={idAdd} refetch={refetch} />
    </Dashboard>
  );
};

const StaffItem = ({ item }: { item: User }) => {
  return (
    <div className="flex flex-row items-center gap-3 rounded-lg bg-white py-3 px-4 group">
      <div className="placeholder avatar">
        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
          <span className="uppercase">
            {item.username[0]}
            {item.username[1]}
          </span>
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-1">
        <h4>{item.username}</h4>
        <p className="text-sm italic text-amber-600 opacity-75">{item.email}</p>
      </div>
      <div className="flex-row gap-2 items-center hidden group-hover:flex transition-all">
      <button className="btn btn-square btn-ghost">
 <MoreIcon className="icon"/>
</button>
      </div>

    </div>
  );
};

type AddDialogProps = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
};

type TStaff = {
  username: string;
  email: string;
};
const AddStaffDialog = ({ id, refetch }: AddDialogProps) => {
  const { mutate: sendDemandeStaff, isLoading } =
    trpc.admin.demandeStaff.useMutation({
      onError: (err) => {
        console.log("err", err);
        toast.error("Problème rencontré");
      },
      onSuccess: () => {
        // toast.success('Demande')
        closeRef.current?.click();
        reset();
        refetch();
      },
    });
  const { register, handleSubmit, formState, reset } = useForm<TStaff>();
  const { errors } = formState;
  const onSubmit: SubmitHandler<TStaff> = (data) => sendDemandeStaff(data);
  const closeRef = useRef<HTMLLabelElement>(null);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-semibold">Ajouter un nouveau staff</h3>
          <div className="flex max-w-md flex-col gap-2 pt-[10px]">
            <SimpleInput
              error={errors.username}
              placeholder="Username"
              controler={{ ...register("username", { required: true }) }}
            />

            <SimpleInput
              error={errors.email}
              placeholder="Email"
              controler={{
                ...register("email", {
                  required: true,
                  pattern: emailPatternValidation,
                }),
              }}
            />
          </div>
          <div className="modal-action">
            <label
              ref={closeRef}
              htmlFor={id}
              onClick={() => {
                // reset()
              }}
              className="btn-ghost btn"
            >
              annuler
            </label>
            <button
              type="submit"
              className={cx("btn", {
                loading: isLoading,
              })}
            >
              valider
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default AdminDashboard;
