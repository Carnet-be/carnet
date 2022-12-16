/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";

import { type GetServerSideProps, type NextPage } from "next";

import Dashboard from "@ui/dashboard";
import { AddIcon, DeleteUserIcon, EmailIcon, PersonIcon } from "@ui/icons";
import { trpc } from "@utils/trpc";
import { toast } from "react-hot-toast";
import cx from "classnames";
import LayoutState from "@ui/layoutState";
import SimpleInput from "@ui/components/simpleInput";
import { type SubmitHandler, useForm } from "react-hook-form";
import { emailPatternValidation } from "@utils/extra";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type User } from "@prisma/client";
import { Drawer } from "rsuite";
import { TelIcon } from "../../../ui/icons";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    console.log(session?.user);
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    }

  return {
    props: {},
  };
};
const AdminDashboard: NextPage = () => {
  const {
    data: data,
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
  const { isLoading: suppressionLoading, mutate: supprimer } =
    trpc.admin.deleteDemande.useMutation({
      onError: (err) => {
        console.log("err", err);
        toast.error("Echec de la suppression");

      },
      onSuccess() {
        toast.success("Suppression réussi");
        refetch();
      },
    });
  //dialog
  const idAdd = "add";
  const [item, setitem] = useState<User | undefined>(undefined);
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
          [...(data?.demandes || []), ...(data?.staffs || [])].length || 0
        }
        hasData={data ? true : false}
      >
        <h6 className={cx("pt-[20px] pb-[10px] italic opacity-30",{
          hidden:data?.staffs.filter(s=>s.isActive).length==0
        })}>
          Comptes actifs
        </h6>
        <ul ref={animateStaff as any} className="flex flex-col gap-4 z-0">
          {data?.staffs.filter(s=>s.isActive).map((d, i) => {
            return <StaffItem key={i} item={d} onClick={() => setitem(d)} />;
          })}
        </ul>
        <h6 className={cx("pt-[20px] pb-[10px] italic opacity-30",{
          hidden:data?.staffs.filter(s=>!s.isActive).length==0
        })}>
          Comptes inactifs
        </h6>
        <ul ref={animateStaff as any} className="flex flex-col gap-4 opacity-80">
          {data?.staffs.filter(s=>!s.isActive).map((d, i) => {
            return <StaffItem key={i} item={d} onClick={() => setitem(d)} />;
          })}
        
        </ul>
        <h6 className={cx("pt-[20px] pb-[10px] italic opacity-30",{
          hidden:data?.demandes.length===0
        })}>En attente</h6>
        <ul ref={animateDemande as any} className="flex flex-col gap-4">
          {data?.demandes.map((d, i) => {
            return (
              <div key={i} className="rounded-lg bg-white py-4 px-2 flex flex-row justify-between group">
                       <h6 className="flex items-center py-2">{d.username}(<p className="text-sm italic text-amber-600 opacity-75">{d.email}</p>)</h6>
                 <button onClick={()=>{
                    supprimer(d.id)
                  }} className={cx("btn btn-error btn-outline flex-row gap-2  hidden btn-sm group-hover:flex",{
                  loading:suppressionLoading
                 })}>
                  <DeleteUserIcon  className="icon"/>
                  supprimer
                 </button>
              </div>
            );
          })}
        </ul>
      </LayoutState>
      <AddStaffDialog id={idAdd} refetch={refetch} />
      <StaffDrawer
        item={item}
        close={() => setitem(undefined)}
        refetch={refetch}
      />
    </Dashboard>
  );
};

type StaffDrawer = {
  item: User | undefined;
  close: () => void;
  refetch: any;
};

const StaffDrawer = ({ item, close, refetch }: StaffDrawer) => {
  type TStaffDrawer = {
    username: string;
    email: string;
    tel: string;
  };
  const { register, handleSubmit, watch, setValue, getValues } =
    useForm<TStaffDrawer>();

  const [disable, setdisable] = useState(true);
  const { isLoading: suppressionLoading, mutate: supprimer } =
    trpc.admin.deleteStaff.useMutation({
      onError: (err) => {
        console.log("err", err);
        toast.error("Echec de la suppression");
      },
      onSuccess() {
        toast.success("Suppression réussi");
        refetch();
      },
    });
  const { isLoading, mutate: update } = trpc.admin.updateStaff.useMutation({
    onError: (err) => {
      console.log("err", err);
      toast.error("Echec de la modification");
    },
    onSuccess() {
      toast.success("Compte staff modifié");
      refetch();
    },
  });
  useEffect(() => {
    if (item) {
      init(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  const init = (item: User) => {
    setValue("email", item.email);
    setValue("username", item.username);
    setValue("tel", item.tel || "");
    setdisable(item.isActive);
  };
  const changed = () => {
    if (watch("email") !== item?.email) return true;
    if (watch("username") !== item?.username) return true;
    if (watch("tel") !== item?.tel || "") return true;
    if (disable !== item?.isActive) return true;
  };
  const onSubmit: SubmitHandler<TStaffDrawer> = async (data) =>
    update({ id: item?.id || "", data: { ...data, isActive: disable } });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Drawer open={item ? true : false} onClose={close} size="xs">
        <Drawer.Header>
          <Drawer.Actions className="jusitify-end flex flex-row gap-2">
            <button
              onClick={() => {
                if (item) init(item);
              }}
              className={cx("btn-ghost btn-sm btn", {
                hidden: !changed(),
              })}
            >
              annuler
            </button>
            <button
              onClick={() => {
                const data = getValues();
                update({
                  id: item?.id || "",
                  data: { ...data, isActive: disable },
                });
              }}
              className={cx("btn-primary btn-sm btn", {
                "btn-disabled": !changed(),
                loading: isLoading,
              })}
            >
              confirmer
            </button>
          </Drawer.Actions>
        </Drawer.Header>

        <Drawer.Body className="flex flex-col gap-2">
          <div className="placeholder avatar">
            <div className="w-full rounded-lg bg-neutral-focus text-neutral-content">
              <h2 className="text-4xl uppercase">
                {item?.username[0]}
                {item?.username[1]}
              </h2>
            </div>
          </div>
          <div className="h-[10px]"></div>
          <h6 className="flex flex-row items-center gap-2">
            <PersonIcon />
            <input {...register("username")} type="text" className="w-full" />
          </h6>
          <h6 className="flex flex-row items-center gap-2">
            <EmailIcon />{" "}
            <input {...register("email")} type="email" className="w-full" />
          </h6>
          <h6 className="flex flex-row items-center gap-2">
            <TelIcon />{" "}
            <input {...register("tel")} type="text" className="w-full" />
          </h6>
          <div className="flex-grow"></div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="toggle"
                checked={disable}
                onChange={(v) => setdisable(v.currentTarget.checked)}
              />
              <span className="label-text">
                Compte {disable ? "activé" : "désactivé"}
              </span>
            </label>
          </div>
          <button
            onClick={() => {
              supprimer(item?.id || "");
            }}
            className={cx(
              "btn-outline btn-error btn-sm btn flex w-full flex-row gap-2 rounded-md",
              {
                loading: suppressionLoading,
              }
            )}
          >
            <DeleteUserIcon className="icon" />
            Supprimer le compte
          </button>
        </Drawer.Body>
      </Drawer>
    </form>
  );
};
const StaffItem = ({ item, onClick }: { item: User; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-row items-center gap-3 rounded-lg bg-white py-3 px-4 transition-all hover:shadow-sm"
    >
      <div className="placeholder avatar">
        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
          <span className="uppercase">
            {item.username[0]}
            {item.username[1]}
          </span>
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-1">
        <h6>{item.username}</h6>
        <p className="text-sm italic text-amber-600 opacity-75">{item.email}</p>
      </div>
      {/* <div className="hidden flex-row items-center gap-2 transition-all group-hover:flex">
        <button className="btn-ghost btn-square btn">
          <MoreIcon className="icon" />
        </button>
      </div> */}
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
