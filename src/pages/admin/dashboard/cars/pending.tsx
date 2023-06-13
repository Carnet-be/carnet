import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CarsPage } from ".";

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
    props: {
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
const Pending = () => {
  return <CarsPage state="pending" />;
};

export default Pending;
