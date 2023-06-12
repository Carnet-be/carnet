import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import { type GetServerSideProps, type NextPage } from "next";
import { BannierAddAuction } from ".";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const { locale } = ctx;
  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
const Home: NextPage = () => {
  return (
    <Dashboard type="AUC">
      <div className="mockup-window border bg-base-300">
        <div className="flex justify-center bg-base-200 px-4 py-16">Hello!</div>
      </div>
    </Dashboard>
  );
};

export default Home;
