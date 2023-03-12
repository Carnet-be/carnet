/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalMessage } from "@prisma/client";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Dashboard from "@ui/dashboard";
import { trpc } from "@utils/trpc";
import { Button, Divider, Input } from "antd";
import { GetServerSideProps } from "next";
import cx from "classnames";
import { prisma } from "../../../server/db/client";
import React, { useEffect, useState } from "react";
import Lottie from "@ui/components/lottie";

import animationEmpty from "../../../../public/animations/mo_message.json";
import { TMessage, getMessages, sendMessage } from "@repository/index";
import { TRPCClient } from "@trpc/client";
import moment from "moment";
import { AvatarImg } from "@ui/profileCard";
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
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [receiver, setReceiver] = useState<string | undefined>(undefined);
  const {data,refetch}=trpc.user.getUsersFromMessages.useQuery(messages,{
    enabled:messages.length>0,
    onSettled:()=>{
      console.log("refetch")
       setIsLoading(false);
    }
  })
  useEffect(() => {
    getMessages({
      id: "ADMIN",
      setMessage: (messages) => {
        setMessages(messages);
        refetch()
      },
    });
  }, []);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(text);
    setIsLoading(true);
    sendMessage({
      content: text,
      sender: "ADMIN",
      receiver: receiver || "ADMIN",
    })
      .then((res) => {
        setText("");
       
      })
  };
  return (
    <Dashboard type={"ADMIN"} hideNav>
      <div className="flex flex-row items-stretch">
        <div className="w-[400px]">
          <div className="h-[60px] w-full justify-center items-center border-b-[1px] flex text-2xl">
            Messages
          </div>
          <div>
            
          </div>
          <div className="p-4">
            {data?.map((item) => {
              const lastMessage = messages.find(
                (message) =>
                  message.sender === item.id || message.receiver === item.id
              );
             
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setReceiver(item.id);
                  }}
                  className={cx(
                    "flex flex-row items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer",
                    {
                      "bg-gray-100": item.id === receiver,
                    }
                  )}
                >
                  <div className="flex flex-row items-center gap-3">
                    <AvatarImg img={item.image}/>
                    <div className="flex flex-col">
                      <div className="font-bold">{item.username}</div>
                      <div className="text-sm text-gray-400 line-clamp-2">
                        {lastMessage?.content}
                        hjsfdjfhdbfsb sjdsdsjbds d sjdsjbdjsbbdsjbd 
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-400">
                      {moment.unix(lastMessage?.date as any).format("DD/MM/YYYY hh:mm")}
                    </div>
                   
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-[1px] bg-gray-200" />
        <div
          className={cx(
            "flex h-full w-full flex-col-reverse items-center gap-6 py-6 px-10 "
          )}
        >
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-row items-center  items-center justify-center rounded-md bg-white p-4 shadow-md lg:max-w-[700px]"
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
          <div
            className={cx("w-full flex-grow overflow-scroll lg:max-w-[700px]")}
          >
            <DisplayMessage items={messages || []} id={"ADMIN"} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Chat;

/* eslint-disable @typescript-eslint/no-explicit-any */

const DisplayMessage = ({
  items,
  id,
}: {
  items: TMessage[];
  id: "ADMIN" | string;
}) => {
  return (
    <div className="chaty flex w-full flex-col items-stretch">
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
              // "snap-proximity": i===0,
              "chat-start": message.receiver === id ? true : false,
              "chat-end": message.receiver === id ? false : true,
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
