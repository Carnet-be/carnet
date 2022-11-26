import React from "react";

import { type NextPage } from "next";

import Dashboard from "@ui/dashboard";
import { AddIcon} from "@ui/icons";
import { trpc } from "@utils/trpc";
import { toast } from "react-hot-toast";
import cx from 'classnames'
import LayoutState from "@ui/layoutState";
import SimpleInput from "@ui/components/simpleInput";
import { type SubmitHandler, useForm } from "react-hook-form";
import { emailPatternValidation } from "@utils/extra";

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
    refetch
  } = trpc.admin.getStaff.useQuery(undefined, {
    onError: (err) => {
      console.log(err);
      toast.error("Erreur lors de la récuperation des staffs");
    },
  });

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
        length={staffs?.length || 0}
        hasData={staffs ? true : false}
      >
        <div></div>
      </LayoutState>
      <AddStaffDialog id={idAdd} />
    </Dashboard>
  );
};

type AddDialogProps = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch:any
};

type TStaff={
  username:string,
  email:string
}
const AddStaffDialog = ({ id ,refetch}: AddDialogProps) => {
  
  const { register, handleSubmit, formState } = useForm<TStaff>();
  const { errors } = formState;
  const onSubmit:SubmitHandler<TStaff>=(data)=>{
    console.log(data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-semibold">Ajouter un nouveau staff</h3>
          <div className="pt-[10px] max-w-md flex flex-col gap-2">
          <SimpleInput error={errors.username} placeholder="Username" controler={{...register('username',{required:true})}}/>

          <SimpleInput error={errors.email} placeholder="Email" controler={{...register('email',{required:true,pattern:emailPatternValidation})}}/>
          </div>
          <div className="modal-action">
            <label htmlFor={id} className="btn btn-ghost">
             annuler
            </label>
            <button type="submit" className={cx("btn")}>
             valider
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default AdminDashboard;
