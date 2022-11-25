import React from "react";

import { type NextPage} from "next";
import { type User } from "@prisma/client";

import Dashboard from "@ui/dashboard";

import { createTheme, ThemeProvider } from "@material-ui/core";


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
    const defaultMaterialTheme = createTheme();


  return (
    <Dashboard type="ADMIN">
      <div>
    
      </div>
    </Dashboard>
  );
};

export default AdminDashboard;
