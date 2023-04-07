import { User } from ".prisma/client";
import { TUser } from "@model/type";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Dashboard from "@ui/dashboard";
import SettingsSection from "@ui/settingsSection";
import { GetServerSideProps } from "next";
import { prisma } from "../../server/db/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangContext, useLang } from "../hooks";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
  const user: User = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
      include: {
        image: true,
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));
  if (!user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
  if (!user.emailVerified) {
    return {
      redirect: {
        destination: "/pages/email-verification",
        permanent: true,
      },
    };
  }
  if (!user.isActive) {
    console.log("user is not active");
    return {
      redirect: {
        destination: "/pages/inactive",
        permanent: true,
      },
    };
  }

  return {
    props: {
      user,
      ...(await serverSideTranslations(ctx.locale || "fr", [
        "common",
        "dashboard",
      ])),
    },
  };
};
const ProfilePage = (props: { user: TUser }) => {
  const { user } = props;
  const { text } = useLang({
    file: "dashboard",
    selector: "settings",
  });
  return (
    <LangContext.Provider value={text}>
      <Dashboard type={user.type}>
        <SettingsSection user={user} />
      </Dashboard>
    </LangContext.Provider>
  );
};

export default ProfilePage;
