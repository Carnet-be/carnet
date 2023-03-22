/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalMessage } from "@prisma/client";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Dashboard from "@ui/dashboard";
import { trpc } from "@utils/trpc";
import { Button, Divider, Input } from "antd";
import { GetServerSideProps } from "next";
import cx from "classnames";
import { prisma } from "../../../server/db/client";
import React, { useEffect, useState, useCallback } from "react";
import Lottie from "@ui/components/lottie";

import animationEmpty from "../../../../public/animations/mo_message.json";
import { TMessage, getMessages, sendMessage } from "@repository/index";
import { TRPCClient } from "@trpc/client";
import moment from "moment";
import { AvatarImg } from "@ui/profileCard";
import { debounce } from "lodash";
import { TUser } from "@model/type";
import { HiSearchCircle } from "react-icons/hi";
import toast from "react-hot-toast";

import aucitonaireIcon from "@assets/auctionnaire.png";
import bidderIcon from "@assets/bidder.png";
import Image from "next/image";
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

const getFirstUser = (messages: TMessage[]) => {
  const users = messages.map((message) => {
    if (message.receiver === "ADMIN") {
      return message.sender;
    } else {
      return message.receiver;
    }
  });
  return users[0];
};
const getUsersId = (messages: TMessage[]) => {
  const msg = messages.map((message) => {
    if (message.receiver === "ADMIN") {
      return message.sender;
    } else {
      return message.receiver;
    }
  });
  const users = [...new Set(msg)];
  return users;
};

type UserMessage = {
  user: TUser;
  messages: TMessage[];
};
const Chat = (props: { user: any }) => {
  const { user } = props;
  const [users, setusers] = useState<UserMessage[]>([]);
  const [selected, setselected] = useState<TUser | undefined>(undefined);
  const [usersId, setusersId] = useState<string[]>([]);
  const [messages, setMessages] = useState<TMessage[]>([]);

  const { data, refetch } = trpc.user.getUsersFromMessages.useQuery(usersId, {
    enabled: usersId.length > 0,
    onSettled: () => {
      console.log("refetch");
      // setIsLoading(false);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      toast.dismiss();
      console.log(data);
      const users = data.map((user) => ({
        user: user as TUser,
        messages: messages.filter((message) => {
          if (message.receiver === "ADMIN") {
            return message.sender === user.id;
          } else {
            return message.receiver === user.id;
          }
        }),
      }));
     if (!selected) setselected(users[0]?.user);
      setusers(users);
    },
  });

  useEffect(() => {
    getMessages({
      id: "ADMIN",
      setMessage: (messages) => {
        setMessages(messages);

        setusersId(getUsersId(messages));
        refetch();
      },
    });
  }, []);

  const onSelectedUser = (user: TUser) => {
    setselected(user);
  };
  useEffect(() => {
    console.log("selected", selected);
  }, [selected]);
  return (
    <Dashboard type={"ADMIN"} hideNav>
      <div className="flex h-screen flex-row items-stretch">
        <div className="top-0 left-0  min-w-[330px] max-w-[330px]  border-l border-r">
          <LeftSide
            usersMessages={users}
            onClick={onSelectedUser}
            selectedUserId={selected?.id}
          />
        </div>

     {users.length>0 && <RightSide userMessage={users.filter((u)=>u.user.id===selected?.id)[0]||users[0] as TUser}/>}
      </div>
    </Dashboard>
  );
};

export default Chat;

const LeftSide = ({
  usersMessages,
  onClick,
  selectedUserId,
}: {
  usersMessages: UserMessage[];
  onClick: (s: TUser) => void;
  selectedUserId: string | undefined;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seach, setseach] = useState("");
  const [users, setusers] = useState<UserMessage[]>([]);

  const { refetch } = trpc.user.search.useQuery(seach, {
    enabled: seach ? true : false,

    onError: () => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
    onSuccess: (data) => {
      toast.dismiss();
      const u: UserMessage[] = data.map((user) => ({
        user: user as TUser,
        messages: (
          usersMessages.filter((message) => message.user.id === user.id)[0] || {
            messages: [],
          }
        ).messages,
      }));
      setusers(u);
    },
  });

  useEffect(() => {
    users.length === 0 && setusers(usersMessages);
  }, [usersMessages]);

  const onSearch = (event: any) => {
    const { value } = event.target;
    toast.loading("Searching...");
    if (value) {
      refetch();
    } else {
      setusers(usersMessages);
      toast.dismiss();
    }
  };
  const debouncedChangeHandler = useCallback(debounce(onSearch, 500), []);
  return (
    <div className="w-full">
      <div className="p-3">
        <Input
          onChange={debouncedChangeHandler}
          placeholder="Search for a user"
          size="large"
        />
      </div>
      <div>
        {users.length === 0 && (
          <div className="mx-auto w-[300px]">
            <span className="py-2 italic text-red-300">Empty box</span>
          </div>
        )}
        {users.map((u, i) => {
          const { user: user, messages } = u;
          console.log('messages[0]', messages[0])
          return (
            <button
              key={i}
              onClick={() => onClick(user)}
              className={cx(
                "flex w-full cursor-pointer flex-row items-center gap-4 border-b border-gray-200 px-2 py-1 text-left ",
                selectedUserId === user.id
                  ? "bg-white"
                  : "opacity-80 hover:bg-gray-100"
              )}
            >
              <AvatarImg img={user.image} size={40} />
              <div className="flex w-full flex-col items-stretch">
                <div className="flex flex-row gap-2 items-center">

             
              <Image src={user.type==="AUC"?aucitonaireIcon:bidderIcon} alt="type" width={20} height={30}/>
                <div className="">
                <div className="text-sm font-semibold ">
                 
                 {user.username}</div>
               <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                </div>
                {messages.length > 0 && (
                  <>
                    <hr className="my-[2px]" />
                    <span className="text-xs line-clamp-2">
                      {messages[0]?.content || ""}
                    </span>
                    <span className="self-end text-xs italic opacity-40 ">
                      {moment((messages[0]?.date)).fromNow()}
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const RightSide = ({userMessage:user}:{userMessage:UserMessage}) => {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(text);
    setIsLoading(true);
    sendMessage({
      content: text,
      sender: "ADMIN",
      receiver: user?.user.id || "ADMIN",
    }).then((res) => {
      setText("");
    });
  };
  return (
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
      <div className={cx("w-full flex-grow overflow-scroll lg:max-w-[700px]")}>
        <DisplayMessage name={user?.user.username ||""} items={user?.messages || []} id={"ADMIN"} />
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */

const DisplayMessage = ({
  items,
  id,name

}: {
  items: TMessage[];
  id: "ADMIN" | string;
  name:string

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
            <span>{name}</span>
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
