import Dashboard from "@ui/dashboard";
import { InDevelopmentMini } from "@ui/inDevelopment";
import { type GetServerSideProps, type NextPage } from "next";
import { BannierAddAuction } from ".";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";

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

  return {
    props: {},
  };
};
const Home: NextPage = () => {
  return (
    <Dashboard type="AUC">
      <BannierAddAuction />
    </Dashboard>
  );
};

export default Home;
