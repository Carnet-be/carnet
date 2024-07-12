/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, currentUser } from "@clerk/nextjs";
import Navbar from "~/app/_components/Navbar";
import Sidebar from "~/app/_components/Sidebar";

const DashboardLayout = async ({ children }: any) => {
  const authData = auth();
  const user = await currentUser();
  const isAdmin = user?.privateMetadata?.role === "admin";
  return (
    <div className="antialiased ">
      <Navbar
        isAdmin={isAdmin}
        auth={{
          orgId: authData.orgId!,
          userId: authData.userId!,
        }}
      />

      <Sidebar isAdmin={isAdmin} />
      <main className="min-h-screen px-3  pt-[150px] md:ml-64 md:px-10 md:pt-[100px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
