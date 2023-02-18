/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalMessage } from "@prisma/client";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Dashboard from "@ui/dashboard";
import { trpc } from "@utils/trpc";
import { Button, Input } from "antd";
import { GetServerSideProps } from "next";
import animationEmpty from "../../../../public/animations/mo_message.json";
import cx from "classnames";
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

import React, { useState } from "react";
import Lottie from "@ui/components/lottie";

const Chat = () => {
  const [text, setText] = useState<string>("");
  const { mutate: send, isLoading } = trpc.message.sendToAdmin.useMutation({
    onSuccess: (d) => {
      setText("");
    },
  });
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(text);
    send({ message: text });
  };
  const { data: messages, isLoading: isGettingMessage } =
    trpc.message.getMessagesClient.useQuery(undefined, {
      refetchInterval: 1000,
      refetchOnWindowFocus: false,
    });
  return (
    <Dashboard type={"AUC"}>
      <div className="absolute bottom-0 left-0 flex h-screen w-full flex-col items-center gap-6 py-6 px-10 ">
        <div className="flex w-full w-full flex-grow lg:max-w-[700px]">
          <DisplayMessage items={messages || []} />
        </div>
        <form
          onSubmit={onSubmit}
          className="w-full items-center rounded-md lg:max-w-[700px]"
        >
          <Input.Group className="flex w-full flex-grow flex-row items-center gap-3">
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="large"
              placeholder="Type your message here..."
              className="flex-grow"
              style={{ width: "calc(100% - 200px)" }}
            />
            <button
              className={cx("btn-primary btn", {
                loading: isLoading,
              })}
            >
              send
            </button>
          </Input.Group>
        </form>
      </div>
    </Dashboard>
  );
};

const DisplayMessage = ({
  items,
  isAdmin,
}: {
  items: InternalMessage[];
  isAdmin?: boolean;
}) => {
  return (
    <div className="flex w-full flex-col-reverse items-stretch overflow-scroll">
      {items.length === 0 && (
        <div className="mx-auto w-[300px]">
          <Lottie animationData={animationEmpty} />
        </div>
      )}
      {items.map((message, i) => {
        return (
          <div
            key={i}
            className={cx("chat", {
              "chat-start": isAdmin
                ? message.type === "client"
                  ? true
                  : false
                : message.type === "admin"
                ? true
                : false,
              "chat-end": isAdmin
                ? message.type === "admin"
                  ? true
                  : false
                : message.type === "client"
                ? true
                : false,
            })}
          >
            <div className="chat-bubble">{message.content}</div>
          </div>
        );
      })}

      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col items-start"></div>
      </div>
    </div>
  );
};

export default Chat;
