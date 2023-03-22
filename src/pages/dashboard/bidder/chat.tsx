/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalMessage } from "@prisma/client";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Dashboard from "@ui/dashboard";
import { trpc } from "@utils/trpc";
import { Button, Input } from "antd";
import { GetServerSideProps } from "next";
import animationEmpty from "../../../../public/animations/mo_message.json";
import cx from "classnames";
import ChatPage from "@ui/chatPage";
import { prisma } from "../../../server/db/client";
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

  const user = await prisma.user
    .findUnique({
      where: {
        email: session?.user?.email || "",
      },
    })
    .then((res) => JSON.parse(JSON.stringify(res)));

  return {
    props: {
      user,
    },
  };
};

const Chat = (props: { user: any }) => {
  const { user } = props;
  console.log("user", user);
  return (
    <Dashboard type={"BID"} hideNav={true} >
      <ChatPage id={user.id} />
    </Dashboard>
  );
};

export default Chat;
