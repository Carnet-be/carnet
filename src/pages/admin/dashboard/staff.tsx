import React from "react";

import { type NextPage} from "next";

import Dashboard from "@ui/dashboard";
import { AddIcon, PersonIcon } from "@ui/icons";


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


  return (
    <Dashboard type="ADMIN">
      <div className="flex flex-row justify-between items-center">
      <h1 className="title-dashboard">Gestion des staffs</h1>
      <button className="flex flex-row gap-2 btn btn-primary">
        <AddIcon className="icon"/>
        Nouveau
      </button>
      </div>
      <div className="divider"/>
    </Dashboard>
  );
};

export default AdminDashboard;
